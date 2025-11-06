# Supabase 数据库部署指南

## 📋 部署步骤

### 1. 登录 Supabase Dashboard

访问您的 Supabase 项目:
- URL: https://djahnunbkbrfetktossw.supabase.co
- Dashboard: https://supabase.com/dashboard/project/djahnunbkbrfetktossw

### 2. 打开 SQL Editor

1. 在左侧导航栏中，点击 **SQL Editor**
2. 点击 **New query** 按钮

### 3. 执行数据库 Schema

#### 方法 A: 直接复制粘贴 (推荐)

1. 打开项目文件 `database-schema-instaplay-v7.sql`
2. 复制全部内容 (489 行)
3. 粘贴到 Supabase SQL Editor 中
4. 点击右下角的 **Run** 按钮

#### 方法 B: 分段执行 (如遇到超时问题)

如果一次性执行失败，可以分段执行：

**第一段: 创建表结构**
```sql
-- 执行第 1-271 行
-- 包含所有表的创建和 RLS 策略
```

**第二段: 创建索引**
```sql
-- 执行第 306-335 行
-- 创建性能优化索引
```

**第三段: 创建触发器和函数**
```sql
-- 执行第 342-469 行
-- 创建自动化触发器
```

### 4. 验证部署结果

执行以下查询验证表是否创建成功：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**预期结果**: 应该看到以下 7 个表:
- `users`
- `user_devices`
- `subscriptions`
- `voice_logs`
- `bookmarks`
- `folders`
- `usage_stats`

### 5. 验证 Row Level Security (RLS)

```sql
-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**预期结果**: 所有表的 `rowsecurity` 列都应该是 `true`

### 6. 验证触发器

```sql
-- 查看所有触发器
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

**预期结果**: 应该看到以下触发器:
- `update_users_updated_at`
- `update_user_devices_updated_at`
- `update_subscriptions_updated_at`
- `update_bookmarks_updated_at`
- `update_folders_updated_at`
- `deduct_voice_usage_trigger`
- `update_membership_trigger`

### 7. 设置定时任务 (Cron Job)

#### 7.1 启用 pg_cron 扩展

在 SQL Editor 中执行：
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

#### 7.2 创建每日配额重置任务

```sql
-- 每天 UTC 00:00 执行配额重置
SELECT cron.schedule(
  'reset-daily-quotas',           -- job name
  '0 0 * * *',                    -- cron expression (每天午夜)
  $$SELECT reset_usage_quotas()$$  -- SQL command
);
```

#### 7.3 验证 Cron Job

```sql
-- 查看所有 cron jobs
SELECT * FROM cron.job;
```

---

## 🔍 常见问题排查

### 问题 1: "relation already exists" 错误

**原因**: 表已经存在

**解决方案**: 
- 如果是测试环境，可以先删除旧表：
```sql
DROP TABLE IF EXISTS public.usage_stats CASCADE;
DROP TABLE IF EXISTS public.voice_logs CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.folders CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.user_devices CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```
- 然后重新执行 schema

### 问题 2: "permission denied" 错误

**原因**: 权限不足

**解决方案**:
- 确保使用的是项目所有者账户
- 或使用 Supabase 提供的 service_role key (谨慎使用)

### 问题 3: RLS 策略冲突

**原因**: 策略名称重复

**解决方案**:
```sql
-- 删除现有策略
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
-- 然后重新创建
```

### 问题 4: 触发器函数不存在

**原因**: 函数创建顺序错误

**解决方案**:
- 先创建函数，再创建触发器
- 确保按照 schema 文件的顺序执行

---

## 📊 数据库架构概览

### 核心表结构

#### 1. users (用户表)
- 扩展 Supabase Auth
- 存储会员等级、配额信息
- 管理设备绑定和年龄验证

#### 2. user_devices (设备表)
- 记录用户绑定的设备
- 支持设备管理功能

#### 3. subscriptions (订阅表)
- PayPal 订阅集成
- 管理会员订阅状态

#### 4. voice_logs (语音记录表)
- 记录语音指令使用
- 用于配额扣除和分析

#### 5. bookmarks (书签表)
- 用户保存的视频链接
- 支持标签和分类

#### 6. folders (文件夹表)
- 书签分类管理
- 支持自动分类

#### 7. usage_stats (使用统计表)
- 每日使用数据
- 用于分析和报表

---

## 🔐 Row Level Security (RLS) 策略

所有表都启用了 RLS，确保：
- ✅ 用户只能访问自己的数据
- ✅ 基于 `auth.uid()` 的权限控制
- ✅ 自动应用于所有查询

**示例策略**:
```sql
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

---

## 🤖 自动化触发器

### 1. 自动更新时间戳
所有表在 UPDATE 时自动更新 `updated_at` 字段

### 2. 语音使用扣除
插入 `voice_logs` 时自动扣除用户配额：
- Free Trial: 扣除总试用次数
- Free: 扣除每日免费次数
- Basic: 扣除每月基础次数
- Premium: 无限制，不扣除

### 3. 会员等级同步
`subscriptions` 表状态变更时自动更新 `users` 表的会员等级：
- active → 升级到 basic/premium
- cancelled/expired → 降级到 free

---

## 🧪 测试 SQL 查询

### 测试用户创建
```sql
-- 插入测试用户 (需要先在 Supabase Auth 中创建用户)
INSERT INTO public.users (id, email, membership_level)
VALUES (
  'your-user-uuid-here',
  'test@example.com',
  'free_trial'
);
```

### 测试语音记录
```sql
-- 插入语音记录 (会自动扣除配额)
INSERT INTO public.voice_logs (user_id, command_text, command_type, success)
VALUES (
  'your-user-uuid-here',
  'play video',
  'play',
  true
);

-- 检查配额是否扣除
SELECT free_trial_remaining FROM public.users WHERE id = 'your-user-uuid-here';
```

### 测试订阅创建
```sql
-- 插入订阅记录
INSERT INTO public.subscriptions (
  user_id, 
  paypal_subscription_id, 
  paypal_plan_id,
  plan_name, 
  billing_cycle,
  amount,
  status
)
VALUES (
  'your-user-uuid-here',
  'test-sub-id',
  'plan-basic-monthly',
  'basic',
  'monthly',
  9.99,
  'active'
);

-- 检查会员等级是否自动更新
SELECT membership_level, max_devices FROM public.users WHERE id = 'your-user-uuid-here';
```

---

## ✅ 部署检查清单

- [ ] 所有 7 个表创建成功
- [ ] RLS 在所有表上启用
- [ ] 所有索引创建成功 (14+ 个)
- [ ] 所有触发器创建成功 (7 个)
- [ ] Cron Job 设置成功 (每日配额重置)
- [ ] 测试用户 CRUD 操作
- [ ] 测试语音记录配额扣除
- [ ] 测试订阅状态同步

---

## 🔄 定期维护

### 每日任务
- ✅ 自动执行: `reset_usage_quotas()` (Cron Job)

### 每周任务
```sql
-- 清理过期的验证码
DELETE FROM public.users 
WHERE verification_code_expires_at < NOW();
```

### 每月任务
```sql
-- 归档旧的使用记录 (保留最近 90 天)
DELETE FROM public.usage_stats 
WHERE stat_date < CURRENT_DATE - INTERVAL '90 days';

DELETE FROM public.voice_logs 
WHERE executed_at < NOW() - INTERVAL '90 days';
```

---

## 📞 需要帮助？

如果在部署过程中遇到问题：

1. 检查 Supabase Dashboard 的 **Logs** 选项卡查看错误信息
2. 验证您的账户权限
3. 确保 Supabase 项目没有达到配额限制
4. 查看本文档的"常见问题排查"部分

---

**部署状态**: ⏳ 待执行  
**预计时间**: 5-10 分钟  
**难度**: ⭐⭐ 中等

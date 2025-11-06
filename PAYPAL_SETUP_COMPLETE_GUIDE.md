# PayPal 订阅系统完整设置指南

## 📋 目录
1. [创建 PayPal 开发者账户](#1-创建-paypal-开发者账户)
2. [创建 PayPal App 和获取凭证](#2-创建-paypal-app-和获取凭证)
3. [创建订阅产品和计划](#3-创建订阅产品和计划)
4. [配置环境变量](#4-配置环境变量)
5. [测试 PayPal 集成](#5-测试-paypal-集成)
6. [生产环境部署](#6-生产环境部署)
7. [常见问题](#7-常见问题)

---

## 1. 创建 PayPal 开发者账户

### 步骤 1.1: 注册 PayPal 开发者账户

1. 访问 **PayPal Developer Portal**:
   ```
   https://developer.paypal.com
   ```

2. 点击右上角的 **"Log In"** 或 **"Sign Up"**

3. 如果已有 PayPal 个人/商业账户，可以直接登录
   - 如果没有，需要先创建一个 PayPal 账户

4. 登录后，会自动进入 PayPal Developer Dashboard

### 步骤 1.2: 验证账户

1. 在 Dashboard 左侧导航栏，点击 **"Apps & Credentials"**
2. 如果看到提示需要验证邮箱，请前往邮箱完成验证
3. 验证完成后，开发者功能将完全解锁

---

## 2. 创建 PayPal App 和获取凭证

### 步骤 2.1: 创建 Sandbox App

1. 在 **Apps & Credentials** 页面
2. 确保顶部选择了 **"Sandbox"** 环境 (开发测试环境)
3. 点击 **"Create App"** 按钮

4. 填写应用信息:
   - **App Name**: `InstaPlay Sandbox` (或任意名称)
   - **App Type**: 选择 **"Merchant"** (商家)
   - 点击 **"Create App"**

### 步骤 2.2: 获取 Sandbox 凭证

创建完成后，你会看到:

```
Client ID: AXXXXXXXxxxxxxxxxxxxXXXXXXXXXX
Secret: EXXXXXXXxxxxxxxxxxxxXXXXXXXXXX
```

**重要**: 
- ✅ **Client ID** 是公开的，可以在前端使用
- ⚠️ **Secret** 是私密的，只能在后端使用，不要泄露

**记录这两个值**，稍后会用到。

### 步骤 2.3: 配置 App 功能

在 App 设置页面，向下滚动到 **"Features"** 部分:

1. 确保以下功能已启用:
   - ✅ **Subscriptions** (订阅功能)
   - ✅ **Payments** (支付功能)

2. 如果未启用，点击 **"Add"** 按钮启用

3. 点击页面底部的 **"Save"** 保存设置

### 步骤 2.4: 获取 Sandbox 测试账户

1. 在左侧导航栏，点击 **"Sandbox" → "Accounts"**

2. PayPal 会自动创建两个测试账户:
   - **Personal Account** (买家账户) - 用于测试购买订阅
   - **Business Account** (卖家账户) - 用于接收付款

3. 点击 **"Personal Account"** 的 **"..."** 按钮 → **"View/Edit Account"**

4. 记录以下信息:
   - **Email**: sb-xxxxx@personal.example.com
   - **Password**: 系统生成的密码 (点击 "Show" 查看)

**这个账户将用于测试订阅购买流程**

---

## 3. 创建订阅产品和计划

### 步骤 3.1: 创建订阅产品

1. 确保仍在 **Sandbox** 环境
2. 访问 **PayPal Subscriptions API** 创建产品

   **方法 A: 使用 PayPal Dashboard** (推荐)
   
   不幸的是，PayPal Sandbox 不提供可视化界面创建订阅。我们需要使用 API。

   **方法 B: 使用 API 创建** (下面详细说明)

### 步骤 3.2: 使用 Postman/cURL 创建产品

#### 3.2.1: 获取 Access Token

```bash
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "YOUR_CLIENT_ID:YOUR_SECRET" \
  -d "grant_type=client_credentials"
```

**替换**:
- `YOUR_CLIENT_ID`: 步骤 2.2 中获取的 Client ID
- `YOUR_SECRET`: 步骤 2.2 中获取的 Secret

**响应示例**:
```json
{
  "access_token": "A21AAxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "Bearer",
  "expires_in": 32400
}
```

**记录 `access_token`**，有效期 9 小时。

#### 3.2.2: 创建订阅产品

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "InstaPlay Subscription",
    "description": "Premium video streaming service with voice control",
    "type": "SERVICE",
    "category": "SOFTWARE",
    "image_url": "https://your-app.com/logo.png",
    "home_url": "https://your-app.com"
  }'
```

**响应示例**:
```json
{
  "id": "PROD-xxxxxxxxxxxx",
  "name": "InstaPlay Subscription",
  "description": "...",
  "status": "CREATED"
}
```

**记录 Product ID**: `PROD-xxxxxxxxxxxx`

### 步骤 3.3: 创建订阅计划

现在为每个会员等级创建订阅计划。

#### 3.3.1: Basic 月度计划

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "PROD-xxxxxxxxxxxx",
    "name": "InstaPlay Basic Monthly",
    "description": "Basic tier with 1500 voice commands per month",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "9.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "payment_failure_threshold": 3
    }
  }'
```

**响应**:
```json
{
  "id": "P-1AB23456CD789012E",
  "product_id": "PROD-xxxxxxxxxxxx",
  "name": "InstaPlay Basic Monthly",
  "status": "CREATED"
}
```

**记录 Plan ID**: `P-1AB23456CD789012E`

#### 3.3.2: Basic 年度计划

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "PROD-xxxxxxxxxxxx",
    "name": "InstaPlay Basic Yearly",
    "description": "Basic tier with 1500 voice commands per month, billed annually",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "YEAR",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "99.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "payment_failure_threshold": 3
    }
  }'
```

**记录 Plan ID**: `P-2BC34567DE890123F`

#### 3.3.3: Premium 月度计划

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "PROD-xxxxxxxxxxxx",
    "name": "InstaPlay Premium Monthly",
    "description": "Premium tier with unlimited voice commands",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "19.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "payment_failure_threshold": 3
    }
  }'
```

**记录 Plan ID**: `P-3CD45678EF901234G`

#### 3.3.4: Premium 年度计划

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "PROD-xxxxxxxxxxxx",
    "name": "InstaPlay Premium Yearly",
    "description": "Premium tier with unlimited voice commands, billed annually",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "YEAR",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "199.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "payment_failure_threshold": 3
    }
  }'
```

**记录 Plan ID**: `P-4DE56789FG012345H`

### 步骤 3.4: 激活计划

创建后，计划状态为 `CREATED`，需要激活才能使用。

```bash
curl -v -X POST https://api-m.sandbox.paypal.com/v1/billing/plans/P-1AB23456CD789012E/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**对所有 4 个计划重复此操作**。

---

## 4. 配置环境变量

### 步骤 4.1: 更新 `.env` 文件

打开项目根目录的 `.env` 文件，填入以下信息:

```env
# =====================================================
# PayPal Configuration
# =====================================================
EXPO_PUBLIC_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_SECRET
PAYPAL_MODE=sandbox

# PayPal 订阅计划 ID
PAYPAL_PLAN_ID_BASIC_MONTHLY=P-1AB23456CD789012E
PAYPAL_PLAN_ID_BASIC_YEARLY=P-2BC34567DE890123F
PAYPAL_PLAN_ID_PREMIUM_MONTHLY=P-3CD45678EF901234G
PAYPAL_PLAN_ID_PREMIUM_YEARLY=P-4DE56789FG012345H

# App URL (用于回调)
EXPO_PUBLIC_APP_URL=http://localhost:8081
```

**替换**:
- `YOUR_SANDBOX_CLIENT_ID`: 步骤 2.2 的 Client ID
- `YOUR_SANDBOX_SECRET`: 步骤 2.2 的 Secret
- `P-xxxxx`: 步骤 3.3 创建的 Plan IDs

### 步骤 4.2: 验证环境变量加载

```typescript
// 在任意 TypeScript 文件中测试
console.log('PayPal Client ID:', process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID);
console.log('PayPal Mode:', process.env.PAYPAL_MODE);
console.log('Basic Monthly Plan:', process.env.PAYPAL_PLAN_ID_BASIC_MONTHLY);
```

---

## 5. 测试 PayPal 集成

### 步骤 5.1: 启动开发服务器

```bash
bun run start
```

### 步骤 5.2: 测试创建订阅

1. **登录应用** (使用 Supabase Auth)

2. **访问订阅页面**:
   ```
   http://localhost:8081/subscription
   ```
   或
   ```
   http://localhost:8081/subscription/paypal
   ```

3. **选择订阅计划**:
   - Basic Monthly ($9.99/月)
   - Basic Yearly ($99.99/年)
   - Premium Monthly ($19.99/月)
   - Premium Yearly ($199.99/年)

4. **点击 "Subscribe" 按钮**

5. **后端调用测试**:
   
   应该看到控制台日志:
   ```
   [createSubscription] Creating PayPal subscription: {...}
   [createSubscription] Subscription created: { id: 'I-xxxxx', status: 'APPROVAL_PENDING' }
   ```

6. **跳转到 PayPal**:
   
   应用会跳转到 PayPal Sandbox 登录页面

7. **使用 Sandbox 测试账户登录**:
   - Email: `sb-xxxxx@personal.example.com` (步骤 2.4)
   - Password: [从 Sandbox Accounts 获取]

8. **完成订阅**:
   - 查看订阅详情
   - 点击 **"Agree & Subscribe"**
   - PayPal 会重定向回应用

9. **验证订阅激活**:
   
   重定向 URL 应包含 `subscription_id` 和 `ba_token`:
   ```
   http://localhost:8081/subscription/success?subscription_id=I-xxxxx&ba_token=BA-xxxxx
   ```

10. **后端激活订阅**:
    
    应用应调用 `activateSubscription` tRPC 方法:
    ```typescript
    const result = await trpc.paypal.activateSubscription.mutate({
      subscriptionId: 'I-xxxxx'
    });
    ```

11. **验证数据库更新**:
    
    打开 Supabase SQL Editor:
    ```sql
    SELECT * FROM subscriptions WHERE user_id = 'your-user-id';
    ```
    
    应该看到:
    - `paypal_subscription_id`: `I-xxxxx`
    - `status`: `active`
    - `plan_name`: `basic` 或 `premium`
    - `started_at`: 当前时间

12. **验证用户会员等级更新**:
    ```sql
    SELECT membership_level, max_devices FROM users WHERE id = 'your-user-id';
    ```
    
    应该看到:
    - `membership_level`: `basic` 或 `premium`
    - `max_devices`: `3` (basic) 或 `5` (premium)

### 步骤 5.3: 测试取消订阅

1. **访问会员管理页面**:
   ```
   http://localhost:8081/settings/account/membership
   ```

2. **点击 "Cancel Subscription"**

3. **确认取消**

4. **后端调用测试**:
   ```
   [cancelSubscription] Cancelling PayPal subscription: I-xxxxx
   [cancelSubscription] Subscription cancelled successfully
   ```

5. **验证数据库更新**:
   ```sql
   SELECT status, cancelled_at FROM subscriptions WHERE paypal_subscription_id = 'I-xxxxx';
   ```
   
   应该看到:
   - `status`: `cancelled`
   - `cancelled_at`: 当前时间

6. **验证用户降级**:
   ```sql
   SELECT membership_level FROM users WHERE id = 'your-user-id';
   ```
   
   应该看到:
   - `membership_level`: `free`

### 步骤 5.4: 测试 PayPal Webhook (可选)

PayPal 会在订阅状态变化时发送 webhook 通知。

1. **配置 Webhook URL** (在 PayPal App 设置中):
   ```
   https://your-backend.com/api/trpc/paypal.webhook
   ```

2. **订阅 Webhook 事件**:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

3. **测试 Webhook**:
   - 在 PayPal Developer Dashboard → Webhooks
   - 点击 "Webhook simulator"
   - 选择事件类型并发送测试 webhook

---

## 6. 生产环境部署

### 步骤 6.1: 创建生产环境 App

1. 在 PayPal Developer Dashboard
2. 切换到 **"Live"** 环境 (顶部切换按钮)
3. 重复步骤 2.1-2.3 创建生产 App
4. 获取 **Live Client ID** 和 **Live Secret**

### 步骤 6.2: 创建生产订阅计划

1. 使用 Live Access Token
2. 重复步骤 3.2-3.4 创建生产环境的产品和计划
3. **重要**: 价格和计划 ID 会与 Sandbox 不同

### 步骤 6.3: 更新生产环境变量

```env
# =====================================================
# PayPal Configuration (PRODUCTION)
# =====================================================
EXPO_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_LIVE_SECRET
PAYPAL_MODE=live

# PayPal 订阅计划 ID (PRODUCTION)
PAYPAL_PLAN_ID_BASIC_MONTHLY=P-LIVE-1xxxxx
PAYPAL_PLAN_ID_BASIC_YEARLY=P-LIVE-2xxxxx
PAYPAL_PLAN_ID_PREMIUM_MONTHLY=P-LIVE-3xxxxx
PAYPAL_PLAN_ID_PREMIUM_YEARLY=P-LIVE-4xxxxx

# App URL (PRODUCTION)
EXPO_PUBLIC_APP_URL=https://your-production-domain.com
```

### 步骤 6.4: 验证 PayPal 业务账户

生产环境需要验证的 PayPal 业务账户:

1. 登录 PayPal.com (不是 Developer Portal)
2. 升级到 Business Account
3. 完成业务信息验证:
   - 企业名称
   - 企业地址
   - 税号 (如适用)
4. 连接银行账户 (用于接收付款)

### 步骤 6.5: 配置支付接收

1. 在 PayPal Business Account 设置中
2. 配置自动提现 (可选)
3. 设置发票和收据模板

---

## 7. 常见问题

### Q1: Access Token 获取失败

**错误**: `401 Unauthorized`

**原因**:
- Client ID 或 Secret 错误
- 使用了 Sandbox 凭证在 Live 环境 (或反之)

**解决方案**:
```bash
# 验证凭证
echo "Client ID: $EXPO_PUBLIC_PAYPAL_CLIENT_ID"
echo "Mode: $PAYPAL_MODE"

# 确保 Client ID 和 Mode 匹配
# Sandbox Client ID 以 A 开头
# Live Client ID 以 A 开头 (但格式不同)
```

### Q2: 创建订阅失败

**错误**: `INVALID_RESOURCE_ID`

**原因**:
- Plan ID 不存在
- Plan 未激活
- 使用了 Sandbox Plan ID 在 Live 环境

**解决方案**:
```bash
# 验证 Plan 状态
curl -v https://api-m.sandbox.paypal.com/v1/billing/plans/P-xxxxx \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 检查响应中的 "status" 字段，应该是 "ACTIVE"
```

### Q3: PayPal 重定向后参数丢失

**错误**: 没有 `subscription_id` 或 `ba_token`

**原因**:
- Return URL 配置错误
- 用户取消了订阅

**解决方案**:
```typescript
// 在 createSubscription tRPC 中检查 return_url
console.log('Return URL:', input.returnUrl);

// 确保 return_url 是完整的 URL
const returnUrl = input.returnUrl || 
  `${process.env.EXPO_PUBLIC_APP_URL}/subscription/success`;
```

### Q4: Webhook 验证失败

**错误**: `WEBHOOK_SIGNATURE_VERIFICATION_FAILED`

**原因**:
- Webhook 签名验证失败
- Webhook ID 不匹配

**解决方案**:
```typescript
// 在 webhook route 中添加签名验证
// 参考: https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
import crypto from 'crypto';

const verifyWebhook = (headers: Headers, body: string) => {
  const transmissionId = headers.get('PAYPAL-TRANSMISSION-ID');
  const transmissionTime = headers.get('PAYPAL-TRANSMISSION-TIME');
  const transmissionSig = headers.get('PAYPAL-TRANSMISSION-SIG');
  const certUrl = headers.get('PAYPAL-CERT-URL');
  const authAlgo = headers.get('PAYPAL-AUTH-ALGO');
  
  // 验证逻辑...
};
```

### Q5: 测试账户余额不足

**错误**: `PAYMENT_FAILURE`

**原因**:
- Sandbox 测试账户余额为 0

**解决方案**:
1. 在 PayPal Developer Dashboard → Sandbox → Accounts
2. 点击 Personal Account 的 "..." → "View/Edit Account"
3. 在 "Funding" 标签下，点击 "Add Money"
4. 添加 $100-1000 测试余额

### Q6: 订阅计划价格无法修改

**说明**: PayPal 订阅计划创建后，价格**不能**修改

**解决方案**:
- 如需更改价格，必须创建新的计划
- 将用户迁移到新计划
- 废弃旧计划 (设置为 INACTIVE)

---

## 📊 PayPal 费用说明

### Sandbox 测试
- ✅ **完全免费**，无任何费用

### 生产环境
PayPal 订阅收取以下费用:

| 地区 | 交易费 | 固定费用 |
|-----|-------|---------|
| **美国** | 2.9% | + $0.30 |
| **欧洲** | 2.9% | + €0.35 |
| **其他地区** | 3.9% | + 固定费 |

**示例**:
- Basic Monthly ($9.99) → PayPal 收取 $0.59 → 你收到 $9.40
- Premium Yearly ($199.99) → PayPal 收取 $6.10 → 你收到 $193.89

---

## 📚 参考资源

- **PayPal Subscriptions API**: https://developer.paypal.com/docs/subscriptions/
- **PayPal REST API**: https://developer.paypal.com/api/rest/
- **Webhook Events**: https://developer.paypal.com/api/webhooks/event-names/
- **PayPal Sandbox**: https://developer.paypal.com/dashboard/accounts
- **API Explorer**: https://developer.paypal.com/api/rest/api-explorer/

---

## ✅ 设置完成检查清单

- [ ] PayPal 开发者账户已创建
- [ ] Sandbox App 已创建，Client ID 和 Secret 已获取
- [ ] 4 个订阅计划已创建并激活:
  - [ ] Basic Monthly
  - [ ] Basic Yearly
  - [ ] Premium Monthly
  - [ ] Premium Yearly
- [ ] 环境变量已配置到 `.env`
- [ ] Sandbox 测试账户可用
- [ ] 创建订阅测试通过
- [ ] 激活订阅测试通过
- [ ] 取消订阅测试通过
- [ ] 数据库订阅记录正确
- [ ] 用户会员等级正确同步
- [ ] (生产) Live App 已创建
- [ ] (生产) 生产订阅计划已创建
- [ ] (生产) 业务账户已验证
- [ ] (生产) 银行账户已连接

---

**设置状态**: ⏳ 待设置  
**预计时间**: 60-90 分钟  
**难度**: ⭐⭐⭐⭐ 较高 (需要多次 API 调用)

---

## 💡 提示

1. **保存所有 Plan ID**: 将 Plan ID 记录在安全的地方，丢失后无法找回
2. **定期检查 Webhook**: 确保 webhook 正常接收和处理
3. **监控失败支付**: 设置邮件提醒，及时处理支付失败
4. **测试降级流程**: 确保用户取消订阅后正确降级
5. **备份环境变量**: 生产环境的凭证要安全备份

祝你设置顺利！🎉

# Setup Instructions

## 已完成的優化和功能

### 1. 性能優化
- ✅ 修復了 VideoPlayer 中的 "source.uri should not be an empty string" 警告
- ✅ 優化了書籤收藏切換的性能，消除了卡頓問題
- ✅ 改進了 WebView 消息處理，過濾無效消息

### 2. Supabase 用戶認證和數據存儲
已安裝和配置 Supabase 客戶端：
- ✅ 創建了 `lib/supabase.ts` 配置文件
- ✅ 創建了 `providers/AuthProvider.tsx` 認證提供者
- ✅ 實現了完整的認證流程（註冊、登錄、登出、密碼重置）
- ✅ 創建了用戶資料管理功能

#### 數據庫架構
需要在 Supabase 中創建以下表：

```sql
-- 用戶資料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'premium', 'pro')),
  membership_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 書籤表
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  favicon TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  folder_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文件夾表
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'folder',
  category_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用 RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 策略
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own folders" ON folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own folders" ON folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own folders" ON folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own folders" ON folders FOR DELETE USING (auth.uid() = user_id);
```

### 3. Stripe 會員訂閱支付
已安裝和配置 Stripe：
- ✅ 創建了 `providers/StripeProvider.tsx` 支付提供者
- ✅ 定義了會員計劃（Premium 和 Pro，月付和年付）
- ✅ 實現了訂閱創建和取消功能

#### Stripe 後端 API 端點
需要創建以下後端 API 端點：

```typescript
// POST /api/stripe/create-checkout-session
// 創建 Stripe Checkout Session
{
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

// POST /api/stripe/cancel-subscription
// 取消訂閱
{
  userId: string;
}

// POST /api/stripe/webhook
// Stripe Webhook 處理支付事件
```

### 4. 認證界面
已創建完整的認證流程：
- ✅ `app/auth/sign-in.tsx` - 登錄頁面
- ✅ `app/auth/sign-up.tsx` - 註冊頁面
- ✅ `app/subscription/index.tsx` - 訂閱管理頁面

## 環境配置

1. 複製 `.env.example` 到 `.env`：
```bash
cp .env.example .env
```

2. 填寫 Supabase 配置：
   - 在 [Supabase Dashboard](https://app.supabase.com) 創建項目
   - 獲取 `EXPO_PUBLIC_SUPABASE_URL` 和 `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - 執行上面的 SQL 創建數據庫表

3. 填寫 Stripe 配置：
   - 在 [Stripe Dashboard](https://dashboard.stripe.com) 創建賬戶
   - 獲取 `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - 創建產品和價格，獲取對應的 Price ID

4. 配置 API URL：
   - 設置後端 API 地址
   - 設置應用 URL（用於重定向）

## 使用方法

### 認證
```typescript
import { useAuth } from '@/providers/AuthProvider';

function MyComponent() {
  const { user, profile, isPremium, signIn, signOut } = useAuth();
  
  // 檢查用戶是否登錄
  if (!user) {
    return <SignInPrompt />;
  }
  
  // 檢查是否為付費會員
  if (!isPremium) {
    return <UpgradePrompt />;
  }
  
  return <PremiumFeature />;
}
```

### 訂閱管理
```typescript
import { useStripe } from '@/providers/StripeProvider';

function SubscriptionButton() {
  const { createCheckoutSession, loading } = useStripe();
  
  const handleSubscribe = async () => {
    await createCheckoutSession('premium_monthly');
  };
  
  return (
    <Button onPress={handleSubscribe} disabled={loading}>
      Subscribe
    </Button>
  );
}
```

## 下一步

1. 設置 Supabase 項目並創建數據庫表
2. 設置 Stripe 賬戶並創建產品
3. 實現後端 API 端點處理 Stripe 支付
4. 配置 Stripe Webhook 處理支付事件
5. 測試完整的認證和支付流程

## 注意事項

- 確保在生產環境中使用環境變量
- 不要將 API 密鑰提交到代碼庫
- 定期更新依賴包以獲取安全補丁
- 測試所有支付流程，包括成功和失敗情況

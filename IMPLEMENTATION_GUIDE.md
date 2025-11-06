# 實施指南 - 會員系統與影片來源支持

## 概述

本指南說明如何在應用中集成會員系統和影片來源檢測功能。

---

## 已完成的工作

### 1. 核心錯誤修復

✅ **語言上下文未定義錯誤**
- 文件: `hooks/useLanguage.tsx`, `app/(tabs)/_layout.tsx`
- 確保 useLanguage hook 始終返回有效對象
- 添加安全的可選鏈操作符

✅ **環境變量加載問題**
- 文件: `lib/trpc.ts`
- 添加 fallback 機制
- 增強錯誤日誌

✅ **語音識別 "no-speech" 錯誤處理**
- 文件: `providers/VoiceControlProvider.tsx`
- 已實現完整的錯誤處理和自動重試機制

### 2. 新增功能

✅ **影片來源檢測系統**
- 文件: `utils/videoSourceDetector.ts`
- 支持主流平台、成人平台、串流格式檢測
- 會員權限驗證
- 使用配額檢查

✅ **會員系統增強**
- 文件: `providers/MembershipProvider.tsx`
- 設備綁定管理
- 使用統計追蹤
- 成人內容權限檢查

---

## 使用指南

### 影片來源檢測

```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';
import { useMembership } from '@/providers/MembershipProvider';

function VideoPlayer({ url }: { url: string }) {
  const membership = useMembership();
  
  // 檢測影片來源
  const sourceInfo = detectVideoSource(url);
  console.log('Platform:', sourceInfo.platform);
  console.log('Is Adult:', sourceInfo.isAdult);
  console.log('Requires Premium:', sourceInfo.requiresPremium);
  
  // 檢查是否可以播放
  const playCheck = canPlayVideo(
    url,
    membership.tier,
    {
      daily: membership.dailyUsageCount,
      monthly: membership.usageCount
    }
  );
  
  if (!playCheck.canPlay) {
    return <Text>無法播放: {playCheck.reason}</Text>;
  }
  
  // 播放影片前記錄使用
  const handlePlay = async () => {
    const canUse = await membership.useFeature();
    if (canUse) {
      // 開始播放
    } else {
      // 顯示配額用盡提示
    }
  };
  
  return <VideoPlayerComponent url={url} onPlay={handlePlay} />;
}
```

### 會員系統

```typescript
import { useMembership } from '@/providers/MembershipProvider';

function MembershipStatus() {
  const membership = useMembership();
  
  return (
    <View>
      <Text>會員等級: {membership.tier}</Text>
      <Text>剩餘使用次數: {membership.getRemainingUsage()}</Text>
      <Text>今日已使用: {membership.dailyUsageCount}</Text>
      <Text>本月已使用: {membership.usageCount}</Text>
      <Text>支持成人內容: {membership.supportsAdultContent() ? '是' : '否'}</Text>
      <Text>已綁定設備: {membership.devices.length} / {membership.getMaxDevices()}</Text>
    </View>
  );
}
```

### 設備管理

```typescript
import { useMembership } from '@/providers/MembershipProvider';
import * as Device from 'expo-device';

function DeviceManagement() {
  const membership = useMembership();
  
  const handleAddDevice = async () => {
    const deviceId = Device.osBuildId || 'unknown';
    const deviceName = Device.deviceName || 'Unknown Device';
    
    const success = await membership.addDevice(deviceId, deviceName);
    if (success) {
      Alert.alert('成功', '設備已綁定');
    } else {
      Alert.alert('失敗', '已達到最大設備數量');
    }
  };
  
  const handleRemoveDevice = async (deviceId: string) => {
    await membership.removeDevice(deviceId);
    Alert.alert('成功', '設備已解綁');
  };
  
  return (
    <View>
      <Text>已綁定設備:</Text>
      {membership.devices.map(device => (
        <View key={device.deviceId}>
          <Text>{device.deviceName || device.deviceId}</Text>
          <Text>最後登入: {new Date(device.lastLogin).toLocaleString()}</Text>
          <Button title="解綁" onPress={() => handleRemoveDevice(device.deviceId)} />
        </View>
      ))}
      <Button title="綁定當前設備" onPress={handleAddDevice} />
    </View>
  );
}
```

---

## 待實施功能

### 高優先級

#### 1. Supabase 用戶認證集成

**目標**: 將本地會員系統與 Supabase 同步

**步驟**:
1. 更新 `providers/AuthProvider.tsx`:
```typescript
import { supabase } from '@/lib/supabase';
import { useMembership } from '@/providers/MembershipProvider';

// 登入後同步會員數據
const syncMembershipData = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('membership_tier, membership_expires_at')
    .eq('id', userId)
    .single();
    
  if (data) {
    await membership.upgradeTier(data.membership_tier);
  }
};
```

2. 創建 Supabase 表結構:
```sql
-- 已在 database-schema.sql 中定義
-- 需要添加設備綁定表
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- 使用統計表
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_count INTEGER DEFAULT 0,
  monthly_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### 2. Stripe 支付集成

**目標**: 實現訂閱支付流程

**步驟**:
1. 創建訂閱計劃 (在 Stripe Dashboard):
   - Basic Monthly: $9.99/月
   - Basic Yearly: $99.99/年
   - Premium Monthly: $19.99/月
   - Premium Yearly: $199.99/年

2. 更新 `.env` 文件中的 Price IDs

3. 實現支付流程:
```typescript
// 在 app/subscription/index.tsx 中
import { trpc } from '@/lib/trpc';

const handleSubscribe = async (priceId: string) => {
  try {
    const { sessionUrl } = await trpc.stripe.createCheckoutSession.mutate({
      priceId,
      successUrl: `${window.location.origin}/subscription/success`,
      cancelUrl: `${window.location.origin}/subscription/cancel`,
    });
    
    // 重定向到 Stripe Checkout
    window.location.href = sessionUrl;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
  }
};
```

4. 處理 Webhook:
```typescript
// backend/trpc/routes/stripe/webhook/route.ts 已實現
// 需要在 Stripe Dashboard 設置 Webhook URL
```

#### 3. 影片播放器集成

**目標**: 在播放器中集成來源檢測和權限檢查

**步驟**:
1. 更新 `components/VideoPlayer.tsx`:
```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';
import { useMembership } from '@/providers/MembershipProvider';

export function VideoPlayer({ url }: { url: string }) {
  const membership = useMembership();
  const [canPlay, setCanPlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPermissions = async () => {
      const sourceInfo = detectVideoSource(url);
      
      if (sourceInfo.type === 'unsupported') {
        setErrorMessage(`${sourceInfo.platform} 不支持 (DRM 限制)`);
        setCanPlay(false);
        return;
      }
      
      const playCheck = canPlayVideo(
        url,
        membership.tier,
        {
          daily: membership.dailyUsageCount,
          monthly: membership.usageCount
        }
      );
      
      if (!playCheck.canPlay) {
        setErrorMessage(playCheck.reason);
        setCanPlay(false);
        return;
      }
      
      setCanPlay(true);
      setErrorMessage(null);
    };
    
    checkPermissions();
  }, [url, membership]);
  
  if (!canPlay) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        {errorMessage?.includes('premium') && (
          <Button title="升級會員" onPress={() => router.push('/subscription')} />
        )}
      </View>
    );
  }
  
  return <ActualVideoPlayer url={url} />;
}
```

### 中優先級

#### 4. QR Code 設備驗證

**目標**: 實現掃描 QR Code 綁定設備

**步驟**:
1. 安裝依賴:
```bash
bun expo install expo-camera
```

2. 生成 QR Code:
```typescript
import QRCode from 'react-native-qrcode-svg';

function DeviceQRCode() {
  const [verificationCode, setVerificationCode] = useState('');
  
  useEffect(() => {
    // 生成驗證碼
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
    
    // 保存到 Supabase
    // await supabase.from('profiles').update({ verification_code: code })
  }, []);
  
  return (
    <View>
      <QRCode value={verificationCode} size={200} />
      <Text>驗證碼: {verificationCode}</Text>
    </View>
  );
}
```

3. 掃描 QR Code:
```typescript
import { CameraView } from 'expo-camera';

function ScanQRCode() {
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // 驗證碼
    const isValid = await verifyCode(data);
    if (isValid) {
      await membership.addDevice(deviceId);
    }
  };
  
  return (
    <CameraView
      onBarcodeScanned={handleBarCodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
    />
  );
}
```

#### 5. 使用統計儀表板

**目標**: 顯示詳細的使用統計

**步驟**:
1. 創建統計頁面:
```typescript
function UsageStatistics() {
  const membership = useMembership();
  
  return (
    <ScrollView>
      <Card>
        <Text>今日使用</Text>
        <ProgressBar 
          progress={membership.dailyUsageCount / 30} 
          color={Colors.primary.accent}
        />
        <Text>{membership.dailyUsageCount} / 30</Text>
      </Card>
      
      <Card>
        <Text>本月使用</Text>
        <ProgressBar 
          progress={membership.usageCount / 1500} 
          color={Colors.primary.accent}
        />
        <Text>{membership.usageCount} / 1500</Text>
      </Card>
      
      <Card>
        <Text>使用歷史</Text>
        {/* 圖表顯示每日使用情況 */}
      </Card>
    </ScrollView>
  );
}
```

---

## 測試清單

### 功能測試

- [ ] 影片來源檢測
  - [ ] YouTube 影片正確識別
  - [ ] 成人網站正確識別並要求會員
  - [ ] 不支持的平台顯示錯誤
  - [ ] 直鏈影片正常播放

- [ ] 會員系統
  - [ ] 免費試用 2000 次正確計數
  - [ ] 試用用完自動轉為免費會員
  - [ ] 每日配額正確重置
  - [ ] 升級會員後配額正確更新

- [ ] 設備管理
  - [ ] 免費會員只能綁定 1 台設備
  - [ ] 付費會員可以綁定多台設備
  - [ ] 設備解綁正常工作
  - [ ] 超過最大設備數時顯示錯誤

- [ ] 語音識別
  - [ ] "no-speech" 錯誤不顯示給用戶
  - [ ] 自動重試機制正常工作
  - [ ] 語音命令正確識別

### 性能測試

- [ ] AsyncStorage 操作 < 100ms
- [ ] 頁面切換流暢無卡頓
- [ ] 語音識別響應時間 < 1秒
- [ ] 影片播放啟動時間 < 2秒

### 兼容性測試

- [ ] iOS 設備正常運行
- [ ] Android 設備正常運行
- [ ] Web 瀏覽器正常運行
- [ ] 不同屏幕尺寸適配正確

---

## 部署檢查清單

### 環境變量

確保以下環境變量已設置:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
EXPO_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
EXPO_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
EXPO_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...

# API
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-api.com
```

### Supabase 設置

1. 創建數據庫表 (執行 `database-schema.sql`)
2. 設置 Row Level Security (RLS) 策略
3. 配置 Storage buckets (如需要)
4. 設置 Auth providers

### Stripe 設置

1. 創建產品和價格
2. 設置 Webhook endpoint
3. 測試支付流程
4. 配置稅率設置 (如需要)

### 應用商店準備

1. 更新 `app.json` 中的版本號
2. 準備應用截圖和描述
3. 配置隱私政策和服務條款
4. 測試應用內購買 (如使用)

---

## 常見問題

### Q: 環境變量沒有加載？
A: 確保 `.env` 文件在項目根目錄，並重啟開發服務器。

### Q: 語音識別一直顯示 "no-speech" 錯誤？
A: 這是正常的，系統會自動重試。確保麥克風權限已授予。

### Q: 影片無法播放？
A: 檢查影片來源是否支持，會員等級是否足夠，配額是否用完。

### Q: 設備綁定失敗？
A: 檢查是否已達到最大設備數量，嘗試解綁舊設備。

---

## 支持

如有問題，請查看:
1. 控制台日誌
2. `FIXES_SUMMARY.md` 文件
3. 項目 README.md

---

**最後更新**: 2025-10-02
**版本**: 1.0.0

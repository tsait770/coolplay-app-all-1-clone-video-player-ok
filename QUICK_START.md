# 快速開始指南

## 🎯 已修復的問題

### ✅ 1. 語言上下文錯誤
**錯誤**: `TypeError: Cannot read property 'language' of undefined`

**狀態**: ✅ 已修復

**修改文件**:
- `hooks/useLanguage.tsx` - 確保始終返回有效對象
- `app/(tabs)/_layout.tsx` - 使用安全的可選鏈操作符

---

### ✅ 2. 環境變量未加載
**錯誤**: `No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL`

**狀態**: ✅ 已修復

**修改文件**:
- `lib/trpc.ts` - 添加 fallback 和詳細日誌

**驗證**:
```bash
# 確保 .env 文件包含:
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

### ✅ 3. 語音識別 "no-speech" 錯誤
**錯誤**: `Speech recognition error: no-speech`

**狀態**: ✅ 已優化處理

**說明**: 
- 這是 Web Speech API 的正常行為
- 系統已實現自動重試機制
- 不會向用戶顯示錯誤

**修改文件**:
- `providers/VoiceControlProvider.tsx` - 完整的錯誤處理

---

## 🆕 新增功能

### 1. 影片來源檢測系統
**文件**: `utils/videoSourceDetector.ts`

**功能**:
- ✅ 檢測主流平台 (YouTube, Vimeo, Twitch, etc.)
- ✅ 檢測成人平台 (需付費會員)
- ✅ 檢測不支持的平台 (Netflix, Disney+, etc.)
- ✅ 會員權限驗證
- ✅ 使用配額檢查

**使用範例**:
```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';

const sourceInfo = detectVideoSource(url);
const playCheck = canPlayVideo(url, membershipTier, usageCount);
```

---

### 2. 會員系統增強
**文件**: `providers/MembershipProvider.tsx`

**新功能**:
- ✅ 設備綁定管理
- ✅ 使用統計追蹤
- ✅ 成人內容權限檢查
- ✅ 每日/每月配額管理

**會員等級**:
| 等級 | 每日 | 每月 | 成人內容 | 設備數 |
|------|------|------|---------|--------|
| 免費試用 | ∞ | 2000 | ✅ | 1 |
| 免費 | 30 | ∞ | ❌ | 1 |
| 基礎 | 40 | 1500 | ✅ | 3 |
| 高級 | ∞ | ∞ | ✅ | 5 |

---

## 📋 待辦事項

### 🔴 高優先級

#### 1. Supabase 集成
- [ ] 用戶認證流程
- [ ] 會員數據同步
- [ ] 設備綁定記錄
- [ ] 使用統計同步

**參考**: `IMPLEMENTATION_GUIDE.md` - Supabase 用戶認證集成

---

#### 2. Stripe 支付集成
- [ ] 創建訂閱計劃
- [ ] 實現支付流程
- [ ] Webhook 處理
- [ ] 訂閱狀態同步

**參考**: `IMPLEMENTATION_GUIDE.md` - Stripe 支付集成

---

#### 3. 影片播放器集成
- [ ] 集成來源檢測
- [ ] 權限檢查
- [ ] 配額管理
- [ ] 錯誤提示

**參考**: `IMPLEMENTATION_GUIDE.md` - 影片播放器集成

---

### 🟡 中優先級

#### 4. QR Code 設備驗證
- [ ] 生成 QR Code
- [ ] 掃描驗證
- [ ] 設備綁定

---

#### 5. 使用統計儀表板
- [ ] 每日使用圖表
- [ ] 每月使用圖表
- [ ] 配額進度條

---

### 🟢 低優先級

#### 6. UI/UX 改進
- [ ] 會員狀態顯示
- [ ] 升級引導
- [ ] 語音狀態指示器

---

## 🚀 快速啟動

### 1. 安裝依賴
```bash
bun install
```

### 2. 配置環境變量
```bash
cp .env.example .env
# 編輯 .env 文件，填入實際的配置
```

### 3. 啟動開發服務器
```bash
bun start
```

### 4. 測試功能

#### 測試影片來源檢測
```typescript
// 在開發者工具控制台執行
import { detectVideoSource } from '@/utils/videoSourceDetector';

// YouTube
console.log(detectVideoSource('https://www.youtube.com/watch?v=xxx'));

// 成人網站
console.log(detectVideoSource('https://www.pornhub.com/view_video.php?viewkey=xxx'));

// Netflix (不支持)
console.log(detectVideoSource('https://www.netflix.com/watch/12345'));
```

#### 測試會員系統
```typescript
// 在組件中
import { useMembership } from '@/providers/MembershipProvider';

function TestComponent() {
  const membership = useMembership();
  
  console.log('會員等級:', membership.tier);
  console.log('剩餘次數:', membership.getRemainingUsage());
  console.log('支持成人內容:', membership.supportsAdultContent());
}
```

---

## 📚 文檔

### 主要文檔
- **FIXES_SUMMARY.md** - 詳細的修復總結
- **IMPLEMENTATION_GUIDE.md** - 完整的實施指南
- **VIDEO_SOURCE_SUPPORT.md** - 影片來源支持規範

### API 文檔
- **utils/videoSourceDetector.ts** - 影片來源檢測 API
- **providers/MembershipProvider.tsx** - 會員系統 API

---

## 🐛 故障排除

### 問題: 環境變量沒有加載
**解決方案**:
1. 確保 `.env` 文件在項目根目錄
2. 重啟開發服務器
3. 檢查控制台日誌: `[tRPC] Using base URL: ...`

---

### 問題: 語音識別不工作
**解決方案**:
1. 檢查麥克風權限
2. 確保使用 HTTPS (生產環境)
3. 查看控制台日誌
4. 嘗試不同的瀏覽器

---

### 問題: 影片無法播放
**解決方案**:
1. 檢查影片來源是否支持
2. 確認會員等級是否足夠
3. 檢查配額是否用完
4. 查看錯誤消息

---

### 問題: 設備綁定失敗
**解決方案**:
1. 檢查是否已達到最大設備數
2. 嘗試解綁舊設備
3. 確認設備 ID 正確

---

## 📞 支持

### 查看日誌
```bash
# 開發環境
# 打開瀏覽器開發者工具 -> Console

# 查找特定日誌
# [App] - 應用初始化
# [Storage] - 存儲操作
# [tRPC] - API 請求
# [VoiceControl] - 語音控制
```

### 常用命令
```bash
# 清除緩存
bun start --clear

# 重置 AsyncStorage (開發環境)
# 在開發者工具控制台執行:
# await AsyncStorage.clear()

# 檢查環境變量
# console.log(process.env)
```

---

## ✅ 檢查清單

### 開發環境設置
- [ ] 安裝依賴
- [ ] 配置 `.env` 文件
- [ ] 啟動開發服務器
- [ ] 測試基本功能

### Supabase 設置
- [ ] 創建項目
- [ ] 執行數據庫遷移
- [ ] 配置 RLS 策略
- [ ] 更新環境變量

### Stripe 設置
- [ ] 創建產品
- [ ] 創建價格
- [ ] 設置 Webhook
- [ ] 更新環境變量

### 測試
- [ ] 影片來源檢測
- [ ] 會員系統
- [ ] 設備管理
- [ ] 語音識別
- [ ] 支付流程

---

## 🎉 下一步

1. **完成 Supabase 集成** - 實現用戶認證和數據同步
2. **完成 Stripe 集成** - 實現訂閱支付
3. **集成影片播放器** - 添加來源檢測和權限檢查
4. **實現 QR Code 驗證** - 設備綁定流程
5. **添加使用統計** - 儀表板和圖表

---

**最後更新**: 2025-10-02
**版本**: 1.0.0
**狀態**: ✅ 核心功能已完成，待集成外部服務

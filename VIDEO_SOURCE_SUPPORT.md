# 影片來源支持規範

## 快速參考

### 支持的影片來源

#### 主流平台 (所有會員)
| 平台 | URL 格式 | 需要會員 |
|------|---------|---------|
| YouTube | `youtube.com/watch?v=*` | ❌ |
| Vimeo | `vimeo.com/*` | ❌ |
| Twitch | `twitch.tv/*` | ❌ |
| Facebook | `facebook.com/watch/?v=*` | ❌ |
| Google Drive | `drive.google.com/*` | ❌ |
| Dropbox | `dropbox.com/*` | ❌ |

#### 串流格式 (所有會員)
| 格式 | 擴展名 | 需要會員 |
|------|--------|---------|
| MP4 | `.mp4` | ❌ |
| WebM | `.webm` | ❌ |
| OGG | `.ogg`, `.ogv` | ❌ |
| HLS | `.m3u8` | ❌ |
| RTMP | `rtmp://` | ❌ |
| DASH | `.mpd` | ❌ |

#### 成人平台 (需付費會員)
| 平台 | URL 格式 | 需要會員 |
|------|---------|---------|
| Pornhub | `pornhub.com/*` | ✅ Basic/Premium |
| Xvideos | `xvideos.com/*` | ✅ Basic/Premium |
| Xnxx | `xnxx.com/*` | ✅ Basic/Premium |
| Redtube | `redtube.com/*` | ✅ Basic/Premium |
| Tktube | `tktube.com/*` | ✅ Basic/Premium |
| YouPorn | `youporn.com/*` | ✅ Basic/Premium |
| Spankbang | `spankbang.com/*` | ✅ Basic/Premium |
| Brazzers | `brazzers.com/*` | ✅ Basic/Premium |
| NaughtyAmerica | `naughtyamerica.com/*` | ✅ Basic/Premium |
| Bangbros | `bangbros.com/*` | ✅ Basic/Premium |
| RealityKings | `realitykings.com/*` | ✅ Basic/Premium |

### 不支持的平台 (DRM 限制)
| 平台 | 原因 |
|------|------|
| Netflix | DRM 保護 |
| Disney+ | DRM 保護 |
| iQIYI (愛奇藝) | DRM 保護 |
| HBO Max | DRM 保護 |
| Amazon Prime Video | DRM 保護 |

---

## 會員等級與權限

### 免費試用 (Free Trial)
- **使用次數**: 2000 次 (一次性)
- **支持格式**: ✅ 全部格式
- **成人內容**: ✅ 支持
- **最大設備**: 1 台
- **說明**: 首次登入贈送，用完自動轉為免費會員

### 免費會員 (Free)
- **使用次數**: 每日 30 次
- **支持格式**: ✅ 主流平台 + 串流格式
- **成人內容**: ❌ 不支持
- **最大設備**: 1 台
- **說明**: 試用用完後的默認等級

### 基礎會員 (Basic)
- **使用次數**: 每月 1500 次 + 每日登入 40 次
- **支持格式**: ✅ 全部格式
- **成人內容**: ✅ 支持
- **最大設備**: 3 台
- **價格**: $9.99/月 或 $99.99/年

### 高級會員 (Premium)
- **使用次數**: ♾️ 無限制
- **支持格式**: ✅ 全部格式
- **成人內容**: ✅ 支持
- **最大設備**: 5 台
- **價格**: $19.99/月 或 $199.99/年

---

## 使用範例

### 檢測影片來源

```typescript
import { detectVideoSource } from '@/utils/videoSourceDetector';

// YouTube 影片
const youtube = detectVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(youtube);
// {
//   type: 'supported',
//   platform: 'YouTube',
//   requiresPremium: false,
//   isAdult: false
// }

// 成人網站
const adult = detectVideoSource('https://www.pornhub.com/view_video.php?viewkey=xxx');
console.log(adult);
// {
//   type: 'adult',
//   platform: 'Pornhub',
//   requiresPremium: true,
//   isAdult: true
// }

// 不支持的平台
const netflix = detectVideoSource('https://www.netflix.com/watch/12345');
console.log(netflix);
// {
//   type: 'unsupported',
//   platform: 'Netflix',
//   requiresPremium: false,
//   isAdult: false
// }
```

### 檢查播放權限

```typescript
import { canPlayVideo } from '@/utils/videoSourceDetector';

const result = canPlayVideo(
  'https://www.pornhub.com/view_video.php?viewkey=xxx',
  'free', // 會員等級
  { daily: 10, monthly: 100 } // 使用次數
);

console.log(result);
// {
//   canPlay: false,
//   reason: 'Adult content requires a premium membership'
// }
```

### 在組件中使用

```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';
import { useMembership } from '@/providers/MembershipProvider';

function VideoPlayer({ url }: { url: string }) {
  const membership = useMembership();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // 檢測來源
    const sourceInfo = detectVideoSource(url);
    
    // 檢查權限
    const playCheck = canPlayVideo(
      url,
      membership.tier,
      {
        daily: membership.dailyUsageCount,
        monthly: membership.usageCount
      }
    );
    
    if (!playCheck.canPlay) {
      setError(playCheck.reason);
    } else {
      setError(null);
    }
  }, [url, membership]);
  
  if (error) {
    return (
      <View>
        <Text>{error}</Text>
        {error.includes('premium') && (
          <Button title="升級會員" onPress={() => router.push('/subscription')} />
        )}
      </View>
    );
  }
  
  return <ActualVideoPlayer url={url} />;
}
```

---

## 錯誤消息

### 常見錯誤及解決方案

| 錯誤消息 | 原因 | 解決方案 |
|---------|------|---------|
| `Adult content requires a premium membership` | 免費會員嘗試播放成人內容 | 升級到 Basic 或 Premium |
| `Daily limit of 30 videos reached` | 免費會員每日配額用完 | 等待明天或升級會員 |
| `Monthly limit of 1500 videos reached` | Basic 會員每月配額用完 | 等待下月或升級到 Premium |
| `Netflix is not supported due to DRM restrictions` | 嘗試播放 DRM 保護的內容 | 使用官方應用 |
| `Unknown video source` | 無法識別的影片來源 | 檢查 URL 格式 |

---

## 技術細節

### 檢測邏輯

1. **成人內容優先檢測**: 首先檢查是否為成人網站
2. **不支持平台檢測**: 檢查是否為 DRM 保護平台
3. **支持平台檢測**: 檢查是否為支持的主流平台
4. **未知來源**: 無法識別的來源

### 權限檢查流程

```
1. 檢測影片來源類型
   ↓
2. 檢查平台是否支持
   ↓ (不支持)
   └→ 返回錯誤: "平台不支持"
   ↓ (支持)
3. 檢查是否為成人內容
   ↓ (是)
   └→ 檢查會員是否支持成人內容
      ↓ (不支持)
      └→ 返回錯誤: "需要付費會員"
   ↓ (否 或 支持)
4. 檢查使用配額
   ↓ (超過每日限制)
   └→ 返回錯誤: "每日配額用完"
   ↓ (超過每月限制)
   └→ 返回錯誤: "每月配額用完"
   ↓ (未超過)
5. 允許播放
```

---

## 最佳實踐

### 1. 提前檢查權限

在用戶點擊播放前就檢查權限，提供更好的用戶體驗：

```typescript
function VideoCard({ url }: { url: string }) {
  const membership = useMembership();
  const sourceInfo = detectVideoSource(url);
  const canPlay = canPlayVideo(url, membership.tier, {
    daily: membership.dailyUsageCount,
    monthly: membership.usageCount
  });
  
  return (
    <Card>
      <Image source={{ uri: thumbnail }} />
      {!canPlay.canPlay && (
        <Badge>
          <Lock size={16} />
          <Text>{canPlay.reason}</Text>
        </Badge>
      )}
      {sourceInfo.isAdult && (
        <Badge>
          <Text>18+</Text>
        </Badge>
      )}
    </Card>
  );
}
```

### 2. 記錄使用次數

每次播放影片時記錄使用次數：

```typescript
const handlePlay = async () => {
  const canUse = await membership.useFeature();
  if (canUse) {
    // 開始播放
    startPlayback();
  } else {
    // 顯示配額用盡提示
    Alert.alert('配額用完', '請升級會員或等待明天');
  }
};
```

### 3. 提供升級引導

當用戶遇到限制時，引導升級會員：

```typescript
if (!canPlay.canPlay && canPlay.reason?.includes('premium')) {
  return (
    <View>
      <Text>此內容需要付費會員</Text>
      <Button 
        title="查看會員方案" 
        onPress={() => router.push('/subscription')}
      />
    </View>
  );
}
```

---

## 更新日誌

### v1.0.0 (2025-10-02)
- ✅ 初始實現
- ✅ 支持主流平台檢測
- ✅ 支持成人平台檢測
- ✅ 會員權限驗證
- ✅ 使用配額檢查

---

**最後更新**: 2025-10-02
**維護者**: Development Team

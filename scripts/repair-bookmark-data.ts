import AsyncStorage from '@react-native-async-storage/async-storage';

interface RepairResult {
  success: boolean;
  repaired: {
    folders: number;
    bookmarks: number;
    statistics: boolean;
  };
  errors: string[];
}

const STORAGE_KEYS = {
  BOOKMARKS: '@coolplay_bookmarks',
  FOLDERS: '@coolplay_folders',
  ORIGINAL_BOOKMARKS: '@coolplay_original_bookmarks',
};

function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  try {
    const decoded = decodeURIComponent(escape(str));
    return decoded
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\uFFFD/g, '')
      .replace(/�/g, '')
      .trim();
  } catch {
    return str
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\uFFFD/g, '')
      .replace(/�/g, '')
      .trim();
  }
}

function isValidString(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  
  const hasInvalidChars = /[\uFFFD�]/.test(str);
  const hasOnlyWhitespace = str.trim().length === 0;
  const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(str);
  
  return !hasInvalidChars && !hasOnlyWhitespace && !hasControlChars;
}

export async function repairBookmarkData(): Promise<RepairResult> {
  console.log('[DataRepair] Starting bookmark data repair...');
  
  const result: RepairResult = {
    success: false,
    repaired: {
      folders: 0,
      bookmarks: 0,
      statistics: false,
    },
    errors: [],
  };

  try {
    const [storedBookmarks, storedFolders] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
      AsyncStorage.getItem(STORAGE_KEYS.FOLDERS),
    ]);

    let bookmarks: any[] = [];
    let folders: any[] = [];

    if (storedBookmarks) {
      try {
        bookmarks = JSON.parse(storedBookmarks);
        if (!Array.isArray(bookmarks)) {
          bookmarks = [];
          result.errors.push('Bookmarks data was not an array');
        }
      } catch (error) {
        result.errors.push(`Failed to parse bookmarks: ${error}`);
        bookmarks = [];
      }
    }

    if (storedFolders) {
      try {
        folders = JSON.parse(storedFolders);
        if (!Array.isArray(folders)) {
          folders = [];
          result.errors.push('Folders data was not an array');
        }
      } catch (error) {
        result.errors.push(`Failed to parse folders: ${error}`);
        folders = [];
      }
    }

    console.log(`[DataRepair] Found ${bookmarks.length} bookmarks and ${folders.length} folders`);

    let repairedBookmarks = 0;
    const cleanedBookmarks = bookmarks.map((bookmark) => {
      let needsRepair = false;
      const cleaned = { ...bookmark };

      if (bookmark.title && !isValidString(bookmark.title)) {
        cleaned.title = sanitizeString(bookmark.title);
        needsRepair = true;
        console.log(`[DataRepair] Repaired bookmark title: "${bookmark.title}" -> "${cleaned.title}"`);
      }

      if (bookmark.url && !isValidString(bookmark.url)) {
        cleaned.url = sanitizeString(bookmark.url);
        needsRepair = true;
        console.log(`[DataRepair] Repaired bookmark URL`);
      }

      if (bookmark.description && !isValidString(bookmark.description)) {
        cleaned.description = sanitizeString(bookmark.description);
        needsRepair = true;
      }

      if (bookmark.favicon && !isValidString(bookmark.favicon)) {
        cleaned.favicon = sanitizeString(bookmark.favicon);
        needsRepair = true;
      }

      if (!cleaned.title || cleaned.title.trim() === '') {
        cleaned.title = cleaned.url || 'Untitled Bookmark';
        needsRepair = true;
      }

      if (!cleaned.url || cleaned.url.trim() === '') {
        console.warn(`[DataRepair] Bookmark has no URL, removing: ${cleaned.title}`);
        return null;
      }

      if (needsRepair) {
        repairedBookmarks++;
      }

      return cleaned;
    }).filter(Boolean);

    let repairedFolders = 0;
    const cleanedFolders = folders.map((folder) => {
      let needsRepair = false;
      const cleaned = { ...folder };

      if (folder.name && !isValidString(folder.name)) {
        cleaned.name = sanitizeString(folder.name);
        needsRepair = true;
        console.log(`[DataRepair] Repaired folder name: "${folder.name}" -> "${cleaned.name}"`);
      }

      if (!cleaned.name || cleaned.name.trim() === '') {
        cleaned.name = 'Unnamed Folder';
        needsRepair = true;
      }

      if (!Array.isArray(cleaned.bookmarks)) {
        cleaned.bookmarks = [];
        needsRepair = true;
      }

      if (needsRepair) {
        repairedFolders++;
      }

      return cleaned;
    });

    result.repaired.bookmarks = repairedBookmarks;
    result.repaired.folders = repairedFolders;

    if (repairedBookmarks > 0 || repairedFolders > 0) {
      console.log(`[DataRepair] Saving repaired data: ${repairedBookmarks} bookmarks, ${repairedFolders} folders`);
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(cleanedBookmarks)),
        AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(cleanedFolders)),
      ]);

      result.repaired.statistics = true;
    }

    result.success = true;
    console.log('[DataRepair] Repair completed successfully');
    
  } catch (error) {
    console.error('[DataRepair] Repair failed:', error);
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
}

export function generateRepairReport(result: RepairResult): string {
  const lines: string[] = [];
  
  lines.push('=== Bookmark Data Repair Report ===');
  lines.push(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  lines.push('');
  lines.push('Repaired Items:');
  lines.push(`  Bookmarks: ${result.repaired.bookmarks}`);
  lines.push(`  Folders: ${result.repaired.folders}`);
  lines.push(`  Statistics: ${result.repaired.statistics ? 'Yes' : 'No'}`);
  lines.push('');
  
  if (result.errors.length > 0) {
    lines.push('Errors:');
    result.errors.forEach((error, index) => {
      lines.push(`  ${index + 1}. ${error}`);
    });
  }
  
  return lines.join('\n');
}

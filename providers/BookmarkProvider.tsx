import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCategories } from "@/providers/CategoryProvider";
import { safeJsonParse } from "@/providers/StorageProvider";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  favorite: boolean;
  folderId?: string;
  addedOn: string;
  lastOpened?: string;
  description?: string;
  color?: string;
  category?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  icon: string;
  builtIn: boolean;
  bookmarks: Bookmark[];
  categoryId?: string;
  createdAt?: number;
}

const STORAGE_KEYS = {
  BOOKMARKS: "@coolplay_bookmarks",
  FOLDERS: "@coolplay_folders",
  ORIGINAL_BOOKMARKS: "@coolplay_original_bookmarks",
};

const defaultFolders: BookmarkFolder[] = [
  { id: "all", name: "all_bookmarks", icon: "bookmark", builtIn: true, bookmarks: [] },
  { id: "favorites", name: "favorites", icon: "star", builtIn: true, bookmarks: [] },
  { id: "ai", name: "ai", icon: "sparkles", builtIn: true, bookmarks: [] },
  { id: "work", name: "work", icon: "briefcase", builtIn: true, bookmarks: [] },
  { id: "study", name: "study", icon: "book-open", builtIn: true, bookmarks: [] },
  { id: "entertainment", name: "entertainment", icon: "gamepad-2", builtIn: true, bookmarks: [] },
  { id: "social", name: "social", icon: "users", builtIn: true, bookmarks: [] },
  { id: "news", name: "news", icon: "newspaper", builtIn: true, bookmarks: [] },
];

const categoryKeywords = {
  ai: ["ai", "artificial intelligence", "machine learning", "deep learning", "neural network", "chatgpt", "gpt", "openai", "claude", "bard", "llm"],
  work: ["work", "office", "business", "job", "career", "professional", "meeting", "project", "team", "slack", "teams", "zoom"],
  study: ["study", "learn", "education", "course", "tutorial", "school", "university", "college", "research", "paper", "academic"],
  entertainment: ["entertainment", "video", "movie", "film", "music", "game", "gaming", "stream", "youtube", "netflix", "spotify"],
  social: ["social", "facebook", "twitter", "instagram", "tiktok", "whatsapp", "telegram", "messenger", "community", "forum"],
  news: ["news", "headline", "update", "breaking", "report", "media", "journal", "blog", "article", "press"],
};

export const [BookmarkProvider, useBookmarks] = createContextHook(() => {
  console.log('BookmarkProvider initialized');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>(defaultFolders);
  const [originalBookmarks, setOriginalBookmarks] = useState<Bookmark[]>([]);
  const [currentFolder, setCurrentFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    loadData();
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (toggleFavoriteTimeoutRef.current) {
        clearTimeout(toggleFavoriteTimeoutRef.current);
      }
      if (saveQueueRef.current) {
        clearTimeout(saveQueueRef.current);
      }
    };
  }, []);

  const ORDER: Record<string, number> = useMemo(() => ({
    all: 1,
    favorites: 2,
    ai: 3,
    work: 4,
    study: 5,
    entertainment: 6,
    social: 7,
    news: 8,
  }), []);

  const sortFolders = useCallback((arr: BookmarkFolder[]) => {
    return [...arr].sort((a, b) => (ORDER[a.id] ?? 9999) - (ORDER[b.id] ?? 9999));
  }, [ORDER]);

  const { categories } = useCategories();
  const categoriesStringRef = useRef<string>('');
  const isSyncingCategoriesRef = useRef(false);
  
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    if (isSyncingCategoriesRef.current) return;
    
    const categoriesString = JSON.stringify(categories.map(c => ({ id: c.id, name: c.name })));
    if (categoriesStringRef.current === categoriesString) return;
    categoriesStringRef.current = categoriesString;
    isSyncingCategoriesRef.current = true;
    
    setFolders(prev => {
      const map = new Map(prev.map(f => [f.id, f] as const));
      
      defaultFolders.forEach(df => {
        if (!map.has(df.id)) {
          map.set(df.id, { ...df, bookmarks: [] });
        }
      });
      
      categories.forEach(cat => {
        if (cat.id !== 'ai' && cat.id !== 'work' && cat.id !== 'study' && cat.id !== 'entertainment' && cat.id !== 'social' && cat.id !== 'news') {
          const existing = Array.from(map.values()).find(f => f.categoryId === cat.id);
          if (!existing) {
            const newFolder: BookmarkFolder = {
              id: `cat_${cat.id}`,
              name: cat.name,
              icon: 'folder',
              builtIn: false,
              bookmarks: [],
              categoryId: cat.id,
              createdAt: Date.now(),
            };
            map.set(newFolder.id, newFolder);
          }
        }
      });
      
      const validCategoryIds = new Set(categories.map(c => c.id));
      const kept: BookmarkFolder[] = [];
      map.forEach(f => {
        if (f.categoryId && !validCategoryIds.has(f.categoryId)) {
          return;
        }
        kept.push(f);
      });
      const sorted = sortFolders(kept);
      isSyncingCategoriesRef.current = false;
      return sorted;
    });
  }, [categories, sortFolders]);

  const loadData = async () => {
    try {
      console.log('[BookmarkProvider] Starting data load...');
      const startTime = Date.now();
      setIsLoading(true);
      
      const [storedBookmarks, storedFolders, storedOriginal] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
        AsyncStorage.getItem(STORAGE_KEYS.FOLDERS),
        AsyncStorage.getItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS),
      ]);

      if (storedBookmarks && typeof storedBookmarks === 'string' && storedBookmarks.length > 0) {
        const parsed = safeJsonParse(storedBookmarks, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[BookmarkProvider] Loaded ${parsed.length} bookmarks`);
          setBookmarks(parsed);
        } else if (parsed === null || !Array.isArray(parsed)) {
          console.warn('[BookmarkProvider] Invalid bookmarks format, clearing');
          await AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
        }
      }
      
      if (storedFolders && typeof storedFolders === 'string' && storedFolders.length > 0) {
        const parsed = safeJsonParse(storedFolders, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[BookmarkProvider] Loaded ${parsed.length} folders`);
          setFolders(parsed);
        } else if (parsed === null || !Array.isArray(parsed)) {
          console.warn('[BookmarkProvider] Invalid folders format, clearing');
          await AsyncStorage.removeItem(STORAGE_KEYS.FOLDERS);
        }
      }
      
      if (storedOriginal && typeof storedOriginal === 'string' && storedOriginal.length > 0) {
        const parsed = safeJsonParse(storedOriginal, []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOriginalBookmarks(parsed);
        } else if (parsed === null || !Array.isArray(parsed)) {
          console.warn('[BookmarkProvider] Invalid original bookmarks format, clearing');
          await AsyncStorage.removeItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS);
        }
      }
      
      const duration = Date.now() - startTime;
      console.log(`[BookmarkProvider] Data load completed in ${duration}ms`);
    } catch (error) {
      console.error("[BookmarkProvider] Error loading bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ bookmarks: Bookmark[], folders: BookmarkFolder[] } | null>(null);
  const isSavingRef = useRef(false);

  const saveData = useCallback(async (newBookmarks: Bookmark[], newFolders: BookmarkFolder[]) => {
    if (isSavingRef.current) {
      pendingSaveRef.current = { bookmarks: newBookmarks, folders: newFolders };
      return;
    }
    
    pendingSaveRef.current = { bookmarks: newBookmarks, folders: newFolders };
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      const toSave = pendingSaveRef.current;
      if (!toSave) return;
      
      isSavingRef.current = true;
      
      try {
        const bookmarksJson = JSON.stringify(toSave.bookmarks, null, 0);
        const foldersJson = JSON.stringify(toSave.folders, null, 0);
        
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, bookmarksJson),
          AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, foldersJson),
        ]);
        
        pendingSaveRef.current = null;
      } catch (error) {
        console.error("[BookmarkProvider] Error saving bookmarks:", error);
      } finally {
        isSavingRef.current = false;
      }
    }, 500);
  }, []);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, "id" | "addedOn">) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      addedOn: new Date().toISOString(),
    };
    
    setBookmarks(prev => {
      const updatedBookmarks = [...prev, newBookmark];
      return updatedBookmarks;
    });
    
    setFolders(prev => {
      const updatedFolders = prev.map((f) => {
        if (f.id === "all" || f.id === "favorites") return f;
        return { ...f, bookmarks: [...f.bookmarks] };
      });
      const categoriesForBookmark = categorizeBookmark(newBookmark);
      categoriesForBookmark.forEach((category) => {
        const folder = updatedFolders.find((f) => f.id === category);
        if (folder && !folder.bookmarks.find((b) => b.id === newBookmark.id)) {
          folder.bookmarks.push(newBookmark);
        }
      });
      return updatedFolders;
    });
    
    return newBookmark;
  }, []);

  const deleteBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => {
      const filtered = prev.filter((b) => b.id !== bookmarkId);
      return filtered;
    });
    setFolders(prev => {
      const updated = prev.map((folder) => ({
        ...folder,
        bookmarks: folder.bookmarks.filter((b) => b.id !== bookmarkId),
      }));
      return updated;
    });
  }, []);
  
  const lastSaveRef = useRef({ bookmarks: '', folders: '' });
  const saveQueueRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (isLoading) return;
    if (isSyncingCategoriesRef.current) return;
    
    const bookmarksStr = JSON.stringify(bookmarks);
    const foldersStr = JSON.stringify(folders);
    
    if (lastSaveRef.current.bookmarks === bookmarksStr && 
        lastSaveRef.current.folders === foldersStr) {
      return;
    }
    
    if (saveQueueRef.current) {
      clearTimeout(saveQueueRef.current);
    }
    
    saveQueueRef.current = setTimeout(() => {
      lastSaveRef.current = { bookmarks: bookmarksStr, folders: foldersStr };
      saveData(bookmarks, folders);
      saveQueueRef.current = null;
    }, 500);
  }, [bookmarks, folders, isLoading, saveData]);

  const toggleFavoriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFavoriteToggles = useRef<Set<string>>(new Set());
  
  const toggleFavorite = useCallback((bookmarkId: string) => {
    if (pendingFavoriteToggles.current.has(bookmarkId)) {
      console.log(`[BookmarkProvider] Debouncing favorite toggle for ${bookmarkId}`);
      return;
    }
    
    pendingFavoriteToggles.current.add(bookmarkId);
    
    setBookmarks(prevBookmarks => 
      prevBookmarks.map((b) =>
        b.id === bookmarkId ? { ...b, favorite: !b.favorite } : b
      )
    );
    
    if (toggleFavoriteTimeoutRef.current) {
      clearTimeout(toggleFavoriteTimeoutRef.current);
    }
    
    toggleFavoriteTimeoutRef.current = setTimeout(() => {
      pendingFavoriteToggles.current.delete(bookmarkId);
    }, 300);
  }, []);

  const pendingFolderAdds = useRef<Set<string>>(new Set());
  
  const addFolder = useCallback((categoryId: string, name: string, maxFolders: number = 5) => {
    let newFolderId: string | null = null;
    
    // Sanitize and normalize the name to handle emoji and special characters
    const sanitizedName = name.trim().normalize('NFC');
    if (!sanitizedName) {
      console.error('[BookmarkProvider] Cannot add folder with empty name');
      return null;
    }
    
    // Prevent duplicate rapid additions
    const folderKey = `${categoryId}_${sanitizedName}`;
    if (pendingFolderAdds.current.has(folderKey)) {
      console.log('[BookmarkProvider] Debouncing folder add for:', sanitizedName);
      return null;
    }
    
    pendingFolderAdds.current.add(folderKey);
    setTimeout(() => {
      pendingFolderAdds.current.delete(folderKey);
    }, 1000);
    
    console.log('[BookmarkProvider] Adding folder:', sanitizedName, 'to category:', categoryId);
    
    setFolders(prev => {
      // Check if folder with same name already exists
      const existingFolder = prev.find(f => 
        f.categoryId === categoryId && 
        f.name.normalize('NFC') === sanitizedName
      );
      
      if (existingFolder) {
        console.warn('[BookmarkProvider] Folder with same name already exists:', sanitizedName);
        return prev;
      }
      
      const categoryFolders = prev.filter(f => f.categoryId === categoryId);
      if (categoryFolders.length >= maxFolders) {
        console.warn('[BookmarkProvider] Maximum number of folders reached for category:', categoryId);
        return prev;
      }
      
      // Use timestamp + random to ensure unique IDs even for rapid additions
      const uniqueId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newFolder: BookmarkFolder = {
        id: uniqueId,
        name: sanitizedName,
        icon: "folder",
        builtIn: false,
        bookmarks: [],
        categoryId,
        createdAt: Date.now(),
      };
      newFolderId = newFolder.id;
      console.log('[BookmarkProvider] Successfully added folder:', newFolder.name, 'with ID:', newFolder.id);
      console.log('[BookmarkProvider] Total folders after add:', prev.length + 1);
      return [...prev, newFolder];
    });
    
    return newFolderId;
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders(prev => {
      const folder = prev.find((f) => f.id === folderId);
      if (!folder || folder.builtIn) {
        console.warn('[BookmarkProvider] Cannot delete built-in folder:', folderId);
        return prev;
      }
      console.log('[BookmarkProvider] Deleting folder:', folder.name, 'ID:', folderId);
      const updated = prev.filter((f) => f.id !== folderId);
      console.log('[BookmarkProvider] Total folders after delete:', updated.length);
      return updated;
    });
    setBookmarks(prev => prev.filter(b => b.folderId !== folderId));
  }, []);

  const editFolder = useCallback((folderId: string, newName: string) => {
    // Normalize the name to handle emoji and special characters
    const sanitizedName = newName.trim().normalize('NFC');
    if (!sanitizedName) {
      console.error('[BookmarkProvider] Cannot edit folder with empty name');
      return;
    }
    
    setFolders(prev => prev.map((f) =>
      f.id === folderId && !f.builtIn ? { ...f, name: sanitizedName } : f
    ));
  }, []);

  const moveBookmarkToFolder = useCallback((bookmarkId: string, folderId: string) => {
    const bookmark = bookmarks.find((b) => b.id === bookmarkId);
    if (!bookmark) return;

    const updatedFolders = folders.map((folder) => {
      if (folder.id === "all") return folder;
      
      const filteredBookmarks = folder.bookmarks.filter((b) => b.id !== bookmarkId);
      if (folder.id === folderId) {
        return { ...folder, bookmarks: [...filteredBookmarks, bookmark] };
      }
      return { ...folder, bookmarks: filteredBookmarks };
    });

    setFolders(updatedFolders);
    saveData(bookmarks, updatedFolders);
  }, [bookmarks, folders]);

  const smartCategorize = useCallback((categoryKeywordsMap?: Record<string, string[]>) => {
    setOriginalBookmarks([...bookmarks]);
    AsyncStorage.setItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS, JSON.stringify(bookmarks));

    const updatedFolders = folders.map((folder) => {
      if (folder.id === "all" || folder.id === "favorites") return folder;
      return { ...folder, bookmarks: [] };
    });

    bookmarks.forEach((bookmark) => {
      const categories = categorizeBookmark(bookmark, categoryKeywordsMap);
      categories.forEach((category) => {
        const folder = updatedFolders.find((f) => f.id === category);
        if (folder && !folder.bookmarks.find((b) => b.id === bookmark.id)) {
          folder.bookmarks.push(bookmark);
        }
      });
    });

    setFolders(updatedFolders);
    saveData(bookmarks, updatedFolders);
  }, [bookmarks, folders]);

  const categorizeBookmark = (bookmark: Bookmark, categoryKeywordsMap?: Record<string, string[]>): string[] => {
    const title = bookmark.title.toLowerCase();
    const url = bookmark.url.toLowerCase();
    const description = (bookmark.description || "").toLowerCase();
    const categories: string[] = [];
    
    const keywordsToUse = categoryKeywordsMap || categoryKeywords;

    Object.entries(keywordsToUse).forEach(([category, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        let points = 0;
        if (title.includes(keyword.toLowerCase())) points += 3;
        if (url.includes(keyword.toLowerCase())) points += 2;
        if (description.includes(keyword.toLowerCase())) points += 1;
        return acc + points;
      }, 0);

      if (score > 2) {
        categories.push(category);
      }
    });

    return categories.length > 0 ? categories : [];
  };

  const restoreOriginalBookmarks = useCallback(() => {
    if (originalBookmarks.length === 0) return;

    setBookmarks([...originalBookmarks]);
    const updatedFolders = folders.map((folder) => {
      if (folder.id === "all") return folder;
      return { ...folder, bookmarks: [] };
    });
    setFolders(updatedFolders);
    saveData(originalBookmarks, updatedFolders);
    setOriginalBookmarks([]);
    AsyncStorage.removeItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS);
  }, [originalBookmarks, folders]);

  const findDuplicates = useCallback((): Bookmark[] => {
    const seen = new Set<string>();
    const duplicates: Bookmark[] = [];

    bookmarks.forEach((bookmark) => {
      const key = bookmark.url.toLowerCase();
      if (seen.has(key)) {
        duplicates.push(bookmark);
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }, [bookmarks]);

  const cleanupBookmarks = useCallback(() => {
    const duplicates = findDuplicates();
    const duplicateIds = new Set(duplicates.map((d) => d.id));

    const updatedBookmarks = bookmarks.filter((b) => !duplicateIds.has(b.id));
    const updatedFolders = folders.map((folder) => ({
      ...folder,
      bookmarks: folder.bookmarks.filter((b) => !duplicateIds.has(b.id)),
    }));

    setBookmarks(updatedBookmarks);
    setFolders(updatedFolders);
    saveData(updatedBookmarks, updatedFolders);

    return duplicates.length;
  }, [bookmarks, folders, findDuplicates]);

  const importBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    setOriginalBookmarks([...bookmarks]);
    AsyncStorage.setItem(STORAGE_KEYS.ORIGINAL_BOOKMARKS, JSON.stringify(bookmarks));

    const updatedBookmarks = [...bookmarks, ...newBookmarks];
    setBookmarks(updatedBookmarks);
    saveData(updatedBookmarks, folders);
  }, [bookmarks, folders]);

  const exportBookmarks = useCallback((format: "html" | "json" = "html"): string => {
    if (format === "json") {
      return JSON.stringify(bookmarks, null, 2);
    }

    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
    html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
    html += '<TITLE>Bookmarks</TITLE>\n';
    html += '<H1>Bookmarks</H1>\n';
    html += '<DL><p>\n';

    bookmarks.forEach((bookmark) => {
      html += `<DT><A HREF="${bookmark.url}" ADD_DATE="${Date.now()}">${bookmark.title}</A>\n`;
    });

    html += '</DL><p>\n';
    return html;
  }, [bookmarks]);

  const getFilteredBookmarks = useCallback((): Bookmark[] => {
    let displayBookmarks: Bookmark[] = [];

    if (currentFolder === "all") {
      displayBookmarks = bookmarks;
    } else if (currentFolder === "favorites") {
      displayBookmarks = bookmarks.filter((b) => b.favorite);
    } else {
      const folder = folders.find((f) => f.id === currentFolder);
      displayBookmarks = folder ? folder.bookmarks : [];
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      displayBookmarks = displayBookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          (b.description && b.description.toLowerCase().includes(query))
      );
    }

    return displayBookmarks;
  }, [bookmarks, folders, currentFolder, searchQuery]);

  const getStats = useCallback(() => {
    const totalBookmarks = bookmarks.length;
    // Count all folders including built-in ones
    const totalFolders = folders.length;
    const totalFavorites = bookmarks.filter((b) => b.favorite).length;
    const duplicates = findDuplicates().length;
    
    console.log('[BookmarkProvider] Stats:', {
      totalBookmarks,
      totalFolders,
      totalFavorites,
      duplicates,
    });
    
    return {
      totalBookmarks,
      totalFolders,
      totalFavorites,
      duplicates,
    };
  }, [bookmarks, folders, findDuplicates]);

  // Delete all folders for a category
  const deleteFoldersByCategory = useCallback((categoryId: string) => {
    const folderIds = folders.filter(f => f.categoryId === categoryId).map(f => f.id);
    
    // Remove folders
    const updatedFolders = folders.filter(f => f.categoryId !== categoryId);
    
    // Remove all bookmarks in these folders
    const updatedBookmarks = bookmarks.filter(b => !folderIds.includes(b.folderId || ''));
    
    setBookmarks(updatedBookmarks);
    setFolders(updatedFolders);
    saveData(updatedBookmarks, updatedFolders);
  }, [bookmarks, folders]);

  // Delete all folders
  const deleteAllFolders = useCallback(() => {
    const updatedFolders = folders.filter(f => f.builtIn);
    // Remove all bookmarks that were in folders
    const updatedBookmarks = bookmarks.filter(b => !b.folderId || folders.find(f => f.id === b.folderId && f.builtIn));
    
    setFolders(updatedFolders);
    setBookmarks(updatedBookmarks);
    saveData(updatedBookmarks, updatedFolders);
  }, [bookmarks, folders]);

  // Get folders for a specific category
  const getFoldersByCategory = useCallback((categoryId: string): BookmarkFolder[] => {
    return folders.filter(f => f.categoryId === categoryId);
  }, [folders]);

  // Get bookmarks for a specific folder
  const getBookmarksByFolder = useCallback((folderId: string): Bookmark[] => {
    return bookmarks.filter(b => b.folderId === folderId);
  }, [bookmarks]);

  // Export specific folder bookmarks
  const exportFolderBookmarks = useCallback((folderId: string, format: "html" | "json" = "html"): string => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return "";
    const list = folderId === "all" ? bookmarks : folderId === "favorites" ? bookmarks.filter(b => b.favorite) : folder.bookmarks;
    if (format === "json") {
      return JSON.stringify(list, null, 2);
    }
    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
    html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
    html += `<TITLE>Bookmarks - ${folder.name}</TITLE>\n`;
    html += `<H1>Bookmarks - ${folder.name}</H1>\n`;
    html += '<DL><p>\n';
    list.forEach((bookmark) => {
      html += `<DT><A HREF="${bookmark.url}" ADD_DATE="${Date.now()}">${bookmark.title}</A>\n`;
    });
    html += '</DL><p>\n';
    return html;
  }, [folders, bookmarks]);

  const initialSortDone = useRef(false);
  useEffect(() => {
    if (!initialSortDone.current) {
      setFolders(prev => sortFolders(prev));
      initialSortDone.current = true;
    }
  }, [sortFolders]);

  return useMemo(() => ({
    bookmarks,
    folders,
    originalBookmarks,
    currentFolder,
    searchQuery,
    isLoading,
    setCurrentFolder,
    setSearchQuery,
    addBookmark,
    deleteBookmark,
    toggleFavorite,
    addFolder,
    deleteFolder,
    editFolder,
    moveBookmarkToFolder,
    smartCategorize,
    restoreOriginalBookmarks,
    cleanupBookmarks,
    importBookmarks,
    exportBookmarks,
    exportFolderBookmarks,
    getFilteredBookmarks,
    getStats,
    findDuplicates,
    deleteFoldersByCategory,
    deleteAllFolders,
    getFoldersByCategory,
    getBookmarksByFolder,
  }), [bookmarks, folders, originalBookmarks, currentFolder, searchQuery, isLoading, setCurrentFolder, setSearchQuery, addBookmark, deleteBookmark, toggleFavorite, addFolder, deleteFolder, editFolder, moveBookmarkToFolder, smartCategorize, restoreOriginalBookmarks, cleanupBookmarks, importBookmarks, exportBookmarks, exportFolderBookmarks, getFilteredBookmarks, getStats, findDuplicates, deleteFoldersByCategory, deleteAllFolders, getFoldersByCategory, getBookmarksByFolder]);
});
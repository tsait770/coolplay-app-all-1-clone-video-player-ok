import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useStorage } from '@/providers/StorageProvider';

export interface Category {
  id: string;
  key: string;
  name: string;
  icon: string;
  isDefault: boolean;
  isVisible: boolean;
  maxFolders: number;
  keywords: string[];
}

const defaultCategories: Category[] = [
  { 
    id: 'ai', 
    key: 'ai_folder', 
    name: 'AI', 
    icon: 'robot', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'chatgpt', 'gpt', 'openai', 'claude', 'bard', 'llm', 'data science', 'NLP', 'computer vision', 'robotics', 'automation', 'algorithm', 'big data', 'AI ethics', 'generative AI', 'transformer', 'reinforcement learning', 'AI application', 'AI research']
  },
  { 
    id: 'work', 
    key: 'work_folder', 
    name: '工作', 
    icon: 'briefcase', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['work', 'office', 'business', 'job', 'career', 'professional', 'meeting', 'project', 'team', 'slack', 'teams', 'zoom', 'workplace', 'remote work', 'productivity', 'deadline', 'conference', 'coworker', 'manager', 'interview', 'resume', 'promotion', 'entrepreneurship', 'corporate', 'freelancer', 'workflow', 'task']
  },
  { 
    id: 'study', 
    key: 'study_folder', 
    name: '學習', 
    icon: 'book', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['study', 'learn', 'education', 'course', 'tutorial', 'school', 'university', 'college', 'research', 'paper', 'academic', 'online learning', 'e-learning', 'lecture', 'homework', 'exam', 'student', 'teacher', 'textbook', 'knowledge', 'skill', 'MOOC', 'certification', 'scholarship', 'academia', 'thesis', 'dissertation']
  },
  { 
    id: 'entertainment', 
    key: 'entertainment_folder', 
    name: '娛樂', 
    icon: 'gamepad-2', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['entertainment', 'video', 'movie', 'film', 'music', 'game', 'gaming', 'stream', 'youtube', 'netflix', 'spotify', 'fun', 'leisure', 'show', 'series', 'anime', 'podcast', 'concert', 'playlist', 'gamer', 'esports', 'Twitch', 'Disney+', 'entertainment news', 'celebrity', 'hobby', 'relax']
  },
  { 
    id: 'social', 
    key: 'social_folder', 
    name: '社交', 
    icon: 'users', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['social', 'facebook', 'twitter', 'instagram', 'tiktok', 'whatsapp', 'telegram', 'messenger', 'community', 'forum', 'social media', 'networking', 'messaging', 'group chat', 'DM', 'story', 'post', 'like', 'share', 'comment', 'follower', 'viral', 'profile', 'status', 'online community']
  },
  { 
    id: 'news', 
    key: 'news_folder', 
    name: '新聞', 
    icon: 'newspaper', 
    isDefault: true, 
    isVisible: true, 
    maxFolders: 5,
    keywords: ['news', 'headline', 'update', 'breaking', 'report', 'media', 'journal', 'blog', 'article', 'press', 'current events', 'journalism', 'broadcaster', 'newspaper', 'magazine', 'podcast', 'influencer', 'trending', 'fact-check', 'editorial', 'coverage', 'anchor', 'subscription', 'digital media']
  },
];

const STORAGE_KEY = 'bookmark_categories';

export const [CategoryProvider, useCategories] = createContextHook(() => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const { getItem, setItem } = useStorage();

  // Load categories from storage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const stored = await getItem(STORAGE_KEY);
        if (stored && typeof stored === 'string' && stored.length > 0) {
          try {
            const cleanedData = stored
              .trim()
              .replace(/^\uFEFF/, '')
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            
            if (cleanedData.includes('object Object') || 
                cleanedData.includes('[object Object]') ||
                cleanedData.includes('undefined') || 
                cleanedData.includes('NaN') ||
                (/^[a-zA-Z]/.test(cleanedData) && !cleanedData.startsWith('[')) ||
                !cleanedData.includes('[')) {
              console.log('[CategoryProvider] Detected corrupted categories data, clearing');
              await setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
              setCategories(defaultCategories);
              return;
            }
            
            if (cleanedData.startsWith('[') && cleanedData.endsWith(']')) {
              let parsed;
              try {
                parsed = JSON.parse(cleanedData);
              } catch (jsonError: any) {
                console.error('[CategoryProvider] JSON parse failed:', jsonError?.message);
                await setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
                setCategories(defaultCategories);
                return;
              }
              
              if (Array.isArray(parsed)) {
                const mergedCategories = defaultCategories.map(defaultCat => {
                  const storedCat = parsed.find((c: Category) => c.id === defaultCat.id);
                  return storedCat ? { ...defaultCat, ...storedCat } : defaultCat;
                });
                const customCategories = parsed.filter((c: Category) => !c.isDefault);
                setCategories([...mergedCategories, ...customCategories]);
              } else {
                console.log('[CategoryProvider] Invalid categories structure, resetting');
                await setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
                setCategories(defaultCategories);
              }
            } else {
              console.log('[CategoryProvider] Invalid JSON format for categories, resetting');
              await setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
              setCategories(defaultCategories);
            }
          } catch (parseError: any) {
            console.error('[CategoryProvider] Error parsing categories:', parseError?.message || parseError);
            await setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
            setCategories(defaultCategories);
          }
        }
      } catch (error: any) {
        console.error('[CategoryProvider] Error loading categories:', error?.message || error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, [getItem, setItem]);

  // Save categories to storage
  const saveCategories = useCallback(async (newCategories: Category[]) => {
    if (!newCategories || !Array.isArray(newCategories)) {
      console.error('Invalid categories data');
      return;
    }
    try {
      await setItem(STORAGE_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [setItem]);

  // Toggle category visibility
  const toggleCategoryVisibility = useCallback((categoryId: string) => {
    if (!categoryId || !categoryId.trim()) {
      console.error('Invalid category ID');
      return;
    }
    const updated = categories.map(cat =>
      cat.id === categoryId.trim() ? { ...cat, isVisible: !cat.isVisible } : cat
    );
    saveCategories(updated);
  }, [categories, saveCategories]);

  // Add custom category
  const addCategory = useCallback((name: string, icon: string, keywords: string[] = []) => {
    if (!name || !name.trim() || name.trim().length > 50) {
      console.error('Invalid category name');
      return;
    }
    if (!icon || !icon.trim()) {
      console.error('Invalid category icon');
      return;
    }
    const sanitizedName = name.trim();
    const sanitizedIcon = icon.trim();
    const newCategory: Category = {
      id: `custom_${Date.now()}`,
      key: `${sanitizedName.toLowerCase()}_folder`,
      name: sanitizedName,
      icon: sanitizedIcon,
      isDefault: false,
      isVisible: true,
      maxFolders: 5,
      keywords: keywords.length > 0 ? keywords : [sanitizedName.toLowerCase()],
    };
    // Add new category at the end (after default categories)
    saveCategories([...categories, newCategory]);
  }, [categories, saveCategories]);

  // Delete category (only custom categories can be deleted, default ones can only be hidden)
  const deleteCategory = useCallback((categoryId: string) => {
    if (!categoryId || !categoryId.trim()) {
      console.error('Invalid category ID');
      return false;
    }
    
    const category = categories.find(c => c.id === categoryId.trim());
    if (!category) {
      console.error('Category not found');
      return false;
    }
    
    // Prevent deletion of default categories
    if (category.isDefault) {
      console.warn('Cannot delete default category. Use toggleCategoryVisibility to hide it instead.');
      return false;
    }
    
    const updated = categories.filter(c => c.id !== categoryId.trim());
    saveCategories(updated);
    return true;
  }, [categories, saveCategories]);

  // Update category
  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    if (!categoryId || !categoryId.trim()) {
      console.error('Invalid category ID');
      return;
    }
    const updated = categories.map(cat =>
      cat.id === categoryId.trim() ? { ...cat, ...updates } : cat
    );
    saveCategories(updated);
  }, [categories, saveCategories]);

  // Update category keywords
  const updateCategoryKeywords = useCallback((categoryId: string, keywords: string[]) => {
    updateCategory(categoryId, { keywords });
  }, [updateCategory]);

  // Get category count
  const getCategoryCount = useCallback(() => {
    return categories.length;
  }, [categories]);

  // Get total visible folder count (including 'all' and 'favorites' + visible categories)
  const getTotalVisibleFolderCount = useCallback(() => {
    const visibleCategories = categories.filter(c => c.isVisible);
    // Add 2 for 'all' and 'favorites' built-in folders
    return visibleCategories.length + 2;
  }, [categories]);

  // Get total folder count (including 'all', 'favorites', and all categories)
  const getTotalFolderCount = useCallback(() => {
    // Add 2 for 'all' and 'favorites' built-in folders
    return categories.length + 2;
  }, [categories]);

  // Reset to default categories
  const resetToDefaults = useCallback(() => {
    saveCategories(defaultCategories);
  }, [saveCategories]);

  // Get visible categories
  const getVisibleCategories = useCallback(() => {
    return categories.filter(c => c.isVisible);
  }, [categories]);

  return useMemo(() => ({
    categories,
    isLoading,
    toggleCategoryVisibility,
    addCategory,
    deleteCategory,
    updateCategory,
    updateCategoryKeywords,
    getVisibleCategories,
    getCategoryCount,
    getTotalVisibleFolderCount,
    getTotalFolderCount,
    resetToDefaults,
  }), [categories, isLoading, toggleCategoryVisibility, addCategory, deleteCategory, updateCategory, updateCategoryKeywords, getVisibleCategories, getCategoryCount, getTotalVisibleFolderCount, getTotalFolderCount, resetToDefaults]);
});
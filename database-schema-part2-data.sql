-- =====================================================
-- InstaPlay V7 Database Schema - Part 2: Data Tables
-- 數據表格（語音記錄、書籤、文件夾）
-- =====================================================
-- 注意: 請確保 Part 1 已成功執行後再執行此文件
-- =====================================================

-- =====================================================
-- 4. VOICE_LOGS TABLE (Usage Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.voice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Voice command details
  command_text TEXT,
  command_type TEXT,
  language TEXT,
  confidence_score DECIMAL(3, 2),
  
  -- Playback context
  source_url TEXT,
  video_platform TEXT,
  
  -- Result
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  -- Metadata
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  device_id UUID REFERENCES public.user_devices(id)
);

-- RLS Policies for voice_logs
ALTER TABLE public.voice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON public.voice_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON public.voice_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. FOLDERS TABLE (Bookmark Organization)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  
  -- Folder details
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  
  -- Auto-categorization rules
  auto_categorize BOOLEAN DEFAULT FALSE,
  keywords TEXT[],
  
  -- Organization
  sort_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- RLS Policies for folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own folders" ON public.folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders" ON public.folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders" ON public.folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders" ON public.folders
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. BOOKMARKS TABLE (User Bookmarks)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  
  -- Bookmark details
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Video metadata
  platform TEXT,
  video_id TEXT,
  duration INTEGER,
  
  -- Organization
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Access tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 7. USAGE_STATS TABLE (Analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Date tracking
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Usage counts
  voice_commands_count INTEGER DEFAULT 0,
  videos_played_count INTEGER DEFAULT 0,
  bookmarks_added_count INTEGER DEFAULT 0,
  
  -- Time tracking
  total_watch_time_seconds INTEGER DEFAULT 0,
  session_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, stat_date)
);

-- RLS Policies for usage_stats
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats" ON public.usage_stats
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Voice logs indexes
CREATE INDEX IF NOT EXISTS idx_voice_logs_user_id ON public.voice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_logs_executed_at ON public.voice_logs(executed_at);

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id ON public.bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags);

-- Folders indexes
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON public.folders(parent_folder_id);

-- Usage stats indexes
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON public.usage_stats(user_id, stat_date);

-- =====================================================
-- Part 2 完成
-- 請在 Supabase SQL Editor 中執行此文件
-- 執行成功後再執行 Part 3
-- =====================================================

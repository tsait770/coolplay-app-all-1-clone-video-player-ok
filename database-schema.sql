-- ============================================
-- Supabase Database Schema
-- Complete setup for authentication and data storage
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- Stores user profile information and membership status
-- ============================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  membership_tier TEXT DEFAULT 'free_trial' CHECK (membership_tier IN ('free_trial', 'free', 'basic', 'premium')),
  membership_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_used BOOLEAN DEFAULT false,
  trial_usage_remaining INTEGER DEFAULT 2000,
  monthly_usage_remaining INTEGER DEFAULT 0,
  daily_usage_count INTEGER DEFAULT 0,
  total_usage_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  max_devices INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create index for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- ============================================
-- 2. FOLDERS TABLE
-- Stores user-created folders for organizing bookmarks
-- ============================================

CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📁',
  category_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_folders_user_id ON folders(user_id);

-- ============================================
-- 3. BOOKMARKS TABLE
-- Stores user bookmarks with metadata
-- ============================================

CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  favicon TEXT,
  favorite BOOLEAN DEFAULT false,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_folder_id ON bookmarks(folder_id);
CREATE INDEX idx_bookmarks_favorite ON bookmarks(user_id, favorite) WHERE favorite = true;
CREATE INDEX idx_bookmarks_url ON bookmarks(url);

-- ============================================
-- 4. TRIGGERS
-- Automatically update timestamps and create profiles
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to folders
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to bookmarks
CREATE TRIGGER update_bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. USEFUL QUERIES
-- Common queries for development and debugging
-- ============================================

-- Get user profile with membership status
-- SELECT * FROM profiles WHERE id = auth.uid();

-- Get all bookmarks for current user
-- SELECT * FROM bookmarks WHERE user_id = auth.uid() ORDER BY created_at DESC;

-- Get all folders for current user
-- SELECT * FROM folders WHERE user_id = auth.uid() ORDER BY name;

-- Get bookmarks in a specific folder
-- SELECT b.* FROM bookmarks b
-- WHERE b.user_id = auth.uid() AND b.folder_id = 'folder-uuid'
-- ORDER BY b.created_at DESC;

-- Get favorite bookmarks
-- SELECT * FROM bookmarks
-- WHERE user_id = auth.uid() AND favorite = true
-- ORDER BY created_at DESC;

-- Count bookmarks per folder
-- SELECT f.id, f.name, COUNT(b.id) as bookmark_count
-- FROM folders f
-- LEFT JOIN bookmarks b ON b.folder_id = f.id
-- WHERE f.user_id = auth.uid()
-- GROUP BY f.id, f.name;

-- ============================================
-- 6. CLEANUP (Optional - for development)
-- Use these to reset tables during development
-- ============================================

-- WARNING: These commands will delete all data!
-- Uncomment only if you need to reset the database

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS update_bookmarks_updated_at ON bookmarks;
-- DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
-- DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS bookmarks CASCADE;
-- DROP TABLE IF EXISTS folders CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- 7. DEVICE BINDING TABLES
-- Stores device verification and binding information
-- ============================================

CREATE TABLE device_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT NOT NULL,
  device_name TEXT,
  verification_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

ALTER TABLE device_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own device verifications"
  ON device_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own device verifications"
  ON device_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own device verifications"
  ON device_verifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own device verifications"
  ON device_verifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_device_verifications_user_id ON device_verifications(user_id);
CREATE INDEX idx_device_verifications_code ON device_verifications(verification_code);

CREATE TABLE bound_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT NOT NULL,
  device_name TEXT,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

ALTER TABLE bound_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bound devices"
  ON bound_devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bound devices"
  ON bound_devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bound devices"
  ON bound_devices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bound devices"
  ON bound_devices FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_bound_devices_user_id ON bound_devices(user_id);
CREATE INDEX idx_bound_devices_device_id ON bound_devices(device_id);

-- ============================================
-- 8. USAGE TRACKING TABLE
-- Tracks video playback usage for quota management
-- ============================================

CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  video_source TEXT,
  is_adult_content BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);

-- ============================================
-- 9. FUNCTIONS FOR USAGE MANAGEMENT
-- Automatically reset daily/monthly quotas
-- ============================================

CREATE OR REPLACE FUNCTION reset_daily_quota()
RETURNS void AS $
BEGIN
  UPDATE profiles
  SET daily_usage_count = 0,
      last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_usage_quota(p_user_id UUID)
RETURNS BOOLEAN AS $
DECLARE
  v_profile RECORD;
  v_can_use BOOLEAN;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  
  IF v_profile.last_reset_date < CURRENT_DATE THEN
    UPDATE profiles
    SET daily_usage_count = 0,
        last_reset_date = CURRENT_DATE
    WHERE id = p_user_id;
    v_profile.daily_usage_count := 0;
  END IF;
  
  CASE v_profile.membership_tier
    WHEN 'free_trial' THEN
      v_can_use := v_profile.trial_usage_remaining > 0;
    WHEN 'free' THEN
      v_can_use := v_profile.daily_usage_count < 30;
    WHEN 'basic' THEN
      v_can_use := v_profile.monthly_usage_remaining > 0 OR v_profile.daily_usage_count < 40;
    WHEN 'premium' THEN
      v_can_use := true;
    ELSE
      v_can_use := false;
  END CASE;
  
  RETURN v_can_use;
END;
$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID)
RETURNS void AS $
DECLARE
  v_profile RECORD;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  
  IF v_profile.last_reset_date < CURRENT_DATE THEN
    UPDATE profiles
    SET daily_usage_count = 1,
        total_usage_count = total_usage_count + 1,
        last_reset_date = CURRENT_DATE
    WHERE id = p_user_id;
  ELSE
    UPDATE profiles
    SET daily_usage_count = daily_usage_count + 1,
        total_usage_count = total_usage_count + 1
    WHERE id = p_user_id;
  END IF;
  
  CASE v_profile.membership_tier
    WHEN 'free_trial' THEN
      UPDATE profiles
      SET trial_usage_remaining = GREATEST(0, trial_usage_remaining - 1)
      WHERE id = p_user_id;
      
      IF v_profile.trial_usage_remaining <= 1 THEN
        UPDATE profiles
        SET membership_tier = 'free',
            trial_used = true
        WHERE id = p_user_id;
      END IF;
    WHEN 'basic' THEN
      UPDATE profiles
      SET monthly_usage_remaining = GREATEST(0, monthly_usage_remaining - 1)
      WHERE id = p_user_id;
  END CASE;
END;
$ LANGUAGE plpgsql;

-- ============================================
-- SETUP COMPLETE
-- ============================================

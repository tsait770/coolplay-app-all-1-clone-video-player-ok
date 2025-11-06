-- =====================================================
-- InstaPlay V7 Database Schema
-- Supabase PostgreSQL Database Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USERS TABLE (Extends Supabase Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Membership information
  membership_level TEXT NOT NULL DEFAULT 'free' CHECK (membership_level IN ('free_trial', 'free', 'basic', 'premium')),
  membership_started_at TIMESTAMPTZ DEFAULT NOW(),
  membership_expires_at TIMESTAMPTZ,
  
  -- Usage quotas
  free_trial_remaining INTEGER DEFAULT 2000, -- Total trial quota
  daily_free_quota INTEGER DEFAULT 30, -- Daily free tier quota
  monthly_basic_quota INTEGER DEFAULT 1500, -- Monthly basic tier quota
  daily_basic_bonus INTEGER DEFAULT 40, -- Daily login bonus for basic
  last_daily_reset_at TIMESTAMPTZ DEFAULT NOW(),
  last_monthly_reset_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Device management
  max_devices INTEGER DEFAULT 1, -- 1 for free, 3 for basic, 5 for premium
  verification_code TEXT, -- 6-digit code for device binding
  verification_code_expires_at TIMESTAMPTZ,
  
  -- Age verification for adult content
  age_verified BOOLEAN DEFAULT FALSE,
  age_verification_date TIMESTAMPTZ,
  date_of_birth DATE,
  
  -- Privacy and consent
  privacy_consent_given BOOLEAN DEFAULT FALSE,
  privacy_consent_date TIMESTAMPTZ,
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- RLS Policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. USER_DEVICES TABLE (Device Binding)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Device identification
  device_id TEXT NOT NULL, -- Platform-specific device ID
  device_name TEXT NOT NULL, -- User-friendly device name
  device_type TEXT, -- 'ios', 'android', 'web'
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,
  
  -- Device status
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  last_ip_address INET,
  
  -- Metadata
  bound_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, device_id)
);

-- RLS Policies for user_devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devices" ON public.user_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices" ON public.user_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON public.user_devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices" ON public.user_devices
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. SUBSCRIPTIONS TABLE (PayPal Integration)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- PayPal subscription details
  paypal_subscription_id TEXT UNIQUE,
  paypal_plan_id TEXT NOT NULL,
  paypal_order_id TEXT,
  
  -- Subscription information
  plan_name TEXT NOT NULL CHECK (plan_name IN ('basic', 'premium')),
  billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly'
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  next_billing_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 4. VOICE_LOGS TABLE (Usage Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.voice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Voice command details
  command_text TEXT,
  command_type TEXT, -- 'play', 'pause', 'seek', 'volume', etc.
  language TEXT, -- 'en', 'zh-CN', 'zh-TW', etc.
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  
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
  icon TEXT, -- Icon name or emoji
  color TEXT, -- Hex color code
  
  -- Auto-categorization rules
  auto_categorize BOOLEAN DEFAULT FALSE,
  keywords TEXT[], -- Keywords for automatic categorization
  
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
  platform TEXT, -- Detected platform
  video_id TEXT, -- Platform-specific video ID
  duration INTEGER, -- Duration in seconds
  
  -- Organization
  tags TEXT[], -- Array of tags for categorization
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
-- INDEXES for Performance
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_membership_level ON public.users(membership_level);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Devices indexes
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_device_id ON public.user_devices(device_id);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_id ON public.subscriptions(paypal_subscription_id);

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
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_devices_updated_at BEFORE UPDATE ON public.user_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at BEFORE UPDATE ON public.usage_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Deduct usage quota when voice command is logged
CREATE OR REPLACE FUNCTION deduct_voice_usage()
RETURNS TRIGGER AS $$
DECLARE
  user_membership TEXT;
  current_date DATE := CURRENT_DATE;
BEGIN
  -- Get user membership level
  SELECT membership_level INTO user_membership
  FROM public.users
  WHERE id = NEW.user_id;
  
  -- Deduct quota based on membership level
  IF user_membership = 'free_trial' THEN
    -- Deduct from trial quota
    UPDATE public.users
    SET free_trial_remaining = GREATEST(0, free_trial_remaining - 1)
    WHERE id = NEW.user_id;
    
  ELSIF user_membership = 'free' THEN
    -- Deduct from daily free quota
    UPDATE public.users
    SET daily_free_quota = GREATEST(0, daily_free_quota - 1)
    WHERE id = NEW.user_id;
    
  ELSIF user_membership = 'basic' THEN
    -- Deduct from monthly basic quota
    UPDATE public.users
    SET monthly_basic_quota = GREATEST(0, monthly_basic_quota - 1)
    WHERE id = NEW.user_id;
    
  -- Premium has unlimited usage, no deduction needed
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply voice usage deduction trigger
CREATE TRIGGER deduct_voice_usage_trigger
AFTER INSERT ON public.voice_logs
FOR EACH ROW EXECUTE FUNCTION deduct_voice_usage();

-- Function: Update membership level when subscription changes
CREATE OR REPLACE FUNCTION update_membership_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user membership level based on subscription status
  IF NEW.status = 'active' THEN
    UPDATE public.users
    SET 
      membership_level = NEW.plan_name,
      membership_started_at = NEW.started_at,
      membership_expires_at = NEW.expires_at,
      max_devices = CASE 
        WHEN NEW.plan_name = 'basic' THEN 3
        WHEN NEW.plan_name = 'premium' THEN 5
        ELSE 1
      END
    WHERE id = NEW.user_id;
    
  ELSIF NEW.status IN ('cancelled', 'expired') THEN
    -- Downgrade to free tier
    UPDATE public.users
    SET 
      membership_level = 'free',
      max_devices = 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply subscription update trigger
CREATE TRIGGER update_membership_trigger
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_membership_from_subscription();

-- Function: Reset daily and monthly quotas (to be called by cron job)
CREATE OR REPLACE FUNCTION reset_usage_quotas()
RETURNS void AS $$
BEGIN
  -- Reset daily quotas for free tier
  UPDATE public.users
  SET 
    daily_free_quota = 30,
    daily_basic_bonus = 40,
    last_daily_reset_at = NOW()
  WHERE membership_level IN ('free', 'basic')
    AND last_daily_reset_at < CURRENT_DATE;
  
  -- Reset monthly quotas for basic tier
  UPDATE public.users
  SET 
    monthly_basic_quota = 1500,
    last_monthly_reset_at = NOW()
  WHERE membership_level = 'basic'
    AND last_monthly_reset_at < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Create default folders for new users (can be triggered by app on first login)
-- This function can be called from the app after user registration

-- =====================================================
-- NOTES
-- =====================================================
-- 1. RLS is enabled on all tables to ensure users can only access their own data
-- 2. Triggers automatically handle:
--    - Updated timestamps
--    - Usage quota deductions
--    - Membership level updates based on subscriptions
-- 3. Run reset_usage_quotas() daily via Supabase Cron Job or Edge Function
-- 4. PayPal webhooks should update the subscriptions table
-- 5. All sensitive operations should be logged for audit purposes

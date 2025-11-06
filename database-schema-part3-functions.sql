-- =====================================================
-- InstaPlay V7 Database Schema - Part 3: Functions & Triggers
-- 觸發器和自動化函數
-- =====================================================
-- 注意: 請確保 Part 1 和 Part 2 已成功執行後再執行此文件
-- =====================================================

-- =====================================================
-- Function: Update updated_at timestamp
-- =====================================================
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

-- =====================================================
-- Function: Deduct usage quota when voice command is logged
-- =====================================================
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

-- =====================================================
-- Function: Update membership level when subscription changes
-- =====================================================
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

-- =====================================================
-- Function: Reset daily and monthly quotas
-- =====================================================
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
-- Function: Cleanup expired device verifications
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.user_devices
  WHERE verification_code_expires_at < NOW()
    AND verification_code IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: Auto-create user profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- NOTES AND SETUP INSTRUCTIONS
-- =====================================================
-- 
-- 1. 所有表格都啟用了 RLS（Row Level Security）
-- 2. 觸發器自動處理：
--    - 時間戳更新
--    - 使用配額扣除
--    - 會員等級更新
-- 3. 需要設置定時任務（Cron Job）來執行：
--    - reset_usage_quotas() - 每日執行
--    - cleanup_expired_verifications() - 每小時執行
-- 
-- 在 Supabase Dashboard > Database > Cron Jobs 中添加：
-- 
-- Daily quota reset (每天 00:00 UTC):
-- SELECT cron.schedule('reset-daily-quotas', '0 0 * * *', 'SELECT reset_usage_quotas()');
-- 
-- Hourly cleanup (每小時):
-- SELECT cron.schedule('cleanup-verifications', '0 * * * *', 'SELECT cleanup_expired_verifications()');
-- 
-- =====================================================
-- Part 3 完成
-- 資料庫架構部署完成！
-- =====================================================

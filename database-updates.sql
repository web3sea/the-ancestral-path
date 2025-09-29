-- Add missing fields to accounts table for Stripe integration and session refresh

-- Add Stripe-related fields
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Add session refresh tracking field
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS last_subscription_update TIMESTAMP WITH TIME ZONE;

-- Add free trial tracking field
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS free_trial_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS free_trial_used_date TIMESTAMP WITH TIME ZONE;

-- Add indexes for the new fields for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_customer_id ON accounts(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_subscription_id ON accounts(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_accounts_last_subscription_update ON accounts(last_subscription_update);
CREATE INDEX IF NOT EXISTS idx_accounts_free_trial_used ON accounts(free_trial_used);
CREATE INDEX IF NOT EXISTS idx_accounts_free_trial_used_date ON accounts(free_trial_used_date);

-- Update the subscription_tier constraint to allow NULL values (for users without subscriptions)
ALTER TABLE accounts 
DROP CONSTRAINT IF EXISTS accounts_subscription_tier_check;

ALTER TABLE accounts 
ADD CONSTRAINT accounts_subscription_tier_check 
CHECK (subscription_tier IS NULL OR subscription_tier IN ('free_trial', 'tier1', 'tier2'));

-- Update the subscription_status constraint to allow NULL values (for users without subscriptions)
ALTER TABLE accounts 
DROP CONSTRAINT IF EXISTS accounts_subscription_status_check;

ALTER TABLE accounts 
ADD CONSTRAINT accounts_subscription_status_check 
CHECK (subscription_status IS NULL OR subscription_status IN ('active', 'cancelled', 'paused', 'expired'));

-- Update default values to be NULL instead of 'tier1' and 'active'
ALTER TABLE accounts 
ALTER COLUMN subscription_tier DROP DEFAULT;

ALTER TABLE accounts 
ALTER COLUMN subscription_status DROP DEFAULT;

-- Add comments for documentation
COMMENT ON COLUMN accounts.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN accounts.stripe_subscription_id IS 'Stripe subscription ID for subscription management';
COMMENT ON COLUMN accounts.last_subscription_update IS 'Timestamp of last subscription update for session refresh tracking';

-- Update the create_user_account function to handle NULL subscription values
CREATE OR REPLACE FUNCTION create_user_account(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_phone VARCHAR(20) DEFAULT NULL,
    p_auth_provider VARCHAR(20) DEFAULT 'google',
    p_auth_provider_id VARCHAR(255) DEFAULT NULL,
    p_preferred_platform VARCHAR(20) DEFAULT 'web',
    p_subscription_tier VARCHAR(10) DEFAULT NULL,
    p_subscription_status VARCHAR(20) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    account_id UUID;
    role_id UUID;
BEGIN
    -- Get default user role
    SELECT id INTO role_id FROM user_roles WHERE name = 'user';
    
    -- Create account
    INSERT INTO accounts (
        name, email, phone, role_id, auth_provider, auth_provider_id, 
        preferred_platform, subscription_tier, subscription_status
    ) VALUES (
        p_name, p_email, p_phone, role_id, p_auth_provider, p_auth_provider_id, 
        p_preferred_platform, p_subscription_tier, p_subscription_status
    ) RETURNING id INTO account_id;
    
    -- Create default preferences
    INSERT INTO user_preferences (account_id) VALUES (account_id);
    
    RETURN account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the is_valid_subscription function to handle NULL values
CREATE OR REPLACE FUNCTION is_valid_subscription(p_email VARCHAR(255))
RETURNS BOOLEAN AS $$
DECLARE
    subscription_record RECORD;
BEGIN
    SELECT subscription_tier, subscription_status 
    INTO subscription_record
    FROM accounts 
    WHERE email = p_email 
    AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Return TRUE only if user has an active subscription (including free trial)
    RETURN (subscription_record.subscription_tier IN ('free_trial', 'tier1', 'tier2') 
            AND subscription_record.subscription_status = 'active');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to update subscription data with Stripe information
CREATE OR REPLACE FUNCTION update_subscription_data(
    p_account_id UUID,
    p_subscription_tier VARCHAR(10),
    p_subscription_status VARCHAR(20),
    p_stripe_customer_id VARCHAR(255) DEFAULT NULL,
    p_stripe_subscription_id VARCHAR(255) DEFAULT NULL,
    p_subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_subscription_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE accounts 
    SET 
        subscription_tier = p_subscription_tier,
        subscription_status = p_subscription_status,
        stripe_customer_id = p_stripe_customer_id,
        stripe_subscription_id = p_stripe_subscription_id,
        subscription_start_date = p_subscription_start_date,
        subscription_end_date = p_subscription_end_date,
        last_subscription_update = NOW(),
        updated_at = NOW()
    WHERE id = p_account_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to get subscription data for session refresh
CREATE OR REPLACE FUNCTION get_subscription_data_for_refresh(p_account_id UUID)
RETURNS TABLE(
    subscription_tier VARCHAR(10),
    subscription_status VARCHAR(20),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    last_subscription_update TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.subscription_tier,
        a.subscription_status,
        a.stripe_customer_id,
        a.stripe_subscription_id,
        a.last_subscription_update
    FROM accounts a
    WHERE a.id = p_account_id 
    AND a.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions for the new functions
GRANT EXECUTE ON FUNCTION update_subscription_data(UUID, VARCHAR(10), VARCHAR(20), VARCHAR(255), VARCHAR(255), TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_data_for_refresh(UUID) TO authenticated;

-- Update existing accounts that might have default values to NULL if they don't have real subscriptions
UPDATE accounts 
SET 
    subscription_tier = NULL,
    subscription_status = NULL
WHERE 
    subscription_tier = 'tier1' 
    AND subscription_status = 'active' 
    AND stripe_customer_id IS NULL 
    AND stripe_subscription_id IS NULL;

-- Add a trigger to automatically update last_subscription_update when subscription fields change
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if any subscription-related fields have changed
    IF (OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier) OR
       (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status) OR
       (OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id) OR
       (OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id) OR
       (OLD.subscription_start_date IS DISTINCT FROM NEW.subscription_start_date) OR
       (OLD.subscription_end_date IS DISTINCT FROM NEW.subscription_end_date) THEN
        
        NEW.last_subscription_update = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_subscription_timestamp ON accounts;
CREATE TRIGGER trigger_update_subscription_timestamp
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_timestamp();

-- Add function to check if user has used free trial
CREATE OR REPLACE FUNCTION has_used_free_trial(p_account_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    trial_used BOOLEAN;
BEGIN
    SELECT free_trial_used INTO trial_used
    FROM accounts 
    WHERE id = p_account_id 
    AND deleted_at IS NULL;
    
    RETURN COALESCE(trial_used, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to mark free trial as used
CREATE OR REPLACE FUNCTION mark_free_trial_used(p_account_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE accounts 
    SET 
        free_trial_used = TRUE,
        free_trial_used_date = NOW(),
        updated_at = NOW()
    WHERE id = p_account_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION has_used_free_trial(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_free_trial_used(UUID) TO authenticated;

-- Update subscription_history table to support free_trial tier
ALTER TABLE subscription_history 
DROP CONSTRAINT IF EXISTS subscription_history_tier_check;

ALTER TABLE subscription_history 
ADD CONSTRAINT subscription_history_tier_check 
CHECK (tier IN ('free_trial', 'tier1', 'tier2'));

-- Add comment for documentation
COMMENT ON COLUMN accounts.free_trial_used IS 'Tracks if user has used their free trial (one-time use only)';
COMMENT ON COLUMN accounts.free_trial_used_date IS 'Timestamp when user used their free trial';

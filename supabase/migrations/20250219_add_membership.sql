-- Add membership related fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'premium'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'past_due', 'canceled'));

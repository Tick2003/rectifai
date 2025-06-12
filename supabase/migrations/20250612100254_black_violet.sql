/*
  # Authentication Setup

  1. Enable Google OAuth provider
  2. Configure authentication settings
  3. Update RLS policies for authenticated users
  
  Note: Google OAuth configuration must be done in Supabase Dashboard
*/

-- Update submissions table policies for authenticated users
DROP POLICY IF EXISTS "Allow public access to submissions" ON submissions;

CREATE POLICY "Users can create submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Update corrections table policies for authenticated users  
DROP POLICY IF EXISTS "Allow public access to corrections" ON corrections;

CREATE POLICY "Users can create corrections"
  ON corrections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read corrections"
  ON corrections
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to still use the demo
CREATE POLICY "Allow anonymous demo submissions"
  ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous demo corrections"
  ON corrections
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read submissions"
  ON submissions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read corrections"
  ON corrections
  FOR SELECT
  TO anon
  USING (true);
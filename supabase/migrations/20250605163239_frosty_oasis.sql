/*
  # RectifAI Database Schema

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `input_type` (text, default 'text')
      - `input_content` (text)
      - `status` (text)
      - `created_at` (timestamp)
    - `corrections`
      - `id` (uuid, primary key)
      - `submission_id` (uuid, foreign key)
      - `corrected_content` (text)
      - `verified` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (temporary)
*/

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_type text DEFAULT 'text',
  input_content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create corrections table
CREATE TABLE IF NOT EXISTS corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  corrected_content text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;

-- Temporary policies for public access during development
CREATE POLICY "Allow public access to submissions"
  ON submissions
  FOR ALL
  TO public
  USING (true);

CREATE POLICY "Allow public access to corrections"
  ON corrections
  FOR ALL
  TO public
  USING (true);
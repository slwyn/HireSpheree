-- Migration: Add deleted_at field to applications table for soft delete functionality
-- Run this in your Supabase SQL Editor

-- Add deleted_at column to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Create an index for better query performance when filtering by deleted_at
CREATE INDEX IF NOT EXISTS idx_applications_deleted_at ON public.applications(deleted_at) 
WHERE deleted_at IS NULL;

  -- Optional: Add a comment to document the field
  COMMENT ON COLUMN public.applications.deleted_at IS 'Timestamp when the application was soft deleted. NULL means the application is active.';


-- Feedback table for storing feedback / suggestions from Contact page
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) inserts into feedback table so website form can save feedback
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'feedback'
      AND policyname = 'Allow anonymous insert feedback'
  ) THEN
    CREATE POLICY "Allow anonymous insert feedback"
      ON public.feedback
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

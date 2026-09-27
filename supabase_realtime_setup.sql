-- Enable Realtime for Supabase Tables
-- Run this SQL in your Supabase SQL Editor to enable real-time subscriptions

-- Enable Realtime for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Enable Realtime for jobs table (if you want real-time updates for job listings)
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Optional: Enable Realtime for users table (if needed)
-- ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- Verify realtime is enabled (this will show which tables have realtime enabled)
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- Note: By default, Supabase Realtime is enabled for INSERT, UPDATE, and DELETE operations
-- You can filter events in your client code if needed


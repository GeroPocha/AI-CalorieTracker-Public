
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhcuklaqzjfyuxqyseru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oY3VrbGFxempmeXV4cXlzZXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NjM5OTgsImV4cCI6MjA1NjQzOTk5OH0.BTYUWTW6lVzUyF0p8XSUeh95Z4eh0CISrZlvNg9zKU0';

export const supabase = createClient(supabaseUrl, supabaseKey);


-- Create a table to record storyboards/prompt generations for analytics
CREATE TABLE public.storyboard_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scenes_count INTEGER,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable row-level security
ALTER TABLE public.storyboard_analytics ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own analytics
CREATE POLICY "Users can read their own analytics"
  ON public.storyboard_analytics
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert analytics when they generate prompts
CREATE POLICY "Users can insert their own analytics"
  ON public.storyboard_analytics
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

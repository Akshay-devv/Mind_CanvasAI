
import { supabase } from "@/integrations/supabase/client";

/**
 * Save a storyboard analytics record for the current user.
 * @param prompt {string} - The story/script prompt that was generated.
 * @param scenesCount {number} - The number of scenes generated.
 */
export async function saveAnalytics(prompt: string, scenesCount: number) {
  // Don't save if user is not logged in
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  await supabase.from("storyboard_analytics").insert([
    {
      user_id: user.id,
      prompt,
      scenes_count: scenesCount,
    },
  ]);
}

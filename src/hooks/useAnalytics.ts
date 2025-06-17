
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAnalytics() {
  return useQuery({
    queryKey: ["storyboard_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storyboard_analytics")
        .select("*")
        .order("generated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

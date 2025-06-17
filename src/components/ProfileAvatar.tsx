
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ProfileAvatar = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }
    // Get avatar_url from profiles
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setAvatarUrl(data?.avatar_url || null));
  }, [user]);

  return (
    <Avatar>
      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
      <AvatarFallback>
        <User className="w-5 h-5 text-slate-500" />
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;

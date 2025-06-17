
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, Mail, Sparkles, ListOrdered, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, loading } = useAuth();
  const { data: analytics, isLoading } = useAnalytics();
  const navigate = useNavigate();

  // Profile data state (username, avatar)
  const [profile, setProfile] = useState<{ username?: string; avatar_url?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data || {});
        setProfileLoading(false);
      });
  }, [user]);

  if (loading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="animate-spin" size={24} /> Loading...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-blue-900 mb-2">Not signed in</div>
          <a href="/auth" className="text-blue-700 underline">Go to login</a>
        </div>
      </>
    );
  }

  // Stats calculation
  const totalPrompts = analytics?.length ?? 0;
  const totalScenes = analytics?.reduce((sum: number, r: any) => sum + (r.scenes_count || 0), 0) ?? 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 flex flex-col items-center bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-950">
        {/* Back Button */}
        <div className="absolute top-24 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="w-[95vw] max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/80 p-0 sm:p-2 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-800 animate-fade-in">
          <div className="flex flex-col items-center p-8 pt-12 gap-3">
            <div className="relative mb-3">
              <Avatar className="w-24 h-24 ring-4 ring-fuchsia-100 dark:ring-fuchsia-700/40 shadow-md">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-3xl">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-2 right-1 bg-white dark:bg-fuchsia-700 rounded-full px-2 py-0.5 shadow text-fuchsia-600 dark:text-white font-bold text-xs">
                User
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-xl font-bold text-blue-800 dark:text-fuchsia-200">
                <Mail size={18} />
                <span>{user.email || "(email missing)"}</span>
              </div>
              {profile?.username && (
                <div className="text-base text-fuchsia-800 dark:text-fuchsia-300 mt-1">
                  @{profile.username}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center bg-fuchsia-50/80 dark:bg-fuchsia-950 px-3 py-1.5 rounded-full shadow text-fuchsia-700 dark:text-fuchsia-200 text-sm font-semibold gap-2 border border-fuchsia-200 dark:border-fuchsia-700">
                <Sparkles size={16} />
                Prompts: <span className="font-bold">{totalPrompts}</span>
              </div>
              <div className="flex items-center bg-blue-50/80 dark:bg-blue-900 px-3 py-1.5 rounded-full shadow text-blue-700 dark:text-blue-200 text-sm font-semibold gap-2 border border-blue-200 dark:border-blue-700">
                <ListOrdered size={16} />
                Scenes: <span className="font-bold">{totalScenes}</span>
              </div>
            </div>
          </div>
          <hr className="border-t border-blue-100 dark:border-slate-800 mx-6" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-fuchsia-500" />
              <h2 className="text-lg font-bold text-blue-800 dark:text-fuchsia-200">
                Storyboard Generation Analytics
              </h2>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 py-4">
                <Loader className="animate-spin" size={18} />
                Loading analytics...
              </div>
            )}
            {!isLoading && analytics && analytics.length === 0 && (
              <div className="text-slate-400 py-6 text-center">No prompts or storyboards generated yet.</div>
            )}
            {!isLoading && analytics && analytics.length > 0 && (
              <div className="max-h-64 overflow-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-fuchsia-200">
                      <th className="p-2 text-left">Prompt</th>
                      <th className="p-2 text-center">Scenes</th>
                      <th className="p-2 text-center">Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((row: any) => (
                      <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-fuchsia-950/60 transition">
                        <td className="p-2 break-all max-w-xs">
                          <span title={row.prompt}>{row.prompt.slice(0, 64)}{row.prompt.length > 64 ? "…" : ""}</span>
                        </td>
                        <td className="p-2 text-center">{row.scenes_count || "-"}</td>
                        <td className="p-2 text-center whitespace-nowrap">{new Date(row.generated_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

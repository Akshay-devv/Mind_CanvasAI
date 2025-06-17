import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, UserPlus, Github, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) setError(error.message);
    } else {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  const signInWithProvider = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 to-blue-100">
      <div className="bg-white/90 px-8 py-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-200">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-800">
          {isLogin ? "Log in to MindCanvas" : "Create an account"}
        </h1>
        <p className="text-center text-blue-500 mb-6">
          {isLogin
            ? "Welcome back! Sign in with email."
            : "Sign up with your email account."}
        </p>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="font-medium text-sm text-blue-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="font-medium text-sm text-blue-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              name="password"
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 font-medium">{error}</div>}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {isLogin ? <LogIn className="mr-2"/> : <UserPlus className="mr-2"/>}
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-700 font-semibold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            type="button"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

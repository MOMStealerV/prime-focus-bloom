import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  school: string | null;
  grade: string | null;
  country: string | null;
  time_zone: string | null;
  created_at: string;
};

const ONBOARDING_KEY = "primeflow-onboarding";

export type OnboardingChoice = "guest" | "account" | null;

export function readOnboarding(): OnboardingChoice {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ONBOARDING_KEY);
  return value === "guest" || value === "account" ? value : null;
}

export function setOnboarding(choice: Exclude<OnboardingChoice, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_KEY, choice);
}

type AuthValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isGuest: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      void loadProfile(next?.user?.id);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      void loadProfile(data.session?.user?.id).finally(() => setLoading(false));
      if (!data.session) setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isGuest: !session,
      refreshProfile: () => loadProfile(session?.user?.id),
      updateProfile: async (patch) => {
        if (!session?.user) return { error: "You need an account to save your profile." };
        const { error } = await supabase
          .from("profiles")
          .upsert({ id: session.user.id, ...patch })
          .eq("id", session.user.id);
        if (error) return { error: error.message };
        await loadProfile(session.user.id);
        return { error: null };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
    }),
    [loading, session, profile, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function displayName(profile: Profile | null, user: User | null) {
  return (
    profile?.full_name ??
    profile?.username ??
    (user?.email ? user.email.split("@")[0] : null) ??
    "Guest"
  );
}

export function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "G";
}

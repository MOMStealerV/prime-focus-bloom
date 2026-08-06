import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { supabase } from "@/integrations/supabase/client";

type AuthorizationDetails = {
  client?: { name?: string; client_name?: string; redirect_uri?: string } | null;
  scope?: string | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthResult = { data: AuthorizationDetails | null; error: { message: string } | null };

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauthApi(): OAuthNamespace {
  return (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { next: location.pathname + location.searchStr },
      });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  errorComponent: ({ error }) => (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-5">
      <GlassCard strong className="space-y-2">
        <h1 className="text-lg font-semibold">Authorization request failed</h1>
        <p className="text-sm opacity-70">{String((error as Error)?.message ?? error)}</p>
      </GlassCard>
    </main>
  ),
  component: Consent,
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? details?.client?.client_name ?? "this app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <GlassCard strong className="space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Connect {clientName} to PrimeFlow
          </h1>
          <p className="text-sm opacity-70">
            {clientName} will be able to call PrimeFlow&apos;s tools while you are signed in.
          </p>
        </div>

        {details?.client?.redirect_uri && (
          <p className="break-all text-xs opacity-60">
            Redirects to {details.client.redirect_uri}
          </p>
        )}
        {details?.scope && (
          <p className="text-xs opacity-60">Requested access: {details.scope}</p>
        )}
        <p className="text-xs opacity-60">
          This does not bypass PrimeFlow&apos;s permissions or backend policies.
        </p>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void decide(true)}
            className="flex-1 rounded-2xl bg-[var(--accent,#6366f1)] px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void decide(false)}
            className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium disabled:opacity-50"
          >
            Cancel connection
          </button>
        </div>
      </GlassCard>
    </main>
  );
}
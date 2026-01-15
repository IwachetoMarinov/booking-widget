import axios from "axios";
import { IssueTokenResponse, TokenState } from "@/src/app/types";

const apiUrl = process.env.MINDBODY_API_URL;
const apiKey = process.env.MINDBODY_API_KEY;
const siteId = process.env.MINDBODY_SITE_ID;
const username = process.env.MINDBODY_USERNAME;
const password = process.env.MINDBODY_PASSWORD;

/**
 * Adjust these field names if your Mindbody response differs.
 * Commonly you’ll see AccessToken + ExpiresIn (seconds).
 */

let cached: TokenState | null = null;

// Refresh a bit early to avoid edge failures
const SKEW_MS = 60_000; // 60s

function mustHaveEnv() {
  if (!apiUrl || !apiKey || !siteId || !username || !password)
    throw new Error("Missing MINDBODY env vars");
}

function pickAccessToken(r: IssueTokenResponse): string | null {
  return r.AccessToken || r.access_token || null;
}

function pickRefreshToken(r: IssueTokenResponse): string | undefined {
  return r.RefreshToken || r.refresh_token || undefined;
}

function pickExpiresInSeconds(r: IssueTokenResponse): number {
  return r.ExpiresIn ?? r.expires_in ?? 3600;
}

function isExpiringSoon(state: TokenState) {
  return Date.now() >= state.expiresAt - SKEW_MS;
}

function headers() {
  return {
    "Api-Key": apiKey!,
    SiteId: siteId!,
    "Content-Type": "application/json",
  };
}

async function issueToken(): Promise<TokenState> {
  mustHaveEnv();

  const res = await axios.post<IssueTokenResponse>(
    `${apiUrl!}/usertoken/issue`,
    { Username: username, Password: password },
    { headers: headers() }
  );

  const accessToken = pickAccessToken(res.data);
  if (!accessToken)
    throw new Error("Mindbody token response missing access token");

  const expiresIn = pickExpiresInSeconds(res.data);
  const refreshToken = pickRefreshToken(res.data);

  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

/**
 * Try to refresh if endpoint exists; otherwise fallback to issueToken().
 * Some Mindbody setups don’t return refresh token / don’t support refresh on Public API.
 */
async function refreshToken(state: TokenState): Promise<TokenState> {
  mustHaveEnv();

  // If we don’t have refresh token, re-issue.
  if (!state.refreshToken) return issueToken();

  try {
    const res = await axios.post<IssueTokenResponse>(
      `${apiUrl!}/usertoken/refresh`,
      { RefreshToken: state.refreshToken },
      { headers: headers() }
    );

    const accessToken = pickAccessToken(res.data);
    if (!accessToken)
      throw new Error("Mindbody refresh response missing access token");

    const expiresIn = pickExpiresInSeconds(res.data);
    const newRefreshToken = pickRefreshToken(res.data) ?? state.refreshToken;

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };
  } catch (e) {
    // If refresh endpoint isn’t enabled or returns 404/DeniedAccess/etc → re-issue.
    return issueToken();
  }
}

/**
 * Public function you call before making Mindbody API requests.
 * Returns a valid access token and caches it.
 */
export async function getMindbodyAccessToken(): Promise<string> {
  mustHaveEnv();

  if (!cached) {
    cached = await issueToken();
    return cached.accessToken;
  }

  if (isExpiringSoon(cached)) {
    cached = await refreshToken(cached);
  }

  return cached.accessToken;
}

/**
 * Helper: make an axios client already configured with auth header.
 * Usage: const client = await getMindbodyClient(); client.get("/client/...");
 */
export async function getMindbodyClient() {
  mustHaveEnv();
  const token = await getMindbodyAccessToken();

  console.log("getMindbodyClient with token:", token);

  return axios.create({
    baseURL: apiUrl!,
    headers: {
      "Api-Key": apiKey!,
      SiteId: siteId!,
      authorization: token,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Optional: force reset cache (useful in debugging)
 */
export function clearMindbodyAuthCache() {
  cached = null;
}

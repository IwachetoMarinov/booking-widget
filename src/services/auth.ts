import axios from "axios";
import { IssueTokenResponse, TokenState } from "@/src/app/types";

const apiUrl = process.env.MINDBODY_API_URL;
const apiKey = process.env.MINDBODY_API_KEY;
const defaultSiteId = process.env.MINDBODY_SITE_ID;
const username = process.env.MINDBODY_USERNAME;
const password = process.env.MINDBODY_PASSWORD;

const SKEW_MS = 60_000;

// Cache per siteId
const cacheBySite = new Map<number, TokenState>();

function mustHaveEnv() {
  if (!apiUrl || !apiKey || !defaultSiteId || !username || !password) {
    throw new Error("Missing MINDBODY env vars");
  }
}

function pickAccessToken(r: IssueTokenResponse): string | null {
  return r.AccessToken || (r as any).access_token || null;
}

function pickExpiresInSeconds(r: IssueTokenResponse): number {
  return (r as any).ExpiresIn ?? (r as any).expires_in ?? 3600;
}

function isExpiringSoon(state: TokenState) {
  return Date.now() >= state.expiresAt - SKEW_MS;
}

function headers(siteIdParam: number) {
  return {
    "Api-Key": apiKey!,
    SiteId: String(siteIdParam),
    "Content-Type": "application/json",
  };
}

async function issueToken(siteIdParam: number): Promise<TokenState> {
  mustHaveEnv();

  const res = await axios.post<IssueTokenResponse>(
    `${apiUrl!}/usertoken/issue`,
    { Username: username, Password: password },
    { headers: headers(siteIdParam) }
  );

  const accessToken = pickAccessToken(res.data);
  if (!accessToken)
    throw new Error("Mindbody token response missing access token");

  const expiresIn = pickExpiresInSeconds(res.data);

  return {
    accessToken,
    // ignore refresh token on purpose
    refreshToken: undefined,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

export async function getMindbodyAccessToken(
  siteIdParam: number
): Promise<string> {
  mustHaveEnv();

  const existing = cacheBySite.get(siteIdParam);
  if (!existing || isExpiringSoon(existing)) {
    const next = await issueToken(siteIdParam);
    cacheBySite.set(siteIdParam, next);
    return next.accessToken;
  }

  return existing.accessToken;
}

export async function getMindbodyClient(
  siteIdParam: number = Number(defaultSiteId)
) {
  mustHaveEnv();

  const token = await getMindbodyAccessToken(siteIdParam);

  // console.log("Mindbody client token for SiteId", siteIdParam, ":", token);

  return axios.create({
    baseURL: apiUrl!,
    headers: {
      "Api-Key": apiKey!,
      SiteId: String(siteIdParam), // IMPORTANT
      authorization: token,
      "Content-Type": "application/json",
    },
  });
}

export function clearMindbodyAuthCache(siteIdParam?: number) {
  if (typeof siteIdParam === "number") cacheBySite.delete(siteIdParam);
  else cacheBySite.clear();
}

import snapshotRaw from "@/data/open-source.snapshot.json";

export const OSS_EXCLUDE_OWNERS = ["shayann07", "webscarepk", "SumaibH"] as const;

export type OpenSourceCard = {
  repo: string;
  repoUrl: string;
  stars: number;
  number: number;
  title: string;
  url: string;
  mergedAt: string;
};

export type OpenSourceData = {
  cards: OpenSourceCard[];
  mergedCount: number;
  inReviewCount: number | null;
  fetchedAt: string | null;
  isLive: boolean;
};

export type GraphQLPullRequestNode = {
  number: number;
  title: string;
  url: string;
  mergedAt: string;
  repository: {
    nameWithOwner: string;
    url: string;
    stargazerCount: number;
    owner?: {
      login: string;
    };
  };
};

export type GraphQLSearchResponse = {
  data?: {
    merged?: {
      issueCount: number;
      nodes?: Array<GraphQLPullRequestNode | null | undefined>;
    };
    inReview?: {
      issueCount: number;
    };
  };
  errors?: Array<{ message: string }>;
};

/** Formats ISO date to human relative string e.g. "Updated 12 min ago" */
export function formatUpdatedAgo(isoDate: string, now: Date = new Date()): string {
  const diffSec = Math.max(0, Math.floor((now.getTime() - new Date(isoDate).getTime()) / 1000));
  if (diffSec < 60) return "Updated just now";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days} d ago`;
}

/** Formats ISO merged date e.g. "Oct 2, 2026" */
export function formatMergedDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return isoDate;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return isoDate;
  }
}

/** Formats star count e.g. 47000 -> "47K", 6500 -> "6.5K" */
export function formatStarCount(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return String(stars);
}

/** Pure mapping from GraphQL response to top ranked OpenSourceCards */
export function mapGraphQLResponseToCards(
  response: unknown,
  excludeOwners: readonly string[] = OSS_EXCLUDE_OWNERS,
  limit = 6,
): { cards: OpenSourceCard[]; mergedCount: number; inReviewCount: number } {
  const resp = response as GraphQLSearchResponse | null | undefined;
  if (!resp?.data?.merged) {
    return { cards: [], mergedCount: 0, inReviewCount: 0 };
  }

  const nodes = resp.data.merged.nodes || [];
  const validCards: OpenSourceCard[] = [];

  for (const node of nodes) {
    if (!node || !node.repository) continue;
    const owner = node.repository.owner?.login || node.repository.nameWithOwner.split("/")[0] || "";
    if (excludeOwners.includes(owner)) continue;

    validCards.push({
      repo: node.repository.nameWithOwner,
      repoUrl: node.repository.url,
      stars: Number(node.repository.stargazerCount) || 0,
      number: node.number,
      title: (node.title || "").trim(),
      url: node.url,
      mergedAt: node.mergedAt,
    });
  }

  // Rank by stars descending, then mergedAt descending
  validCards.sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime();
  });

  return {
    cards: validCards.slice(0, limit),
    mergedCount: resp.data.merged.issueCount ?? validCards.length,
    inReviewCount: resp.data.inReview?.issueCount ?? 0,
  };
}

/** Returns fallback snapshot data */
export function getSnapshotData(): OpenSourceData {
  return {
    cards: (snapshotRaw.cards || []).map((c) => ({
      repo: c.repo,
      repoUrl: c.repoUrl,
      stars: c.stars,
      number: c.number,
      title: c.title.trim(),
      url: c.url,
      mergedAt: c.mergedAt,
    })),
    mergedCount: snapshotRaw.mergedCount ?? snapshotRaw.cards.length,
    inReviewCount: null,
    fetchedAt: null,
    isLive: false,
  };
}

// In-memory cache with 1-hour TTL
let memoryCache: {
  data: OpenSourceData;
  expiresAt: number;
} | null = null;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Resets cache (useful for unit testing) */
export function resetOpenSourceCache(): void {
  memoryCache = null;
}

/** Fetches Open Source data with GitHub GraphQL, caching, and graceful snapshot fallback */
export async function getOpenSourceData(customFetch = fetch): Promise<OpenSourceData> {
  const now = Date.now();
  if (memoryCache && now < memoryCache.expiresAt) {
    return memoryCache.data;
  }

  const forceFallback =
    typeof process !== "undefined" && process.env?.OSS_FORCE_FALLBACK?.trim() === "true";

  const token =
    (typeof process !== "undefined" && process.env?.GITHUB_TOKEN) ||
    ((globalThis as unknown as { env?: { GITHUB_TOKEN?: string } }).env?.GITHUB_TOKEN ?? "");

  if (!token || forceFallback) {
    const fallback = memoryCache?.data ?? getSnapshotData();
    return fallback;
  }

  const author = (typeof process !== "undefined" && process.env?.OSS_AUTHOR) || "shayann07";

  const excludeQuery = OSS_EXCLUDE_OWNERS.map((o) => `-user:${o}`).join(" ");
  const mergedQuery = `is:pr is:merged author:${author} ${excludeQuery} sort:updated-desc`;
  const openQuery = `is:pr is:open author:${author} ${excludeQuery}`;

  const query = `
    query OpenSourceSearch($mergedQuery: String!, $openQuery: String!) {
      merged: search(type: ISSUE, first: 30, query: $mergedQuery) {
        issueCount
        nodes {
          ... on PullRequest {
            number
            title
            url
            mergedAt
            repository {
              nameWithOwner
              url
              stargazerCount
              owner {
                login
              }
            }
          }
        }
      }
      inReview: search(type: ISSUE, first: 1, query: $openQuery) {
        issueCount
      }
    }
  `;

  try {
    const res = await customFetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
        "User-Agent": "shayxo-portfolio",
      },
      body: JSON.stringify({
        query,
        variables: { mergedQuery, openQuery },
      }),
    });

    if (!res.ok) {
      console.warn(`GitHub GraphQL returned status ${res.status}`);
      return memoryCache?.data ?? getSnapshotData();
    }

    const payload = (await res.json()) as GraphQLSearchResponse;
    if (payload.errors && payload.errors.length > 0) {
      console.warn("GitHub GraphQL returned errors:", payload.errors[0]?.message);
      return memoryCache?.data ?? getSnapshotData();
    }

    const { cards, mergedCount, inReviewCount } = mapGraphQLResponseToCards(payload);
    if (cards.length === 0) {
      return memoryCache?.data ?? getSnapshotData();
    }

    const liveData: OpenSourceData = {
      cards,
      mergedCount,
      inReviewCount,
      fetchedAt: new Date().toISOString(),
      isLive: true,
    };

    memoryCache = {
      data: liveData,
      expiresAt: now + CACHE_TTL_MS,
    };

    return liveData;
  } catch (err) {
    console.warn("Failed to fetch live open source data:", err);
    return memoryCache?.data ?? getSnapshotData();
  }
}

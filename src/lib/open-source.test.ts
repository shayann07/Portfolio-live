import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mapGraphQLResponseToCards,
  formatUpdatedAgo,
  formatMergedDate,
  formatStarCount,
  getSnapshotData,
  getOpenSourceData,
  resetOpenSourceCache,
  OSS_EXCLUDE_OWNERS,
} from "./open-source";

describe("open-source lib", () => {
  beforeEach(() => {
    resetOpenSourceCache();
    vi.restoreAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  describe("formatUpdatedAgo", () => {
    it("handles less than 60 seconds", () => {
      const now = new Date("2026-10-10T12:00:30Z");
      expect(formatUpdatedAgo("2026-10-10T12:00:00Z", now)).toBe("Updated just now");
    });

    it("handles minutes ago", () => {
      const now = new Date("2026-10-10T12:12:00Z");
      expect(formatUpdatedAgo("2026-10-10T12:00:00Z", now)).toBe("Updated 12 min ago");
    });

    it("handles hours ago", () => {
      const now = new Date("2026-10-10T15:00:00Z");
      expect(formatUpdatedAgo("2026-10-10T12:00:00Z", now)).toBe("Updated 3 hr ago");
    });

    it("handles days ago", () => {
      const now = new Date("2026-10-12T12:00:00Z");
      expect(formatUpdatedAgo("2026-10-10T12:00:00Z", now)).toBe("Updated 2 d ago");
    });
  });

  describe("formatMergedDate", () => {
    it("formats ISO date string into readable US date", () => {
      expect(formatMergedDate("2026-10-02T12:00:00Z")).toBe("Oct 2, 2026");
    });
  });

  describe("formatStarCount", () => {
    it("formats thousands with K suffix", () => {
      expect(formatStarCount(47000)).toBe("47K");
      expect(formatStarCount(6500)).toBe("6.5K");
      expect(formatStarCount(2600)).toBe("2.6K");
    });

    it("formats small numbers as plain string", () => {
      expect(formatStarCount(450)).toBe("450");
    });
  });

  describe("mapGraphQLResponseToCards", () => {
    const mockGraphQLResponse = {
      data: {
        merged: {
          issueCount: 5,
          nodes: [
            {
              number: 101,
              title: "  Fix memory leak in parser  ",
              url: "https://github.com/popular/repo/pull/101",
              mergedAt: "2026-09-01T00:00:00Z",
              repository: {
                nameWithOwner: "popular/repo",
                url: "https://github.com/popular/repo",
                stargazerCount: 15000,
                owner: { login: "popular" },
              },
            },
            {
              number: 202,
              title: "Excluded personal repo PR",
              url: "https://github.com/shayann07/private-repo/pull/202",
              mergedAt: "2026-10-01T00:00:00Z",
              repository: {
                nameWithOwner: "shayann07/private-repo",
                url: "https://github.com/shayann07/private-repo",
                stargazerCount: 50000,
                owner: { login: "shayann07" },
              },
            },
            {
              number: 303,
              title: "Excluded company repo PR",
              url: "https://github.com/webscarepk/client-app/pull/303",
              mergedAt: "2026-10-02T00:00:00Z",
              repository: {
                nameWithOwner: "webscarepk/client-app",
                url: "https://github.com/webscarepk/client-app",
                stargazerCount: 40000,
                owner: { login: "webscarepk" },
              },
            },
            {
              number: 404,
              title: "Add Compose feature",
              url: "https://github.com/acme/compose-kit/pull/404",
              mergedAt: "2026-08-01T00:00:00Z",
              repository: {
                nameWithOwner: "acme/compose-kit",
                url: "https://github.com/acme/compose-kit",
                stargazerCount: 8000,
                owner: { login: "acme" },
              },
            },
            {
              number: 505,
              title: "Top starred repo contribution",
              url: "https://github.com/huge/framework/pull/505",
              mergedAt: "2026-07-01T00:00:00Z",
              repository: {
                nameWithOwner: "huge/framework",
                url: "https://github.com/huge/framework",
                stargazerCount: 90000,
                owner: { login: "huge" },
              },
            },
          ],
        },
        inReview: {
          issueCount: 14,
        },
      },
    };

    it("filters out excluded owners", () => {
      const result = mapGraphQLResponseToCards(mockGraphQLResponse, OSS_EXCLUDE_OWNERS);
      const repos = result.cards.map((c) => c.repo);
      expect(repos).not.toContain("shayann07/private-repo");
      expect(repos).not.toContain("webscarepk/client-app");
    });

    it("ranks by stars descending", () => {
      const result = mapGraphQLResponseToCards(mockGraphQLResponse);
      expect(result.cards[0].repo).toBe("huge/framework");
      expect(result.cards[1].repo).toBe("popular/repo");
      expect(result.cards[2].repo).toBe("acme/compose-kit");
    });

    it("trims PR title", () => {
      const result = mapGraphQLResponseToCards(mockGraphQLResponse);
      const pr101 = result.cards.find((c) => c.number === 101);
      expect(pr101?.title).toBe("Fix memory leak in parser");
    });

    it("respects the top-N limit", () => {
      const result = mapGraphQLResponseToCards(mockGraphQLResponse, OSS_EXCLUDE_OWNERS, 2);
      expect(result.cards).toHaveLength(2);
    });
  });

  describe("getSnapshotData", () => {
    it("returns verified snapshot data with 4 merged PRs", () => {
      const snapshot = getSnapshotData();
      expect(snapshot.isLive).toBe(false);
      expect(snapshot.fetchedAt).toBeNull();
      expect(snapshot.inReviewCount).toBeNull();
      expect(snapshot.cards).toHaveLength(4);
      expect(snapshot.cards.map((c) => c.repo)).toEqual([
        "lysine-dev/okhttp",
        "arrow-kt/arrow",
        "chrisbanes/haze",
        "cashapp/molecule",
      ]);
    });
  });

  describe("getOpenSourceData fallback paths", () => {
    it("falls back to snapshot when no GITHUB_TOKEN is set", async () => {
      delete process.env.GITHUB_TOKEN;
      const data = await getOpenSourceData();
      expect(data.isLive).toBe(false);
      expect(data.cards).toHaveLength(4);
      expect(data.inReviewCount).toBeNull();
    });

    it("falls back to snapshot when fetch rejects (network error)", async () => {
      process.env.GITHUB_TOKEN = "test-token";
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network offline"));
      const data = await getOpenSourceData(mockFetch as unknown as typeof fetch);
      expect(data.isLive).toBe(false);
      expect(data.cards).toHaveLength(4);
    });

    it("falls back to snapshot when response is 401 or 500", async () => {
      process.env.GITHUB_TOKEN = "bad-token";
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });
      const data = await getOpenSourceData(mockFetch as unknown as typeof fetch);
      expect(data.isLive).toBe(false);
      expect(data.cards).toHaveLength(4);
    });

    it("falls back to snapshot when GraphQL returns errors", async () => {
      process.env.GITHUB_TOKEN = "test-token";
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          errors: [{ message: "API rate limit exceeded" }],
        }),
      });
      const data = await getOpenSourceData(mockFetch as unknown as typeof fetch);
      expect(data.isLive).toBe(false);
      expect(data.cards).toHaveLength(4);
    });

    it("returns live data and caches when fetch succeeds", async () => {
      process.env.GITHUB_TOKEN = "valid-token";
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            merged: {
              issueCount: 1,
              nodes: [
                {
                  number: 10,
                  title: "Add KMP support",
                  url: "https://github.com/sample/lib/pull/10",
                  mergedAt: "2026-10-09T00:00:00Z",
                  repository: {
                    nameWithOwner: "sample/lib",
                    url: "https://github.com/sample/lib",
                    stargazerCount: 1200,
                    owner: { login: "sample" },
                  },
                },
              ],
            },
            inReview: {
              issueCount: 5,
            },
          },
        }),
      });

      const data = await getOpenSourceData(mockFetch as unknown as typeof fetch);
      expect(data.isLive).toBe(true);
      expect(data.cards).toHaveLength(1);
      expect(data.inReviewCount).toBe(5);
      expect(data.fetchedAt).toBeTruthy();

      // Second call uses cache without calling fetch again
      const cached = await getOpenSourceData(mockFetch as unknown as typeof fetch);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cached).toBe(data);
    });
  });
});

import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { getOpenSourceData, type OpenSourceData } from "@/lib/open-source";

export const getOpenSourceContributions = createServerFn({ method: "GET" }).handler(
  async (): Promise<OpenSourceData> => {
    try {
      setResponseHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    } catch {
      // Context might not allow setting headers (e.g. non-HTTP execution)
    }
    return await getOpenSourceData();
  },
);

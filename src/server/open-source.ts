import { createServerFn } from "@tanstack/react-start";
import { getOpenSourceData, type OpenSourceData } from "@/lib/open-source";

export const getOpenSourceContributions = createServerFn({ method: "GET" }).handler(
  async (): Promise<OpenSourceData> => {
    return await getOpenSourceData();
  },
);

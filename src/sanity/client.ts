import "server-only";

import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

const clientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
} as const;

/**
 * Public read client for server components, route handlers, and scripts. Uses CDN in production.
 */
export const client: SanityClient = createClient({
  ...clientConfig,
  perspective: "published",
});

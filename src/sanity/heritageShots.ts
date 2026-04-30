import { client } from "@/sanity/client";
import { heritageShotsQuery } from "@/sanity/queries";
import type { HeritageShot } from "@/sanity/types";

export async function fetchHeritageShots(): Promise<HeritageShot[]> {
  const rows = await client.fetch<HeritageShot[]>(
    heritageShotsQuery,
    {},
    { next: { revalidate: 300 } }
  );
  return rows ?? [];
}

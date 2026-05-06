export function isGarageSaleLive(): boolean {
  return (
    process.env.NEXT_PUBLIC_GARAGE_SALE_LIVE === "true" ||
    process.env.NEXT_PUBLIC_GARAGE_SALE_LIVE === "1"
  );
}

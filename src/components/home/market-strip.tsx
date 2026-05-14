import { getMarketSnapshot } from "@/lib/market";

export async function MarketStrip() {
  const snapshot = await getMarketSnapshot();

  if (snapshot.items.length === 0) {
    return (
      <span className="hidden text-[10px] uppercase tracking-[0.08em] text-[#6f7d89] lg:block">
        Mercados no disponibles
      </span>
    );
  }

  return (
    <div className="hidden items-center gap-5 lg:flex">
      {snapshot.items.map((item) => (
        <span key={item.symbol} className="text-[#d8dee4]">
          <span className="mr-1 font-semibold">{item.label}</span>
          <span className="mr-2 text-[#93a0ac]">{item.price}</span>
          <span className={item.direction === "down" ? "text-[#ff7b7b]" : "text-[#8ee81c]"}>
            {item.changePercent}
          </span>
        </span>
      ))}
      <span className="text-[10px] uppercase tracking-[0.08em] text-[#6f7d89]">
        {snapshot.status === "partial" ? "datos parciales" : "actualizado"} {snapshot.updatedAt ?? ""}
      </span>
    </div>
  );
}

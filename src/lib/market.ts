type MarketDirection = "up" | "down" | "flat";

export type MarketItem = {
  symbol: string;
  label: string;
  price: string;
  changePercent: string;
  direction: MarketDirection;
};

export type MarketSnapshot = {
  items: MarketItem[];
  updatedAt: string | null;
  status: "live" | "partial" | "unavailable";
};

type StooqQuote = {
  symbol: string;
  open: number;
  close: number;
};

const STOCK_SYMBOLS = ["AAPL", "NVDA", "RKLB"] as const;
const ALL_SYMBOLS = [...STOCK_SYMBOLS, "BTC"] as const;

const LABELS: Record<(typeof ALL_SYMBOLS)[number], string> = {
  AAPL: "AAPL",
  NVDA: "NVDA",
  RKLB: "RKLB",
  BTC: "BTC"
};

function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatPrice(symbol: (typeof ALL_SYMBOLS)[number], price?: number) {
  if (!isFiniteNumber(price)) {
    return "n/d";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: symbol === "BTC" ? 0 : 2
  }).format(price);
}

function formatChange(change?: number) {
  if (!isFiniteNumber(change)) {
    return "n/d";
  }

  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

function getDirection(change?: number): MarketDirection {
  if (!isFiniteNumber(change)) {
    return "flat";
  }

  if (change > 0) {
    return "up";
  }

  if (change < 0) {
    return "down";
  }

  return "flat";
}

function parseStooqQuote(text: string): StooqQuote | null {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const dataLine = lines.length > 1 ? lines[1] : lines[0];

  if (dataLine.toLowerCase().startsWith("symbol,")) {
    return null;
  }

  const [symbol, , , open, , , close] = dataLine.split(",");
  const parsedOpen = Number(open);
  const parsedClose = Number(close);

  if (!symbol || !Number.isFinite(parsedOpen) || !Number.isFinite(parsedClose)) {
    return null;
  }

  return {
    symbol,
    open: parsedOpen,
    close: parsedClose
  };
}

async function getStooqQuote(symbol: (typeof STOCK_SYMBOLS)[number]) {
  const response = await fetch(`https://stooq.com/q/l/?s=${symbol.toLowerCase()}.us&f=sd2t2ohlcvn&h&e=csv`, {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Stooq request failed with ${response.status}`);
  }

  return parseStooqQuote(await response.text());
}

async function getBitcoinQuote() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    bitcoin?: { usd?: number; usd_24h_change?: number };
  };

  return {
    usd: data.bitcoin?.usd,
    change: data.bitcoin?.usd_24h_change
  };
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const stockResults = await Promise.allSettled(STOCK_SYMBOLS.map((symbol) => getStooqQuote(symbol)));
  const bitcoinResult = await Promise.allSettled([getBitcoinQuote()]);

  const items: MarketItem[] = [];
  let resolvedCount = 0;

  stockResults.forEach((result, index) => {
    if (result.status !== "fulfilled" || !result.value) {
      return;
    }

    const quote = result.value;
    const symbol = STOCK_SYMBOLS[index];
    const change = quote.open !== 0 ? ((quote.close - quote.open) / quote.open) * 100 : undefined;

    items.push({
      symbol,
      label: LABELS[symbol],
      price: formatPrice(symbol, quote.close),
      changePercent: formatChange(change),
      direction: getDirection(change)
    });
    resolvedCount += 1;
  });

  const bitcoin = bitcoinResult[0];
  if (bitcoin.status === "fulfilled" && (isFiniteNumber(bitcoin.value.usd) || isFiniteNumber(bitcoin.value.change))) {
    items.push({
      symbol: "BTC",
      label: LABELS.BTC,
      price: formatPrice("BTC", bitcoin.value.usd),
      changePercent: formatChange(bitcoin.value.change),
      direction: getDirection(bitcoin.value.change)
    });
    resolvedCount += 1;
  }

  if (items.length === 0) {
    return {
      items: [],
      updatedAt: null,
      status: "unavailable"
    };
  }

  return {
    items,
    updatedAt: new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid"
    }).format(new Date()),
    status: resolvedCount === ALL_SYMBOLS.length ? "live" : "partial"
  };
}

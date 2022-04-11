const tickersHandlers = new Map();

export async function fetchTickers() {
  if (tickersHandlers.size === 0) {
    return
  }
  const API_KEY = '39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9';
  const _URL = new URL('https://min-api.cryptocompare.com/data/pricemulti');
  if (tickersHandlers.size === 0) {
    return;
  }
  const TICKERS = [...tickersHandlers.keys()].join(',');
  const CURRENCY = 'USD'
  _URL.searchParams.set('fsyms', TICKERS);
  _URL.searchParams.set('tsyms', CURRENCY);
  _URL.searchParams.set('api_key', API_KEY);

  return fetch(decodeURIComponent(_URL.href)).then(r => r.json()).then(d => {
    const updatedPrices = Object.fromEntries(
      Object.entries(d).map(([key, value]) => {
        return [key, value = value[CURRENCY]]
      })
    )
    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handlers = tickersHandlers.get(currency) ?? [];
      handlers.forEach(fn => fn(newPrice))
    })
  })
}

export function subscribeToTicker(tickerName, cb) {
  const subscribers = tickersHandlers.get(tickerName) || [];
  tickersHandlers.set(tickerName, [...subscribers, cb])
}

export function unsubscribe(tickerName) {
 tickersHandlers.delete(tickerName)
}

setInterval(fetchTickers, 2000)
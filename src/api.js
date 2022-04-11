const tickersHandlers = new Map();

export async function fetchTickers() {
  const API_KEY = '39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9';
  const _URL = new URL('https://min-api.cryptocompare.com/data/pricemulti');
  if(tickersHandlers.size===0){
    return;
  }
  const TICKERS =[...tickersHandlers.keys()].join(',');
  const CURRENCY = 'USD'
  _URL.searchParams.set('fsyms', TICKERS);
  _URL.searchParams.set('tsyms', CURRENCY);
  _URL.searchParams.set('api_key', API_KEY);
  console.log(decodeURIComponent(_URL.href));
  return fetch(decodeURIComponent(_URL.href)).then(r => r.json()).then(d => {
    return Object.fromEntries(
      Object.entries(d).map(([key, value]) => {
        return [key, value = value[CURRENCY]]
      })
    )
  })
}

export function subscribeToTicker (ticker,cb){
 const subscribers = tickersHandlers.get(ticker) || [];
 tickersHandlers.set(ticker,[...subscribers,cb])
}

export function unsubscribe(ticker,cb){
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker,subscribers.filter(fn=>fn!==cb))
}
window.subscribedTickers = tickersHandlers;
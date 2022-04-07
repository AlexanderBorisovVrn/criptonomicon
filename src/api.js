export async  function fetchTickers(tickers){
  const API_KEY =' 39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9'
  const _URL  = `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers}&api_key=${API_KEY}`
  return fetch(_URL).then(r=>r.json()).then(d=>d)
}
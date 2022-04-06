export async  function fetchTickers(tickerName){
  const API_KEY =' 39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9'
  const _URL  = `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  const response = await fetch(_URL);
  const tickers = await response.json();
  return tickers;
}
const tickersHandlers = new Map();
const API_KEY = '39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9';
const url = new URL('https://min-api.cryptocompare.com/data/blockchain/list');
const URLWs = 'wss://streamer.cryptocompare.com/v2';
const socket = new WebSocket(URLWs + '?api_key=' + API_KEY);

socket.addEventListener('message', (e) => {
  const {
    TYPE: type,
    PRICE: price,
    FROMSYMBOL: currency,
  } = JSON.parse(e.data);
  
  const AGREGATE_TYPE = '5';

  if (type !== AGREGATE_TYPE || !price ) {
    return
  }
  if (currency === 'BTC') {
    localStorage.setItem('crossRate', price)
  }
  const handlers = tickersHandlers.get(currency);
  const newPrice = convertPrice(currency, price);

  handlers && handlers.forEach(fn => {
      fn(newPrice)
  });

});


const subscribeAction = "SubAdd";
const unSubscribeAction = "SubRemove";

function messageToWS(action, tickerName) {
  const subs = [`5~CCCAGG~BTC~USD`];
  return JSON.stringify({
    "action": action,
    "subs": tickerName === 'BTC' ? subs : [...subs, `5~CCCAGG~${tickerName}~BTC`]
  });

}


function subscribeToTickerWs(tickerName) {
  const message = messageToWS(subscribeAction, tickerName);
  if (socket.readyState === 1) {
    socket.send(message);
    return
  }
  socket.addEventListener('open', () => {
    socket.send(message)
  }, {
    once: true
  })
}

export function subscribeToTicker(tickerName, cb) {
  const subscribers = tickersHandlers.get(tickerName) || [];
  tickersHandlers.set(tickerName, [...subscribers, cb]);
  subscribeToTickerWs(tickerName)
}

export function unsubscribe(tickerName) {
  tickersHandlers.delete(tickerName);
  socket.send(
    messageToWS(unSubscribeAction, tickerName)
  )
}

function convertPrice(tickerName, price) {
  if(!price)return;
  if (tickerName === 'BTC') {
    return price
  }
  const BTC_USD = localStorage.getItem('crossRate');
  return price * BTC_USD;
}

export async function fetchFullTickersList(){
  url.searchParams.set('api_key',API_KEY)
 const response = await fetch(url);
 return await response.json(data=>data)

}
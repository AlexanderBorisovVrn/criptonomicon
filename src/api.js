const tickersHandlers = new Map();
const API_KEY = '39dc4489c05f1d652c367141e7d6cbe708692580d58cb897f9bc55e5ca910df9';
const URLWs = 'wss://streamer.cryptocompare.com/v2';
const socket = new WebSocket(URLWs + '?api_key=' + API_KEY);

socket.addEventListener('message', (e) => {
  const {
    TYPE: type,
    PRICE: newPrice,
    FROMSYMBOL: currency
  } = JSON.parse(e.data);
  const AGREGATE_TYPE = '5';
  if (type !== AGREGATE_TYPE) {
    return
  }
  const handlers = tickersHandlers.get(currency);
  handlers && handlers.forEach(fn => {
    fn(newPrice)
  });
})

const subscribeAction = "SubAdd";
const unSubscribeAction = "SubRemove";

function sendMessageToWS(action, tickerName) {
  return JSON.stringify({
    "action": action,
    "subs": [`5~CCCAGG~${tickerName}~USD`]
  });
}


function subscribeToTickerWs(tickerName) {

  if (socket.readyState === 1) {
    socket.send(sendMessageToWS(subscribeAction, tickerName));
    return
  }
  socket.addEventListener('open', () => {
    socket.send(sendMessageToWS(subscribeAction, tickerName))
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
    sendMessageToWS(unSubscribeAction, tickerName)
  )
}
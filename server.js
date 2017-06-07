import { generateFew as carsFactory, generateOne } from "./factories/car";
import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import http from 'http';
import url from 'url';
import debug from 'debug';
import { shuffle, remove } from "./utils/array";

const log = debug("test-server");

const app = express();
app.use(cors());

const cars = carsFactory(100);

app.get('/cars', function ({ query: { offset=0, limit=5 } }, res) {
  offset >>= 0, limit >>= 0;
  log(`Requested /cars offset=${offset}, limit=${limit}`);
  res.send({
    "results": cars.slice(offset, offset + limit),
    "meta": {
      "amount": cars.length,
      "offset": 0,
      "limit": 5
    }
  });
})

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  log('Connected');
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    log('Received: %s', message);
  });
});

server.listen(8080, function listening() {
  let { port } = server.address();
  log(`Listening on ${port}`);
  log(`Visit http://127.0.0.1:${port}`);
});

setTimeout(function scheduledCreating() {
  log(`Generating a new car`);
  const car = generateOne();
  cars.push(car);
  wss.broadcast(`{type: "add", id: ${car.id}}`);
  setTimeout(scheduledCreating, Math.random() * 5e3);
}, 0);

setTimeout(function scheduledRemoving() {
  const position = Math.random() * cars.length >> 0;
  log(`Removing car on ${position} position`);
  const car = cars[position];
  remove(cars, position);
  wss.broadcast(`{type: "remove", id: ${car.id}}`);
  setTimeout(scheduledRemoving, Math.random() * 5e3);
}, 0);

setTimeout(function scheduledChanging() {
  const position = Math.random() * cars.length >> 0;
  log(`Changing car status on ${position} position`);
  const car = cars[position];
  car.status = !!car.status;
  wss.broadcast(`{type: "change", id: ${car.id}}`);
  setTimeout(scheduledChanging, Math.random() * 1e3);
}, 0);

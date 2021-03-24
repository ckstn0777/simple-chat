import Fastify, { FastifyInstance } from 'fastify';
import apiRoute from './routes/api';

export default class Server {
  server: FastifyInstance = Fastify({ logger: true });

  constructor() {
    this.setup();
  }

  setup() {
    // this.app.register(cookie)
    // this.app.register(jwtPlugin)
    this.server.register(apiRoute, { prefix: '/api' });
  }

  start() {
    try {
      this.server.listen(3000);
    } catch (err) {
      this.server.log.error(err);
    }
  }
}

new Server().start();

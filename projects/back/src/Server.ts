import Fastify, { FastifyInstance } from 'fastify';
import apiRoute from './routes/api';
import cookie from 'fastify-cookie';
import jwtPlugin from 'plugins/jwtPlugin';

const PORT = parseInt(process.env.PORT as string);

export default class Server {
  server: FastifyInstance = Fastify({ logger: true });

  constructor() {
    this.setup();
  }

  setup() {
    this.server.register(cookie);
    this.server.register(jwtPlugin);
    this.server.register(apiRoute, { prefix: '/api' });
  }

  start() {
    this.server.log.info(`Server is running with port ${PORT}`);
    return this.server.listen(PORT || 3000);
  }
}

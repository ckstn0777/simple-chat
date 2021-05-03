import { FastifyPluginCallback } from 'fastify';
import authRoute from './auth';
import meRoute from './me';

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' });
  fastify.register(meRoute, { prefix: '/me' });

  done();
};

export default apiRoute;

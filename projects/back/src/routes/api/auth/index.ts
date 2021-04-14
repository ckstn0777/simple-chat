import { FastifyPluginCallback } from 'fastify';

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/login', async (request, reply) => {
    return 'hello login';
  });

  done();
};

export default authRoute;

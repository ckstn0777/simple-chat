import { FastifyPluginAsync } from 'fastify';

const meRoute: FastifyPluginAsync = async (fastify, opts) => {
  /**
   * GET /api/me
   */
  fastify.get('/', async (request, reply) => {
    reply.send({
      body: 'helloworld',
    });
    console.log(request.user);
  });
};

export default meRoute;

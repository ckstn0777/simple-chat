import { FastifyPluginCallback } from 'fastify';
import getGoogleProfile from 'lib/google/getGoogleProfile';
import GoogleLoginBodySchema from 'schema/auth/googleAccessToken/body.json';
import { GoogleLoginBody } from 'types/auth/googleAccessToken/body';

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  // googleLogin
  fastify.post<{ Body: GoogleLoginBody }>(
    '/google',
    {
      schema: {
        body: GoogleLoginBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken } = request.body;
      const profile = await getGoogleProfile(accessToken);
      reply.send(profile);
    },
  );

  done();
};

export default authRoute;

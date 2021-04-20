import { FastifyPluginCallback } from 'fastify';
import { getManager, getRepository } from 'typeorm';
import User from 'entity/User';
import SocialAccount from 'entity/SocialAccount';
import getGoogleProfile from 'lib/google/getGoogleProfile';
import GoogleAccessTokenBodySchema from 'schema/auth/googleAccessToken/body.json';
import GoogleSignupBodySchema from 'schema/auth/googleSignup/body.json';
import { GoogleAccessTokenBody } from 'types/auth/googleAccessToken/body';
import { GoogleSignupBody } from 'types/auth/googleSignup/body';

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * POST /api/auth/google/check
   * Check whether user already has registered
   */
  fastify.post<{ Body: GoogleAccessTokenBody }>(
    '/google/check',
    {
      schema: {
        body: GoogleAccessTokenBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken } = request.body;
      try {
        const profile = await getGoogleProfile(accessToken);

        // find social account (이미 존재하는가)
        const socialAccount = await getRepository(SocialAccount).findOne({
          provider: 'google',
          social_id: profile.socialId,
        });

        reply.send({
          exists: !!socialAccount, // 존재하면 true, 아니면 false
        });
      } catch (e) {
        reply.status(401);
        reply.send({
          code: 401,
          error: 'Google Login Error',
          message: 'Failed to retrieve google profile',
        });
      }
    },
  );

  /**
   * POST /api/auth/google/signin
   * Google Signin (로그인)
   */
  fastify.post<{ Body: GoogleAccessTokenBody }>(
    '/google/signin',
    {
      schema: {
        body: GoogleAccessTokenBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken } = request.body;
      try {
        const profile = await getGoogleProfile(accessToken);
        const socialAccountRepo = getRepository(SocialAccount);

        // find social account (이미 존재하는가)
        const exists = await socialAccountRepo.findOne(
          {
            provider: 'google',
            social_id: profile.socialId,
          },
          { relations: ['user'] }, // 조인!
        );

        // TODO: 할 예정이다...
      } catch (e) {
        console.log(e);
        reply.status(401);
        reply.send({
          code: 401,
          error: 'Google Login Error',
          message: 'Failed to retrieve google profile',
        });
      }
    },
  );

  /**
   * POST /api/auth/google/signup
   * Google Signup(회원가입)
   */
  fastify.post<{ Body: GoogleSignupBody }>(
    '/google/signup',
    {
      schema: {
        body: GoogleSignupBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken, username } = request.body;

      try {
        const profile = await getGoogleProfile(accessToken);
        const socialAccountRepo = getRepository(SocialAccount);
        // find social account
        const exists = await socialAccountRepo.findOne(
          {
            provider: 'google',
            social_id: profile.socialId,
          },
          {
            relations: ['user'],
          },
        );

        if (exists) {
          const user = exists.user;
          const accessToken = await user.generateToken();
          reply.send({
            user: user,
            access_token: accessToken,
          });
        } else {
          const usernameExists = await getRepository(User).findOne({
            username,
          });
          if (usernameExists) {
            reply.status(409); // 충돌에러(이미 유저네임이 존재)
            reply.send({
              code: 409,
              error: 'Username Duplicate Error',
              message: 'Username already exists',
            });
            return;
          }

          // user, socialAccount를 생성해서 DB에 저장
          const manager = getManager();
          const user = new User();
          user.username = username;
          user.email = profile.email;
          user.display_name = profile.displayName;
          user.photo_url = profile.photo ?? undefined;
          user.is_certified = true;
          await manager.save(user);
          const socialAccount = new SocialAccount();
          socialAccount.provider = 'google';
          socialAccount.user = user;
          socialAccount.social_id = profile.socialId;
          await manager.save(socialAccount);

          const accessToken = await user.generateToken();
          reply.send({
            user: user,
            access_token: accessToken,
          });
        }
      } catch (e) {
        reply.status(401);
        reply.send({
          code: 401,
          error: 'Google Login Error',
          message: 'Failed to retrieve google profile',
        });
      }
    },
  );
  done();
};

export default authRoute;

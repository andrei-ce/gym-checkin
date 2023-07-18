import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    // payload: { id: number } // payload type is used for signing and verifying

    // in this lib, the payload is not used to access user data, that is why
    // the user role is under "user"

    // returned in the `request.user` object
    user: {
      sub: string;
      iat: number;
      role: 'ADMIN' | 'MEMBER';
    };
  }
}

import { env } from '@/env';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export async function globalErrorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // here's where we log the error on Datadog, NewRelic, etc.
  }

  return reply.status(500).send({ message: 'Internal server error!' });
}

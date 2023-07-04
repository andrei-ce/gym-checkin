import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { globalErrorHandler } from './services/errors/global-error-handler';

export const app = fastify();

app.register(appRoutes);
app.setErrorHandler(globalErrorHandler);

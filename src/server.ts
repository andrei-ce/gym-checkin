import { app } from './app';
import { env } from './env';

app
  .listen({
    host: '0.0.0.0', //to facilitate connection with FE
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server running on port ${env.PORT}`);
  });

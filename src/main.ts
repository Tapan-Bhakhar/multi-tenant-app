import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log all incoming requests
  app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });
  // Get the port from the environment or use 3000 as default
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();

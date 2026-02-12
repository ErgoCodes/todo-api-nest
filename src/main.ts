import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './lib/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './lib/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
   * SECURITY: Use Helmet to set secure HTTP headers.
   * This helps protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
   */
  app.use(helmet());

  /*
   * SECURITY: Enable CORS (Cross-Origin Resource Sharing).
   * In a real production environment, 'origin' should be restricted to the specific frontend domain(s).
   * Example: origin: process.env.FRONTEND_URL || 'http://localhost:3000'
   */
  app.enableCors({
    origin: '*', // Be cautious with wildcard in strict production scenarios
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(adapterHost),
    new PrismaClientExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true, // Recommended for strict validation
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

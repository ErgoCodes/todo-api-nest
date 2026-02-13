import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './lib/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './lib/filters/prisma-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
      forbidNonWhitelisted: true,
    }),
  );
  /*
   * DOCUMENTATION: Swagger/OpenAPI
   * Setup Swagger to generate API documentation automatically.
   */
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('The Todo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

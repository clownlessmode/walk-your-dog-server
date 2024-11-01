import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ENV VARIABLES
  const PORT = configService.getOrThrow('PORT');
  const APP_URL = configService.getOrThrow('APP_URL');

  // APP
  app.use(bodyParser.json({ limit: '50mb' })); // Здесь можно задать больший лимит
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:5173', 'http://**:**'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const server = app.getHttpServer();
  server.on('upgrade', (req, socket) => {
    socket.on('error', (error) => {
      console.log('WebSocket error:', error);
    });
  });

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    })
  );

  // SWAGGER CONFIGURATION
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WYD mobile application Api')
    .setDescription(
      'API documentation for WYD backend application. Provides detailed information about the available routes, request parameters, and responses.'
    )
    .setVersion('1.1')
    .addBearerAuth({
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .setContact(
      'WYD Support',
      'https://walkyourdog.ru/',
      'walkyourdog.nn@gmail.com'
    )
    .setLicense('Get developer contacts', 'https://t.me/purpletooth')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  // LOGGER
  const logger = new Logger('Bootstrap');

  // SERVER LISTEN
  await app.listen(PORT);

  logger.log(`----------------------------------------------------------`);
  logger.log(`🚀 Server started successfully on port ${PORT}`);
  logger.log(`🔗 Swagger UI is available at ${APP_URL}:${PORT}/api/docs`);
  logger.log(`🗂️ Application base URL is ${APP_URL}:${PORT}`);
  logger.log(`🔧 Environment: ${process.env.NODE_ENV}`);
  logger.log(`----------------------------------------------------------`);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ensureUploadDirectories } from './upload/ensure-upload-dirs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  // Determine deployment environment
  const deploymentEnv = process.env.DEPLOYMENT_ENV || 'local';
  const domain = process.env.DOMAIN || 'localhost';
  const port = process.env.PORT || 3001;
  const sslEnabled = process.env.SSL_ENABLED === 'true';

  // SSL Configuration for HTTPS
  let httpsOptions = undefined;
  if (sslEnabled && deploymentEnv === 'remote') {
    try {
      httpsOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/private/procom.uz.key'),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/certs/procom.uz.crt'),
        ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined,
      };
      console.log('✅ SSL certificates loaded successfully');
    } catch (error) {
      console.warn('⚠️  SSL certificates not found, running without HTTPS:', error.message);
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  // Ensure upload directories exist
  ensureUploadDirectories();

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Dynamic CORS configuration based on deployment environment
  const corsOrigins = deploymentEnv === 'remote' 
    ? [
        `https://${domain}`,              // Main site
        `https://www.${domain}`,          // WWW variant
        `https://api.${domain}`,          // API subdomain
        `https://dashboard.${domain}`,    // Dashboard subdomain
      ]
    : [
        'http://localhost:3000',          // Local Frontend
        'http://localhost:3002',          // Local Dashboard
        `http://localhost:${port}`,       // Local API
      ];

  app.enableCors({
    origin: corsOrigins.filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Commercial Real Estate API')
    .setDescription('API для платформы коммерческой недвижимости')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');
  
  const protocol = sslEnabled && deploymentEnv === 'remote' ? 'https' : 'http';
  const host = deploymentEnv === 'remote' ? domain : 'localhost';
  
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 Application is running in ${deploymentEnv.toUpperCase()} mode`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: ${protocol}://${host}:${port}`);
  console.log(`📚 Swagger docs: ${protocol}://${host}:${port}/api/docs`);
  console.log(`🔒 SSL: ${sslEnabled ? 'Enabled' : 'Disabled'}`);
  console.log('='.repeat(60) + '\n');
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});

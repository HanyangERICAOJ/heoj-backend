import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const errorObject = errors.reduce((errorObj, error) => {
          if (errorObj[error.property] === undefined)
            errorObj[error.property] = [];
          errorObj[error.property].push(...Object.values(error.constraints));
          return errorObj;
        }, {});
        return new BadRequestException(errorObject);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();

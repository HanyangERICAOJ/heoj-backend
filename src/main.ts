import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        // TODO: Fix for 3, 4... nested object, only working object and double nested object
        const errorObject = errors.reduce((errorObj, error) => {
          if (errorObj[error.property] === undefined)
            errorObj[error.property] = [];

          if (error.children.length > 0) {
            errorObj[error.property].push(
              ...error.children.reduce((acc, value) => {
                acc.push(...Object.values(value.constraints));
                return acc;
              }, []),
            );
          }

          if (error.constraints) {
            errorObj[error.property].push(...Object.values(error.constraints));
          }

          return errorObj;
        }, {});
        return new BadRequestException(errorObject);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

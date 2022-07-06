import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageExistConstraint } from './constraints/language-exist.constraint';
import { Language } from './entities/language.entity';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService, LanguageExistConstraint],
})
export class LanguagesModule {}

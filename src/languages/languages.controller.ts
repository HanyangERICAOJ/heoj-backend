import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLanguageDTO } from './dtos/create-language.dto';
import { UpdateLanguageDTO } from './dtos/update-language.dto';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createLanguageDTO: CreateLanguageDTO) {
    return this.languagesService.create(createLanguageDTO);
  }

  @Get()
  list() {
    return this.languagesService.list();
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateLanguageDTO: UpdateLanguageDTO,
  ) {
    return this.languagesService.update(id, updateLanguageDTO);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.languagesService.delete(id);
  }
}

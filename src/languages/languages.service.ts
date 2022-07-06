import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDTO } from './dtos/create-language.dto';
import { UpdateLanguageDTO } from './dtos/update-language.dto';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(createLanguageDTO: CreateLanguageDTO) {
    const language = this.languageRepository.create(createLanguageDTO);

    await this.languageRepository.save(language);
  }

  async list() {
    const languages = await this.languageRepository
      .createQueryBuilder('language')
      .select(['language.id', 'language.name'])
      .getMany();

    return languages;
  }

  async findOneById(id: number) {
    const language = await this.languageRepository.findOneBy({ id: id });
    return language;
  }

  async update(id: number, updateLanguageDTO: UpdateLanguageDTO) {
    const language = await this.languageRepository.findOneBy({ id: id });

    if (!language) throw new NotFoundException();

    await this.languageRepository.update({ id: id }, updateLanguageDTO);
  }

  async delete(id: number) {
    const language = await this.languageRepository.findOneBy({ id: id });

    if (!language) throw new NotFoundException();

    await this.languageRepository.remove(language);
  }
}

import { Injectable, ConflictException } from '@nestjs/common';
import { ExampleRepository } from './repositories/example.repository';
import { CreateExampleDto, ExampleFilterDto } from './dto';
import { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class ExampleService {
  constructor(private readonly repository: ExampleRepository) {}

  findAll(filters: ExampleFilterDto, user: AuthUser) {
    return this.repository.findAll(filters, user); // role-scoped in the repository
  }

  async create(dto: CreateExampleDto) {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) throw new ConflictException(`Code ${dto.code} already exists`);
    return this.repository.create({ ...dto, code: dto.code.toUpperCase() });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExampleFilterDto } from './dto';
import { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class ExampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: ExampleFilterDto, user: AuthUser) {
    const where = { deletedAt: null, ...this.scopeByRole(user) };
    return this.prisma.example.findMany({ where });
  }

  findByCode(code: string) {
    return this.prisma.example.findUnique({ where: { code: code.toUpperCase() } });
  }

  create(data: { code: string }) {
    return this.prisma.example.create({ data });
  }

  private scopeByRole(user: AuthUser) {
    // Admin: no extra filter. Owner/org-scoped: narrow here.
    return {};
  }
}

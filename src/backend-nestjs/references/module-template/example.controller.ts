import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { UserRole } from '@shared/types';
import { ExampleService } from './example.service';
import { CreateExampleDto, ExampleFilterDto } from './dto';

@Controller('examples')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExampleController {
  constructor(private readonly service: ExampleService) {}

  @Get()
  findAll(@Query() filters: ExampleFilterDto, @CurrentUser() user: AuthUser) {
    return this.service.findAll(filters, user);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateExampleDto) {
    return this.service.create(dto);
  }
}

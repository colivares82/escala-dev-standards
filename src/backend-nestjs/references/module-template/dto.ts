import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateExampleDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty() @MaxLength(50)
  code: string;
}

export class ExampleFilterDto {
  @IsOptional() @IsString()
  search?: string;
}

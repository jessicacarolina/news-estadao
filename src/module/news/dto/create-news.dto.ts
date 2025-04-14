import { IsString, IsUrl, IsDateString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  section: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsDateString()
  @IsNotEmpty()
  publicationDateTime: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsUrl()
  @IsNotEmpty()
  imageThumb: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsDateString()
  deletedAt?: string;
}
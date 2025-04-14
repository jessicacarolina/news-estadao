import { IsString, IsUrl, IsDateString, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  @MaxLength(20)
  section: string;

  @IsUrl()
  url: string;

  @IsDateString()
  publicationDateTime: string;

  @IsUrl()
  image: string;

  @IsUrl()
  imageThumb: string;

  @IsString()
  content: string;

}
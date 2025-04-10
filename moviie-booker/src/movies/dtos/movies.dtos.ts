import {
  ApiProperty,
  ApiTags,
  ApiOperation,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
export class MoviesDto {
  @ApiProperty({
    description: 'Langue des résultats au format ISO 639-1',
    example: 'fr-FR',
    default: 'fr-FR',
  })
  @IsString()
  language: string = 'fr-FR';

  @ApiPropertyOptional({
    description: 'Numéro de page pour la pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Région de recherche des films (code ISO 3166-1)',
    example: 'FR',
    default: 'FR',
  })
  region: string = 'FR';

  @ApiPropertyOptional({
    description: 'Terme de recherche pour filtrer les films par titre',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Critère de tri, ex: "note" pour trier par vote_average',
    example: 'note',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

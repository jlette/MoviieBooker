import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  @ApiProperty({
    example: '2025-04-10 20:30',
    description: "date à laquelle l'utilisateur reserver pour le film",
  })
  @IsString()
  startTime: string;

  @ApiProperty({ example: 406, description: 'ID du film depuis TMDB' })
  @IsNumber()
  movieId: number;
}

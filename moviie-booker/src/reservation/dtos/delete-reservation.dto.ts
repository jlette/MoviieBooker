import { IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DeleteReservationDto {
  @ApiProperty({
    description:
      "L'ID unique de la réservation à supprimer(visible dans la liste des reservations)",
    type: String,
  })
  @IsUUID()
  @IsString()
  id: string;
}

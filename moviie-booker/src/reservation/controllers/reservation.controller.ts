import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/jwt/jwt-auth.guard';
import { ReservationService } from '../services/reservation.service';
import { ReservationDto } from '../dtos/reservation.dto';
import { DeleteReservationDto } from '../dtos/delete-reservation.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Reservation } from '../entity/reservation.entity';
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès.',
    type: Reservation,
  })
  @ApiResponse({
    status: 400,
    description:
      'Erreur lors de la création de la réservation (format de date invalide, conflit, etc.).',
  })
  async createReservation(
    @Body() reservationDto: ReservationDto,
    @Req() request: any,
  ) {
    const user = request.user;
    return this.reservationService.createReservation(reservationDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "Récupérer toutes les réservations d'un utilisateur",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des réservations récupérées avec succès.',
    type: [Reservation],
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune réservation trouvée.',
  })
  async getReservations(@Req() request: any) {
    const user = request.user;
    return this.reservationService.getReservations(user);
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiResponse({
    status: 200,
    description: 'Réservation supprimée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      "Réservation non trouvée ou vous n'êtes pas autorisé à la supprimer.",
  })
  async deleteReservation(
    @Body() deleteReservationDto: DeleteReservationDto,
    @Req() request: any,
  ) {
    const user = request.user;
    await this.reservationService.deleteReservation(deleteReservationDto, user);
    return { message: 'Réservation supprimée avec succès.' };
  }
}

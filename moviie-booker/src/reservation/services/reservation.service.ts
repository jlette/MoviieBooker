import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entity/reservation.entity';
import { ReservationDto } from '../dtos/reservation.dto';
import { DeleteReservationDto } from '../dtos/delete-reservation.dto';
import { User } from 'src/users/entity/user.entity';
import * as dayjs from 'dayjs';

import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ReservationService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_URL')!;
    this.apiKey = this.configService.get<string>('API_KEY')!;
    if (!this.apiKey || !this.baseUrl) {
      throw new Error(
        'TMDB_API_KEY et/ou TMDB_BASE_URL est manquant dans le fichier .env',
      );
    }
  }

  private async checkIfMovieExists(movieId: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
        },
      });

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async createReservation(
    dto: ReservationDto,
    user: User,
  ): Promise<Reservation> {
    let startTime: Date;

    if (!dto.startTime) {
      startTime = new Date();
    } else {
      const parsed = dayjs(dto.startTime, 'YYYY-MM-DD HH:mm');
      if (!parsed.isValid()) {
        throw new BadRequestException(
          'Format de date invalide. Utilisez YYYY-MM-DD HH:mm',
        );
      }
      startTime = parsed.toDate();
    }

    const now = new Date();
    if (startTime < now) {
      throw new BadRequestException(
        'La réservation ne peut pas être effectuée dans le passé.',
      );
    }

    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const conflits = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId: user.id })
      .andWhere(
        '(reservation.startTime < :endTime AND reservation.endTime > :startTime)',
        { startTime, endTime },
      )
      .getMany();

    if (conflits.length > 0) {
      throw new BadRequestException(
        'Conflit de réservation ou délai de 2h non respecté.',
      );
    }

    const movieExists = await this.checkIfMovieExists(dto.movieId);
    if (!movieExists) {
      throw new BadRequestException("Le film avec l'ID spécifié n'existe pas.");
    }

    const reservation = this.reservationRepository.create({
      startTime,
      endTime,
      user,
      movieId: dto.movieId,
    });

    return this.reservationRepository.save(reservation);
  }

  async getReservations(user: User): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  async deleteReservation(
    deleteReservationDto: DeleteReservationDto,
    user: User,
  ): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: deleteReservationDto.id,
        user: { id: user.id },
      },
    });

    if (!reservation) {
      throw new BadRequestException(
        "Réservation non trouvée ou vous n'êtes pas autorisé à la supprimer.",
      );
    }

    await this.reservationRepository.remove(reservation);
  }
}

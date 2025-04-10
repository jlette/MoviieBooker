import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../entity/reservation.entity';
import { User } from 'src/users/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ReservationDto } from '../dtos/reservation.dto';
import { DeleteReservationDto } from '../dtos/delete-reservation.dto';
import * as dayjs from 'dayjs';
import axios from 'axios';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { BadRequestException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const moduleMocker = new ModuleMocker(global);

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: jest.Mocked<Repository<Reservation>>;
  let configService: jest.Mocked<ConfigService>;

  const utilisateurTest: User = {
    id: 1,
  } as User;

  const reservationTest = {
    id: 1,
    startTime: new Date(),
    endTime: new Date(),
    user: utilisateurTest,
    movieId: 123,
  } as unknown as Reservation;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'API_KEY') return 'cle-test';
              if (key === 'BASE_URL') return 'http://exemple.com';
              return null;
            }),
          },
        },
      ],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === ReservationService) {
          return {
            createReservation: jest.fn().mockResolvedValue(reservationTest),
          };
        }
        if (token === axios) {
          return mockedAxios;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(ReservationService);
    reservationRepository = moduleRef.get(getRepositoryToken(Reservation));
    configService = moduleRef.get(ConfigService);
  });

  describe('createReservation', () => {
    it('devrait créer une réservation avec succès', async () => {
      const dto: ReservationDto = {
        movieId: 123,
        startTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'),
      };

      mockedAxios.get.mockResolvedValue({ status: 200 });

      reservationRepository.create.mockReturnValue(reservationTest);
      reservationRepository.save.mockResolvedValue(reservationTest);

      const result = await service.createReservation(dto, utilisateurTest);
      expect(result).toEqual(reservationTest);
    });

    it('devrait échouer si le format de la date est invalide', async () => {
      const dto: ReservationDto = {
        movieId: 123,
        startTime: 'date-invalide',
      };

      await expect(
        service.createReservation(dto, utilisateurTest),
      ).rejects.toThrow();
    });
  });

  describe('getReservations', () => {
    it('devrait récupérer toutes les réservations pour un utilisateur', async () => {
      reservationRepository.find.mockResolvedValue([reservationTest]);

      const result = await service.getReservations(utilisateurTest);
      expect(result).toEqual([reservationTest]);
      expect(reservationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: utilisateurTest.id } },
      });
    });

    it("devrait retourner une liste vide si aucune réservation n'est trouvée", async () => {
      reservationRepository.find.mockResolvedValue([]);

      const result = await service.getReservations({ id: 1 } as User);
      expect(result).toEqual([]);
    });
  });

  describe('deleteReservation', () => {
    it('devrait supprimer la réservation si elle existe', async () => {
      const deleteReservationDto: DeleteReservationDto = { id: '1' };
      const utilisateurTest: User = { id: 1 } as User;

      reservationRepository.findOne.mockResolvedValue(reservationTest);
      reservationRepository.remove.mockResolvedValue(reservationTest);

      await service.deleteReservation(deleteReservationDto, utilisateurTest);
      expect(reservationRepository.remove).toHaveBeenCalledWith(
        reservationTest,
      );
    });

    it("devrait échouer si la réservation n'existe pas", async () => {
      const deleteReservationDto: DeleteReservationDto = { id: '1' };
      const utilisateurTest: User = { id: 1 } as User;

      reservationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteReservation(deleteReservationDto, utilisateurTest),
      ).rejects.toThrowError(
        new BadRequestException(
          "Réservation non trouvée ou vous n'êtes pas autorisé à la supprimer.",
        ),
      );
    });
  });
});

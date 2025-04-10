import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from '../controllers/reservation.controller';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../entity/reservation.entity';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from 'src/users/jwt/jwt-auth.guard';
import { JwtStrategy } from 'src/users/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserModuleModule } from 'src/users/user-module/user-module.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User]),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseUrl: configService.get<string>('BASE_URL'),
        apiKey: configService.get<string>('API_KEY'),
      }),
    }),
    UserModuleModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}

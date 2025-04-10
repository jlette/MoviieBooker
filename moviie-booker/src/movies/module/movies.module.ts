import { Module } from '@nestjs/common';
import { MoviesController } from '../controllers/movies.controller';
import { MoviesService } from '../services/movies.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

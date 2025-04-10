import { Module } from '@nestjs/common';
import { MoviesController } from '../controllers/movies.controller';
import { MoviesService } from '../services/movies.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'rxjs';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Assure que les variables d'environnement sont globales
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule], // Injecter ConfigModule pour récupérer les variables d'environnement
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 5000, // Définir un timeout pour les requêtes HTTP
        maxRedirects: 5, // Définir un nombre maximal de redirections
        baseUrl: configService.get<string>('BASE_URL'), // Utiliser ConfigService pour récupérer les variables
        apiKey: configService.get<string>('API_KEY'), // Utiliser ConfigService pour récupérer les variables
      }),
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

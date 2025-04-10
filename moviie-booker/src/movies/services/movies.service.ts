import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { MoviesDto } from '../dtos/movies.dtos';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

@Injectable()
export class MoviesService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_URL')!;
    this.apiKey = this.configService.get<string>('API_KEY')!;
    if (!this.baseUrl || !this.apiKey) {
      throw new Error(
        'BASE_URL et/ou API_KEY est manquant dans le fichier .env',
      );
    }
  }

  async getMovies(movieDto: MoviesDto) {
    // Si aucune recherche ni tri n'est spécifié, récupérer tous les films en cours de diffusion
    if (!movieDto.search && !movieDto.sort) {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/movie/now_playing`, {
            params: {
              api_key: this.apiKey,
              page: movieDto.page,
              region: movieDto.region,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                'Erreur API:',
                error.response?.data || error.message,
              );
              throw new BadRequestException('Une erreur est survenue');
            }),
          ),
      );
      return response.data.results;
    }

    // Si search est spécifié mais pas sort, effectuer une recherche par nom de film
    if (movieDto.search && !movieDto.sort) {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/search/movie`, {
            params: {
              api_key: this.apiKey,
              query: movieDto.search,
              page: movieDto.page,
              region: movieDto.region,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                'Erreur API:',
                error.response?.data || error.message,
              );
              throw new BadRequestException('Une erreur est survenue');
            }),
          ),
      );
      return response.data.results;
    }

    // Si sort est spécifié mais pas search, récupérer les films en fonction de la note
    if (!movieDto.search && movieDto.sort) {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/movie/now_playing`, {
            params: {
              api_key: this.apiKey,
              page: movieDto.page,
              region: movieDto.region,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                'Erreur API:',
                error.response?.data || error.message,
              );
              throw new BadRequestException('Une erreur est survenue');
            }),
          ),
      );
      const movies = response.data.results;
      return movies.sort(
        (a: { vote_average: number }, b: { vote_average: number }) =>
          b.vote_average - a.vote_average,
      );
    }

    // Si search et sort sont tous deux spécifiés, faire la recherche et trier
    if (movieDto.search && movieDto.sort) {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/search/movie`, {
            params: {
              api_key: this.apiKey,
              query: movieDto.search,
              page: movieDto.page,
              region: movieDto.region,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                'Erreur API:',
                error.response?.data || error.message,
              );
              throw new BadRequestException('Une erreur est survenue');
            }),
          ),
      );
      const movies = response.data.results;
      return movies.sort(
        (a: { vote_average: number }, b: { vote_average: number }) =>
          b.vote_average - a.vote_average,
      );
    }
  }
}

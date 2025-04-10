import { Controller, Get, Query, Body, UseGuards } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { MoviesDto } from '../dtos/movies.dtos';
import { JwtAuthGuard } from 'src/users/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: 'Récupère une liste de films',
    description: `Permet d'afficher les films actuellement en salle.
- Si 'search' est fourni, on effectue une recherche par mot-clé.
- Si 'sort' est fourni, on trie les résultats par note.
- Si les deux sont présents, on utilise les deux.
`,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des films récupérée avec succès.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 123 },
          title: { type: 'string', example: 'Inception' },
          overview: { type: 'string', example: 'A mind-bending thriller.' },
          vote_average: { type: 'number', example: 8.5 },
          release_date: { type: 'string', example: '2010-07-16' },
          poster_path: { type: 'string', example: '/path.jpg' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide (paramètres manquants ou incorrects).',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé. Jeton JWT requis.' })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur ou de l’API externe.',
  })
  async getMovies(@Query() moviesDto: MoviesDto) {
    return this.moviesService.getMovies(moviesDto);
  }
}

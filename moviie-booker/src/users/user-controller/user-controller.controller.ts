import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserServiceService } from '../services/user-service.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import {
  ApiProperty,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class UserControllerController {
  constructor(private userService: UserServiceService) {}
  @ApiOperation({
    summary: "Inscription d'un nouvel utilisateur",
    description:
      "Permet à un nouvel utilisateur de s'inscrire avec un prénom, un nom, un email et un mot de passe.",
  })
  @ApiResponse({
    status: 201,
    description: 'Inscription effectué',
    type: RegisterDto,
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }
  @ApiOperation({
    summary: "Authentification d'un utilisateur",
    description:
      'Permet à un utilisateur de se connecter en utilisant son email et son mot de passe.',
  })
  @ApiResponse({
    status: 201,
    description: 'Authentification effectué',
    type: LoginDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}

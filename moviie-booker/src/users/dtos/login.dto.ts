import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({
    description: "L'email de l'utilisateur pour d'authentification",
    example: 'email@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur pour l'authentification",
    example: 'password@123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

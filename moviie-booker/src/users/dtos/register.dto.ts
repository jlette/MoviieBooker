import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiOperation } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: "Prénom de l'utilisateur", example: 'darius' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: "Nom de l'utilisateur", example: 'noxus' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'email@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Mot de passe sécurisé (doit contenir lettres majuscules, minuscules, chiffres et caractères spéciaux)',
    example: 'password@123!',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

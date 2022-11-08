import { IsString, IsNotEmpty } from 'class-validator';

export class ClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

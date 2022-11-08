import { IsOptional } from 'class-validator';

export class StudentDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  classId: number;

  @IsOptional()
  rollNumber: string;
}

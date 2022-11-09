import { IsOptional } from 'class-validator';

export class AttendanceDto {
  @IsOptional()
  studentId: number;

  @IsOptional()
  isPresent: boolean;
}

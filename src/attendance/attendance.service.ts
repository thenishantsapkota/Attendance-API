import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendance(dto: AttendanceDto) {
    const attendance = await this.prisma.attendance
      .create({
        data: {
          studentId: dto.studentId,
          isPresent: dto.isPresent ?? false,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return { message: 'Attendance created successfully', attendance };
  }

  async markAttendance(id: number) {
    await this.prisma
      .$queryRaw`update "Attendance" set "isPresent" = not "isPresent" where "id" = ${id} returning *`.catch(
      (error) => {
        throw new InternalServerErrorException(error);
      },
    );

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: id,
      },
    });

    return { message: 'Attendance marked successfully', attendance };
  }

  async deleteAttendance(id: number) {
    const attendance = await this.prisma.attendance
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return { message: 'Attendance deleted successfully', attendance };
  }
}

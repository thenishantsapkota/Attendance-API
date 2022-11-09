import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentDto } from './dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(dto: StudentDto) {
    const student = await this.prisma.student
      .create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          rollNumber: dto.rollNumber,
          class: {
            connect: {
              id: dto.classId,
            },
          },
        },
        include: {
          attendances: {
            orderBy: { id: 'asc' },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Student with that roll number already exists.',
            );
          }
        }
        throw new InternalServerErrorException(error.meta.cause);
      });

    return { message: 'Student created successfully', student };
  }

  async getStudent(id: number) {
    const student = await this.prisma.student
      .findUnique({
        where: {
          id: id,
        },
        include: {
          attendances: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.meta.cause);
      });

    if (!student) {
      throw new NotFoundException('No student with that id exists.');
    }

    return { message: 'Student fetched successfully', student };
  }

  async getStudents() {
    const students = await this.prisma.student.findMany({
      orderBy: { id: 'asc' },
    });

    return { message: 'Students fetched successfully', students };
  }

  async updateStudent(id: number, dto: StudentDto) {
    const student = await this.prisma.student
      .update({
        where: {
          id: id,
        },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          classId: dto.classId,
          rollNumber: dto.rollNumber,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.meta.cause);
      });

    return { message: 'Student updated successfully', student };
  }

  async deleteStudent(id: number) {
    const student = await this.prisma.student.delete({
      where: {
        id: id,
      },
    });

    return { message: 'Student deleted successfully', student };
  }
}

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassDto } from './dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(dto: ClassDto) {
    const _class = await this.prisma.class
      .create({
        data: {
          name: dto.name,
        },
        include: {
          students: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Class with that name already exists.',
            );
          }
        }
        throw new InternalServerErrorException(error.meta.cause);
      });

    return { message: 'Class created successfully', class: _class };
  }

  async getClass(id: number) {
    const _class = await this.prisma.class.findUnique({
      where: {
        id: id,
      },
      include: {
        students: true,
      },
    });

    if (!_class) {
      throw new NotFoundException('No class with that id exists.');
    }

    return { message: 'Class fetched successfully', class: _class };
  }

  async getClasses() {
    const classes = await this.prisma.class.findMany({
      orderBy: { id: 'asc' },
    });

    return { message: 'Classes fetched successfully', classes };
  }

  async updateClass(id: number, dto: ClassDto) {
    const _class = await this.prisma.class
      .update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.meta.cause);
      });

    return { message: 'Class updated successfully', class: _class };
  }

  async deleteClass(id: number) {
    const _class = await this.prisma.class
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.meta.cause);
      });

    return { message: 'Class deleted successfully', class: _class };
  }
}

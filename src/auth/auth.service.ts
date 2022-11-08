import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: AuthDto) {
    const password = await argon.hash(dto.password);
    const user = await this.prisma.user
      .create({
        data: {
          username: dto.username,
          password,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials are already taken.');
          }
        }
        throw new InternalServerErrorException(error.meta.cause);
      });

    return await this.signToken(user.id, user.username);
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('Invalid email or password');

    const pwCompare = await argon.verify(user.password, dto.password);
    if (!pwCompare) throw new ForbiddenException('Invalid email or password');

    return await this.signToken(user.id, user.username);
  }

  async signToken(userId: number, username: string): Promise<object> {
    const payload = {
      sub: userId,
      username,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}

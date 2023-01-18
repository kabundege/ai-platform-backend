import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')
    });
  }

  async validate({ sub,phone }: {sub: number, phone: string}) {
    const user = this.prisma.user.findUnique({ where: { id: sub }, select: { id:true,phone:true,firstName:true,lastName:true } })

    if(!user){
      throw new NotFoundException('User not found')
    }

    return user;
  }
}
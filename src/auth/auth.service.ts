import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: SignUpDto) {
    // generate hash
    const hash = await argon.hash(dto.password)
    // create user
    try{
      const user = await this.prisma.user.create({
        data: {
          hash,
          phone: dto.phone,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        select:{ // fields to return 
          id:true,
          phone: true,
          lastName: true,
          firstName: true,
          createdAt: true,
        }
      })
      return { status:201, message:'Registered Successfully', data: { user } };
    }catch(error){
      if(error instanceof PrismaClientKnownRequestError){
        if( error.code === 'P2002'){
          throw new ForbiddenException(
            'Credentials taken'
          )
        }
      }
      throw error
    }
  }

  async signin(dto: AuthDto) {
    // find user by phone
    const user = await this.prisma.user.findUnique({ 
      where: { phone: dto.phone },
      select: { firstName:true, lastName:true, id:true, phone:true, hash: true }
    })
    // if user's phone is not found
    if(!user){
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }
    // compare password
    const passwordMatch = await argon.verify(user.hash, dto.password)
    // if password doesn;t match
    if(!passwordMatch){
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }

    delete user.hash

    return { status:200, message:'Login Successfully', data: { token: await this.signToken(user.id, user.phone), user } };
  }

  async signToken(userId: number, phone: string){
    const payload = { sub: userId, phone }
    return this.jwt.signAsync(payload,{
      expiresIn: '15m', // experis in 15 min
      secret: this.config.get('JWT_SECRET')
    })
  }
}

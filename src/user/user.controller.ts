import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@GetUser() user:User){
        return user
    }

    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getAll(@GetUser() user:User){
        return user
    }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    if(data){
      return req.user[data]
    }

    return req.user;
  },
);
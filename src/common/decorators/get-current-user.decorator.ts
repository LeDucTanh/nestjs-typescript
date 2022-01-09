import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../../user/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log('::: ' + JSON.stringify(request));
    console.log('data::: ' + data);
    console.log('request:::' + JSON.stringify(request.body, null, 4));
    if (!data) return request.user;
    return request.user[data];
  },
);

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserCredentialDto } from './dto/user-credential.dto';
import { UserService } from './user.service';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/sign-up')
  signUp(@Body(ValidationPipe) dto: UserCredentialDto) {
    return this.service.signUp(dto);
  }

  @Post('/sign-in')
  signIn(@Body(ValidationPipe) dto: UserCredentialDto) {
    return this.service.signIn(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser() user: any) {
    console.log('::: ' + JSON.stringify(user));
  }
}

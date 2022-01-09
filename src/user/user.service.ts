import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialDto } from './dto/user-credential.dto';
import { JwtPayload, Tokens } from './types';
import { User } from './user.entity';
import { DefaultRO } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: UserCredentialDto): Promise<DefaultRO> {
    const user = await this.userRepository.signUp(dto);
    const userRO = {
      id: user.id,
      username: user.username,
    };
    return {
      statusCode: 201,
      message: 'Success',
      data: userRO,
    };
  }

  async signIn(dto: UserCredentialDto): Promise<Tokens> {
    const result = await this.userRepository.validateUser(dto);
    if (result === 'NOT_EXISTS') {
      throw new UnauthorizedException('Not found user');
    }
    if (result === 'WRONG_PASSWORD') {
      throw new UnauthorizedException('Incorrect password');
    }

    const username = result.username;
    const payload: JwtPayload = { username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'at-secret',
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync(payload, {
        secret: 'rt-secret',
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    this.logger.debug(
      `Generate JWT token with payload=${JSON.stringify(payload)}`,
    );
    return { accessToken, refreshToken };
  }
}

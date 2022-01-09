import { EntityRepository, Repository } from 'typeorm';
import { UserCredentialDto } from './dto/user-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({ username, password }: UserCredentialDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, salt);

    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUser({ username, password }: UserCredentialDto) {
    const user = await this.findOne({ username });
    if (!user) {
      return 'NOT_EXISTS';
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return 'WRONG_PASSWORD';
    }
    return user;
  }
}

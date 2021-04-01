import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt(); // add random unique string per user to encryption to make it more secured
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      // 23505 is duplicated item
      if (error.code === '23505') {
        throw new ConflictException('Username is already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return '';
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.has(password, salt);
  }
}

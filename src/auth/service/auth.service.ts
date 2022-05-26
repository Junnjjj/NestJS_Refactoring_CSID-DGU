import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { UsersRepository } from '../../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    // 이메일 확인
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    // 비밀 번호 확인
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (isPasswordValidated) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    // Front-end 에 jwt 반환
    const payload = { email: email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}

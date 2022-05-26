import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false, // 만료기간
    });
  }

  // validate 바로 수행 =
  async validate(payload: Payload) {
    // payload 에 대한 유효성 검사 실행 - decoding 된 payload 가 적합한지
    const user = await this.userRepository.findUserByIdWithoutPassword(
      payload.sub,
    );

    if (user) {
      return user; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}

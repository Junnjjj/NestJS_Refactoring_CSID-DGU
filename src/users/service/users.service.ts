import {
  BadRequestException,
  Body,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserInfoRequestDto, UsersRequestDto } from '../dtos/users.request.dto';
import { UsersRepository } from '../users.repository';
import * as bcrypt from 'bcrypt';
import { UserInfoRepository } from '../../user-info/user-info.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserInfo } from '../../user-info/user-info.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userInfoRepository: UserInfoRepository,
    @InjectModel(UserInfo.name) private readonly userInfoModel: Model<UserInfo>,
  ) {}

  async signUp(data: UsersRequestDto) {
    const { email, password, name } = data;

    const isExist = await this.usersRepository.existsByEmail(email);

    if (isExist) {
      throw new UnauthorizedException('이메일 혹은 닉네임이 겹칩니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.createUser({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }

  // 사용자 정보 저장
  async setUserInfo(data: UserInfoRequestDto, user) {
    try {
      const { analysisChannel, analysisPeriod } = data;

      // 존재하는지 확인 => or 없으면 생성
      const isExist = await this.userInfoRepository.existed(user.id);

      if (isExist) {
        // 있으면 update 시켜줌
        const UserInfo = await this.userInfoModel.findOne({ userId: user.id });

        UserInfo.analysisChannel = analysisChannel;
        UserInfo.analysisPeriod = analysisPeriod;

        return await UserInfo.save();
      } else {
        // 없으면 새로 생성
        const newUserInfo = new this.userInfoModel({
          userId: user.id,
          analysisChannel,
          analysisPeriod,
        });
        return await newUserInfo.save();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

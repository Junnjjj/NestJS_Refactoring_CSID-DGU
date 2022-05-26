import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/users.schema';
import { Model } from 'mongoose';
import { UserInfo } from './user-info.schema';
import { UserInfoRequestDto } from '../users/dtos/users.request.dto';

@Injectable()
export class UserInfoRepository {
  constructor(
    @InjectModel(UserInfo.name) private readonly userInfoModel: Model<UserInfo>,
  ) {}

  async existed(userId: string) {
    const result = await this.userInfoModel.exists({ userId });
    return !!result;
  }

  async createInfo(userInfo: UserInfoRequestDto) {
    return await this.userInfoModel.create(userInfo);
  }

  async updateInfo() {
    return 'update';
  }
}

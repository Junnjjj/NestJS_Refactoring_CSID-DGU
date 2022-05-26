import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInfoRepository } from '../../user-info/user-info.repository';
import { UserInfoRequestDto } from '../../users/dtos/users.request.dto';
import { User } from '../../users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserInfo } from '../../user-info/user-info.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiService {
  constructor(
    private readonly userInfoRepository: UserInfoRepository,
    private httpService: HttpService,
    @InjectModel(UserInfo.name) private readonly userInfoModel: Model<UserInfo>,
  ) {}

  async getAnalysisData(data: string, user: User) {
    // NLP 서버에 요청
    try {
      const nlpResponseData = await this.httpService.get(
        process.env.NLP_API_URI + '/analysis',
        {
          params: {
            keyword: data,
          },
        },
      );
      return nlpResponseData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async saveKeyword(data: string, user: User) {
    try {
      const isExist = await this.userInfoRepository.existed(user.id);

      if (isExist) {
        const UserInfo = await this.userInfoModel.findOne({
          userId: user.id,
        });
        UserInfo.analysisKeyword = [...UserInfo.analysisKeyword, data];

        return await UserInfo.save();
      } else {
        const newUserInfo = new this.userInfoModel({
          userId: user.id,
          analysisKeyword: [data],
        });

        return await newUserInfo.save();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteKeyword(data: string, user: User) {
    try {
      const UserInfo = await this.userInfoModel.findOne({ userId: user.id });

      const keywordList = UserInfo.analysisKeyword;
      UserInfo.analysisKeyword = keywordList.filter((v) => v !== data);
      return await UserInfo.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

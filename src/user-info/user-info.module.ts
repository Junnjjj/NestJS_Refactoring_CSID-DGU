import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfo, UserInfoSchema } from './user-info.schema';
import { UserInfoRepository } from './user-info.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserInfo.name,
        schema: UserInfoSchema,
      },
    ]),
  ],
  providers: [UserInfoRepository],
  exports: [UserInfoRepository],
})
export class UserInfoModule {}

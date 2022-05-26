import { Module } from '@nestjs/common';
import { ApiController } from './controller/api.controller';
import { ApiService } from './service/api.service';
import { ConfigModule } from '@nestjs/config';
import { UserInfoModule } from '../user-info/user-info.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfo, UserInfoSchema } from '../user-info/user-info.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature([
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    UserInfoModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}

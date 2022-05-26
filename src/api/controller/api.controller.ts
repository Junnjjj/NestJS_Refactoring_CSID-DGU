import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { Request } from 'express';
import { ApiService } from '../service/api.service';
import { User } from '../../users/users.schema';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAnalysisData(@Query() query, @CurrentUser() user: User) {
    return await this.apiService.getAnalysisData(query.keyword, user);
  }

  // userInfo 에 Keyword 목록 저장
  @UseGuards(JwtAuthGuard)
  @Post()
  async saveKeyword(@Body() body, @CurrentUser() user: User) {
    return await this.apiService.saveKeyword(body.keyword, user);
  }

  // userInfo 에 Keyword 목록 삭제
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteKeyword(@Body() body, @CurrentUser() user: User) {
    return await this.apiService.deleteKeyword(body.keyword, user);
  }
}

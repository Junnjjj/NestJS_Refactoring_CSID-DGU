import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserInfoRequestDto, UsersRequestDto } from '../dtos/users.request.dto';
import { AuthService } from '../../auth/service/auth.service';
import { LoginRequestDto } from '../../auth/dtos/login.request.dto';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../users.schema';

@UseInterceptors(SuccessInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    // getCurrentUser(@Req() req: Request) => 추상화
    return user.readOnlyData;
  }

  @Post('/signup')
  async signUp(@Body() data: UsersRequestDto) {
    return await this.usersService.signUp(data);
  }

  @Post('/login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  // 사용자 설정 - 분석채널 설정, 분석기간 설정
  @UseGuards(JwtAuthGuard)
  @Post('/info')
  async setUserInfo(
    @Body() data: UserInfoRequestDto,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.setUserInfo(data, user);
  }
}

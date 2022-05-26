export class UsersRequestDto {
  email: string;
  name: string;
  password: string;
}

// 사용자 설정
export class UserInfoRequestDto {
  analysisChannel: boolean[];
  analysisPeriod: string;
}

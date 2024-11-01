import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SendSmsDto } from './dto/sendSms.dto';
import { verifyCodeDto } from './dto/verifyCode.dto';
import { RefreshDto } from './dto/refresh.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('preauth')
  @ApiOperation({ summary: 'Check user by telephone' })
  async preauth(@Body() dto: SendSmsDto) {
    return await this.authService.preauth(dto);
  }

  @Post('verify-code')
  @ApiOperation({ summary: 'Verify sms code' })
  async verifyCode(@Body() dto: verifyCodeDto) {
    return await this.authService.verifySmsCode(dto);
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('image', {}))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully created.',
  })
  async signup(
    @Body() dto: SignUpDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    return await this.authService.signup(dto, file);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Get new access token by refresh' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto);
  }
}

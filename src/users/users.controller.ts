import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entites/user.entity';
import { SendSmsDto } from 'src/auth/dto/sendSms.dto';
import { UpdateTelephoneDto } from './dto/UpdateEmail.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  logger = new Logger('Users');

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 201,
    description: 'All users successfully getted',
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    this.logger.debug(
      `Пользователь получил юзера: ${user.meta.name} (ID: ${id})`
    );
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete some user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Post('/telephone/send-code')
  @ApiOperation({ summary: 'Send telephone code' })
  async sendCode(@Body() dto: SendSmsDto): Promise<{ DEVCODE: string }> {
    const code = await this.usersService.sendTelephoneCode(dto);
    this.logger.debug(
      `Пользователь отправил код для обновления телефона: (TELEPHONE: ${dto.telephone})`
    );
    return code;
  }

  @Patch('/telephone/update/:id')
  @ApiOperation({ summary: 'Update telephone' })
  async updateTelephone(
    @Param('id') id: string,
    @Body() dto: UpdateTelephoneDto
  ): Promise<User> {
    const user = await this.usersService.updateTelephone(id, dto);
    this.logger.debug(
      `Пользователь обновил свой телефон: (TELEPHONE: ${dto.telephone}, USER: ${user.meta.name})`
    );
    return user;
  }
}

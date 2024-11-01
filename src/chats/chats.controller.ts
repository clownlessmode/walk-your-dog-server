import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Dialog } from './entities/dialog.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDialogDto } from './dto/createDialog.dto';
@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Get all user dialogs' })
  @Get(':userId/dialogs')
  async getUserDialogs(@Param('userId') userId: string): Promise<Dialog[]> {
    return this.chatsService.getUserDialogs(userId);
  }

  @ApiOperation({ summary: 'Create new dialog between user and user' })
  @Post('create-dialog')
  async createDialog(@Body() dto: CreateDialogDto): Promise<Dialog> {
    return this.chatsService.createDialog(dto);
  }
}

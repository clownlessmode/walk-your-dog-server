import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDialogDto {
  @ApiProperty({ example: 'a8dadaaf-1b6a-423e-b4fc-821055fc46f8' })
  @IsString()
  user1Id: string;

  @ApiProperty({ example: 'b898cd69-3e3f-47bf-a4b7-6da3d5945766' })
  @IsString()
  user2Id: string;
}

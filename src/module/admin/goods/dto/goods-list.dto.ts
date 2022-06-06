import { ApiProperty } from '@nestjs/swagger';
import { PageDTO } from './../../../../common/dto/page.dto';
export class GoodsListDTO extends PageDTO{
    @ApiProperty({
      description: '关键字',
    required: false,
  })
    readonly keyword?: string;
  }
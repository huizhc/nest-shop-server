import { ApiProperty } from '@nestjs/swagger';

export class NavAddDTO {
  @ApiProperty({
    description: '标题',
  })
  title?: String;
  @ApiProperty({
    description: '链接',
  })
  link?: String;
  @ApiProperty({
    description: '位置',
  })
  position?: Number;
  @ApiProperty({
    description: '是否打开新页面',
  })
  is_opennew?: Number;
  @ApiProperty({
    description: '排序',
  })
  sort?: Number;
  @ApiProperty({
    description: '关联商品',
  })
  relation?: String;
  @ApiProperty({
    description: '状态',
  })
  status?: Number;
}

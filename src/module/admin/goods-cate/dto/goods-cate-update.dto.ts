import { IdDTO } from './id.dto';
/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-05-28 14:47:35
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-29 11:02:49
 * @FilePath: \【源码】nestxiaomi\src\module\admin\goods-cate\dto\goods-cate-create.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';

export class GoodsCateUpdateDTO extends IdDTO {
  @ApiProperty({
    description: '分类名称',
    example: '商品分类1',
  })
  title?: String;
  @ApiProperty({
    description: '上级分类',
    example: '0',
  })
  pid?: any;
  @ApiProperty({
    description: '分类图片',
  })
  cate_img?: String;
  @ApiProperty({
    description: '跳转地址',
  })
  link?: String;
  @ApiProperty({
    description: '分类模板',
  })
  template?: String;
  @ApiProperty({
    description: 'Seo标题',
  })
  sub_title?: String; /*seo相关的标题  关键词  描述*/
  @ApiProperty({
    description: 'Seo关键词',
  })
  keywords?: String;
  @ApiProperty({
    description: 'Seo描述',
  })
  description?: String;
  @ApiProperty({
    description: '排序',
  })
  sort?: Number;
  @ApiProperty({
    description: '状态',
  })
  status?: Number;
}

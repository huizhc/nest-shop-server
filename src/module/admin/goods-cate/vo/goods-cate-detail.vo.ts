/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-05-28 15:11:54
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-29 10:14:44
 * @FilePath: \【源码】nestxiaomi\src\module\admin\goods-cate\vo\goods-cate-detail.vo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ApiProperty } from "@nestjs/swagger";

export class GoodsDetailVO {
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

export class GoodsDetailResponse {
  @ApiProperty({ description: '状态码', example: 200, })
  code: number

  @ApiProperty({ description: '数据',
    type: () => GoodsDetailVO, example: GoodsDetailVO, })
  data: GoodsDetailVO

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  message: string

  @ApiProperty({ description: '操作是否成功', example: true })
  success: string
} 

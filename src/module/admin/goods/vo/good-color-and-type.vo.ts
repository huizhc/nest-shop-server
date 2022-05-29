/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-05-29 17:13:58
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-29 17:44:43
 * @FilePath: \【源码】nestxiaomi\src\module\admin\goods\vo\good-color-and-type.vo.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by huizhc 1125133876@qq.com, All Rights Reserved. 
 */
import { ApiProperty } from '@nestjs/swagger';

class GoodsType {
  @ApiProperty({
    description: '类型id',
  })
  _id?: string;
  @ApiProperty({
    description: '类型标题',
  })
  title?: string;
  @ApiProperty({
    description: '类型描述',
  })
  description?: string;
  @ApiProperty({
    description: '状态',
  })
  status?: number;
  @ApiProperty({
    description: '添加时间',
  })
  add_time?: number;
}

class GoodsColor {
  @ApiProperty({
    description: '颜色名称',
  })
  color_name: string;
  @ApiProperty({
    description: '颜色色值',
  })
  color_value: string;
  @ApiProperty({
    description: '状态',
  })
  status: number;
}

export class GoodsColorAndTypeVO {
  @ApiProperty({ type: GoodsType })
  GoodsType: GoodsType;
  @ApiProperty({ type: GoodsColor })
  GoodsColor: GoodsColor;
}

export class GoodsColorAndTypeResponse {
  @ApiProperty({ description: '状态码', example: 200, })
  code: number

  @ApiProperty({ description: '数据',
    type: () => GoodsColorAndTypeVO, example: GoodsColorAndTypeVO, })
  data: GoodsColorAndTypeVO

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  message: string

  @ApiProperty({ description: '操作是否成功', example: true })
  success: string
} 
import { ApiProperty } from '@nestjs/swagger';
export class GoodsCreateDTO {
  @ApiProperty({
    description: '标题',
  })
  title?: String;
  @ApiProperty({
    description: '副标题',
  })
  sub_title?: String;
  @ApiProperty({
    description: '商品编号',
  })
  goods_sn?: String;
  @ApiProperty({
    description: '分类id',
  })
  cate_id?: String;
  @ApiProperty({
    description: '点击数',
  })
  click_count?: Number;
  @ApiProperty({
    description: '商品库存',
  })
  goods_number?: Number;
  @ApiProperty({
    description: '原价',
  })
  shop_price?: Number;
  @ApiProperty({
    description: '现价',
  })
  market_price?: Number;
  @ApiProperty({
    description: '关联商品',
  })
  relation_goods?: String;
  @ApiProperty({
    description: '商品属性',
  })
  goods_attrs?: String;
  @ApiProperty({
    description: '商品版本',
  })
  goods_version?: String;
  @ApiProperty({
    description: '商品图片',
  })
  goods_img?: String;
  @ApiProperty({
    description: '赠品',
  })
  goods_gift?: String;
  @ApiProperty({
    description: '配件',
  })
  goods_fitting?: String;
  @ApiProperty({
    description: '颜色',
  })
  goods_color?: String[];
  @ApiProperty({
    description: '关键词',
  })
  goods_keywords?: String;
  @ApiProperty({
    description: '描述',
  })
  goods_desc?: String;
  @ApiProperty({
    description: '内容',
  })
  goods_content?: String;
  @ApiProperty({
    description: '排序',
  })
  sort?: Number;
  @ApiProperty({
    description: '是否删除',
  })
  is_delete?: Number;
  @ApiProperty({
    description: '热门',
  })
  is_hot?: Number;
  @ApiProperty({
    description: '精选',
  })
  is_best?: Number;
  @ApiProperty({
    description: '新品',
  })
  is_new?: Number;
  @ApiProperty({
    description: '商品类型id',
  })
  goods_type_id?: Number;
  @ApiProperty({
    description: '状态',
  })
  status?: Number;
  @ApiProperty({
    description: '添加时间',
  })
  add_time?: Number;
  @ApiProperty({
    description: '商品图片列表',
  })
  goods_image_list?: String[];
  @ApiProperty({
    description: '商品特性列表',
  })
  attr_id_list?: String[];
  @ApiProperty({
    description: '商品图片列表',
  })
  attr_value_list?: String[];
}

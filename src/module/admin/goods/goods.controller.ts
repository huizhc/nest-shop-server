import { GoodsListDTO } from './dto/goods-list.dto';
import { GoodsCreateDTO } from './dto/goods-create.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import {
  GoodsColorAndTypeVO,
  GoodsColorAndTypeResponse,
} from './vo/goods-color-and-type.vo';
import { ResultData } from './../../../common/result/ResultData';
import { GoodsAttrService } from './../../../service/goods-attr/goods-attr.service';
import { GoodsImageService } from './../../../service/goods-image/goods-image.service';
import { GoodsColorService } from './../../../service/goods-color/goods-color.service';
import {
  Controller,
  Get,
  Render,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
  Response,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from '../../../config/config';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
// import { GoodsColorService } from '../../../service/goods-color/goods-color.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
// import { GoodsImageService } from '../../../service/goods-image/goods-image.service';
// import { GoodsAttrService } from '../../../service/goods-attr/goods-attr.service';
import * as mongoose from 'mongoose';

import { ToolsService } from '../../../service/tools/tools.service';
import { IdDTO } from '../goods-cate/dto/id.dto';
// import { IdDTO } from '../../../src/common/dto/id.dto';
@ApiTags('商品模块')
@Controller(`${Config.adminPath}/goods`)
export class GoodsController {
  constructor(
    private goodsService: GoodsService,
    private toolsService: ToolsService,
    private goodsCateService: GoodsCateService,
    private goodsColorService: GoodsColorService,
    private goodsTypeService: GoodsTypeService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsImageService: GoodsImageService,
    private goodsAttrService: GoodsAttrService,
  ) {}

  @Get('colorAndType')
  @ApiOkResponse({ description: '文章列表', type: GoodsColorAndTypeResponse })
  /**
   * @description: 获取商品颜色和类型
   * @return {*}
   */
  async colorAndType(): Promise<ResultData<GoodsColorAndTypeVO>> {
    let goodsColorResult = await this.goodsColorService.find({});
    let goodsTypeResult = await this.goodsTypeService.find({});
    return new ResultData(
      '操作成功',
      {
        goodsColor: goodsColorResult,
        goodsType: goodsTypeResult,
      },
      true,
    );
  }

  @Post('add')
  /**
   * @description:
   * @param {*} Body
   * @return {*}
   */
  async handleAdd(@Body() body: GoodsCreateDTO) {
    //生成缩略图
    //1、增加商品数据
    console.log(body)
    let color_temp: string = '';
    if (body.goods_color && typeof body.goods_color !== 'string') {
      color_temp = body.goods_color.join(',') as string;
    }
    var result = await this.goodsService.add({
      ...body,
      goods_color: color_temp,
    });

    // 2、增加图库
    let goods_image_list = body.goods_image_list;
    if (
      result._id &&
      goods_image_list &&
      typeof goods_image_list !== 'string'
    ) {
      for (var i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: result._id,
          img_url: goods_image_list[i],
        });
      }
    }
    // 3、增加商品属性
    let attr_id_list = body.attr_id_list;
    let attr_value_list = body.attr_value_list;
    if (result._id && attr_id_list && typeof attr_id_list !== 'string') {
      for (var i = 0; i < attr_id_list.length; i++) {
        //获取当前 商品类型id对应的商品类型属性
        let goodsTypeAttributeResult =
          await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
        await this.goodsAttrService.add({
          goods_id: result._id,
          //可能会用到的字段  开始
          goods_cate_id: result.goods_cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type,
          //可能会用到的字段  结束
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
        });
      }
    }
    return new ResultData('操作成功', null, true);
  }

  @Get('list')
  /**
   * @description:
   * @param {*} Query
   * @return {*}
   */
  async list(@Query() query: GoodsListDTO) {
    //分页   搜索商品数据

    let keyword = query.keyword;
    console.log(keyword);
    //条件
    let json = {};
    if (keyword) {
      json = Object.assign(json, { title: { $regex: new RegExp(keyword) } });
    }

    let page = query.page || 1;
    let pageSize = 10;
    let skip = (page - 1) * pageSize;
    let goodsResult = await this.goodsService.find(json, skip, pageSize);
    let count = await this.goodsService.count(json);
    let totalPages = Math.ceil(count / pageSize);
    return new ResultData(
      '操作成功',
      {
        goodsList: goodsResult,
        page: page,
        totalPages: totalPages,
        keyword: keyword,
      },
      true,
    );
  }

  @Get('detail')
  /**
   * @description:
   * @param {*} Request
   * @param {*} Query
   * @return {*}
   */
  async detail(@Query() query: IdDTO) {
    var goodsResult = await this.goodsService.find({ _id: query.id });
    let goodsImageResult = await this.goodsImageService.find({
      goods_id: goodsResult[0]._id,
    });
    let goodsAttrResult = await this.goodsAttrService.find({
      goods_id: goodsResult[0]._id,
    });
    return new ResultData(
      '操作成功',
      {
        goods: goodsResult[0],
        goodsAttr: goodsAttrResult,
        goodsImage: goodsImageResult,
      },
      true,
    );
  }

  // 执行增加
  @Post('update')
  // @UseInterceptors(FileInterceptor('goods_img'))
  async update(@Body() body) {
    //0、获取edit传过来的上一页地址
    // let prevPage=body.prevPage || `/${Config.adminPath}/goods`;

    //1、修改商品数据
    let goods_id = body._id;
    //注意 goods_color的类型
    if (body.goods_color && typeof body.goods_color !== 'string') {
      body.goods_color = body.goods_color.join(',');
    }

    await this.goodsService.update(
      {
        _id: goods_id,
      },
      body,
    );

    //2、修改图库数据 （增加）

    let goods_image_list = body.goods_image_list;
    if (goods_id && goods_image_list && typeof goods_image_list !== 'string') {
      for (var i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: goods_id,
          img_url: goods_image_list[i],
        });
      }
    }

    // 3、修改商品类型属性数据         1、删除当前商品id对应的类型属性  2、执行增加

    // 3.1 删除当前商品id对应的类型属性
    await this.goodsAttrService.deleteMany({ goods_id: goods_id });

    // 3.2 执行增加
    let attr_id_list = body.attr_id_list;
    let attr_value_list = body.attr_value_list;
    if (goods_id && attr_id_list && typeof attr_id_list !== 'string') {
      for (var i = 0; i < attr_id_list.length; i++) {
        //获取当前 商品类型id对应的商品类型属性
        let goodsTypeAttributeResult =
          await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
        await this.goodsAttrService.add({
          goods_id: goods_id,
          goods_cate_id: body.goods_cate_id, //分类id
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type,
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
        });
      }
    }
    return new ResultData('操作成功', null, true);
    // this.toolsService.success(res, prevPage);
  }
  @Get('goodsTypeAttribute')
  async goodsTypeAttribute(@Query() query) {
    let cate_id = query.cate_id;
    let goodsTypeReulst = await this.goodsTypeAttributeService.find({
      cate_id: cate_id,
    });
    return new ResultData('操作成功', goodsTypeReulst, true);
  }
  @Post('changeGoodsImageColor')
  async handleChangeGoodsImageColor(@Query() query) {
    console.log(query)
    let color_id = query.color_id;
    let goods_image_id = query.goods_image_id;
    if (color_id) {
      //注意
      color_id = new mongoose.Types.ObjectId(color_id);
    }
    let result = await this.goodsImageService.update(
      {
        _id: goods_image_id,
      },
      { color_id: color_id },
    );
    if (result) {
      return new ResultData('更新数据成功', null, true);
    } else {
      return new ResultData('更新数据失败', null, false);
    }
  }

  @Post('removeGoodsImage')
  async handleRemoveGoodsImage(@Query() query) {
    let goods_image_id = query.goods_image_id;

    let result = await this.goodsImageService.delete({
      _id: goods_image_id,
    });
    if (result) {
      return new ResultData('删除数据成功', null, true);
    } else {
      return new ResultData('删除数据失败', null, false);
    }
  }
  @Post('delete')
  async handleDelete(@Request() req, @Query() query) {
    let result = await this.goodsService.delete({ _id: query.id });
    if (result.ok == 1) {
      await this.goodsAttrService.deleteMany({ goods_id: query.id });

      await this.goodsImageService.deleteMany({ goods_id: query.id });
    }

    // let prevPage = req.prevPage || `/${Config.adminPath}/goods`;
    return new ResultData('操作成功', null, true);
  }
}

import { ResultData } from './../../../common/result/ResultData';
import {
  Controller,
  Get,
  Render,
  Query,
  Post,
  Body,
  Response,
} from '@nestjs/common';

import { Config } from '../../../config/config';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsTypeAttribute`)
export class GoodsTypeAttributeController {
  constructor(
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private toolsService: ToolsService,
    private goodsTypeService: GoodsTypeService,
  ) {}

  @Get()
  @Render('admin/goodsTypeAttribute/index')
  async index(@Query() query) {
    //商品类型 id
    let id = query.id;
    let goodsTypeResult = await this.goodsTypeService.find({ _id: id });

    let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
      cate_id: id,
    });

    return {
      goodsType: goodsTypeResult[0],
      list: goodsTypeAttributeResult,
    };
  }
  @Get('add')
  @Render('admin/goodsTypeAttribute/add')
  async add(@Query() query) {
    //商品类型 id
    let id = query.id;
    //获取所有的商品类型
    let goodsTypeResult = await this.goodsTypeService.find();
    return {
      goodsTypes: goodsTypeResult,
      cate_id: id,
    };
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    let result = await this.goodsTypeAttributeService.add(body);
    if (result) {
      this.toolsService.success(
        res,
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    } else {
      this.toolsService.error(
        res,
        '增加失败',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    }
  }

  @Get('edit')
  @Render('admin/goodsTypeAttribute/edit')
  async edit(@Query() query) {
    //属性 id
    let id = query.id;
    //获取要修改的数据
    let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
      _id: id,
    });

    //获取所有的商品类型
    let goodsTypeResult = await this.goodsTypeService.find();

    return {
      goodsTypes: goodsTypeResult,
      goodsTypeAttribute: goodsTypeAttributeResult[0],
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    let id = body._id;

    body.attr_type != 3 ? (body.attr_value = '') : '';

    let result = await this.goodsTypeAttributeService.update({ _id: id }, body);
    if (result) {
      this.toolsService.success(
        res,
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    } else {
      this.toolsService.error(
        res,
        '增加失败',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    let result = await this.goodsTypeAttributeService.delete({ _id: query.id });
    this.toolsService.success(
      res,
      `/${Config.adminPath}/goodsTypeAttribute?id=${query.cate_id}`,
    );
  }
  /**由此开始 */
  @Post('add')
  async handleAdd(@Body() body) {
    let result = await this.goodsTypeAttributeService.add(body);
    if (result) {
      return new ResultData('操作成功', null, true);
    } else {
      return new ResultData('增加失败', null, true);
    }
  }
  @Get('list')
  async list(@Query() query) {
    //商品类型 id
    let id = query.id;
    let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
      cate_id: id,
    });
    return new ResultData('操作成功', goodsTypeAttributeResult, true);
  }

  @Post('delete')
  async handleDelete(@Query() query) {
    let result = await this.goodsTypeAttributeService.delete({ _id: query.id });
    return new ResultData('操作成功', result, true);
  }
  @Post('update')
  async update(@Body() body) {
    let id = body._id;

    body.attr_type != 3 ? (body.attr_value = '') : '';

    let result = await this.goodsTypeAttributeService.update({ _id: id }, body);
    if (result) {
      return new ResultData('操作成功', null, true);
    } else {
      return new ResultData('增加失败', null, false);
    }
  }

  @Get('detail')
  async detail(@Query() query) {
    //属性 id
    console.log(query)
    let id = query.id;
    //获取要修改的数据
    let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
      _id: id,
    });

    //获取所有的商品类型

    return new ResultData('操作成功', goodsTypeAttributeResult[0], true);
  }
}

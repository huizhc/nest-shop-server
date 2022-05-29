import { GoodsColorAndTypeVO } from './vo/good-color-and-type.vo';
/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-05-29 14:12:48
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-29 18:12:36
 * @FilePath: \【源码】nestxiaomi\src\module\admin\goods\goods.controller.ts
 * @Description: 商品控制器
 *
 * Copyright (c) 2022 by huizhc 1125133876@qq.com, All Rights Reserved.
 */
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
  // @Get()
  // @Render('admin/goods/index')
  // async index(@Query() query) {
  //   //分页   搜索商品数据

  //   let keyword = query.keyword;
  //   console.log(keyword);
  //   //条件
  //   let json = {};
  //   if (keyword) {
  //     json = Object.assign(json, { title: { $regex: new RegExp(keyword) } });
  //   }

  //   let page = query.page || 1;
  //   let pageSize = 10;
  //   let skip = (page - 1) * pageSize;
  //   let goodsResult = await this.goodsService.find(json, skip, pageSize);
  //   let count = await this.goodsService.count(json);
  //   let totalPages = Math.ceil(count / pageSize);

  //   return {
  //     goodsList: goodsResult,
  //     page: page,
  //     totalPages: totalPages,
  //     keyword: keyword,
  //   };
  // }

  // @Get('add')
  // @Render('admin/goods/add')
  // async add() {
  //   //1、获取商品分类
  //   let goodsCateResult = await this.goodsCateService.getModel().aggregate([
  //     {
  //       $lookup: {
  //         from: 'goods_cate',
  //         localField: '_id',
  //         foreignField: 'pid',
  //         as: 'items',
  //       },
  //     },
  //     {
  //       $match: {
  //         pid: '0',
  //       },
  //     },
  //   ]);

  //   //2、获取所有颜色
  //   let goodsColorResult = await this.goodsColorService.find({});
  //   //3、获取商品类型
  //   let goodsTypeResult = await this.goodsTypeService.find({});
  //   return {
  //     goodsCate: goodsCateResult,
  //     goodsColor: goodsColorResult,
  //     goodsType: goodsTypeResult,
  //   };
  // }

  // //富文本编辑器上传图片  图库上传图片
  // // @Post("doImageUpload")
  // // @UseInterceptors(FileInterceptor('file'))
  // // async doUpload(@UploadedFile() file) {

  // //     let { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
  // //     //缩略图
  // //     if (uploadDir) {
  // //         this.toolsService.jimpImg(uploadDir);
  // //     }
  // //     return { link: '/' + saveDir };
  // // }

  // //获取商品类型属性
  // @Get('getGoodsTypeAttribute')
  // async getGoodsTypeAttribute(@Query() query) {
  //   let cate_id = query.cate_id;
  //   let goodsTypeReulst = await this.goodsTypeAttributeService.find({
  //     cate_id: cate_id,
  //   });
  //   return {
  //     result: goodsTypeReulst,
  //   };
  // }

  // //   执行增加
  // //   @Post("doAdd")
  // //   @UseInterceptors(FileInterceptor('goods_img'))
  // //   async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

  // //       let { saveDir,uploadDir } = await this.toolsService.uploadFile(file);
  // //       //生成缩略图
  // //       if(uploadDir){
  // //           this.toolsService.jimpImg(uploadDir);
  // //       }
  // //       //1、增加商品数据
  // //       if (body.goods_color && typeof (body.goods_color) !== 'string') {
  // //           body.goods_color = body.goods_color.join(',');
  // //       }
  // //       var result = await this.goodsService.add(Object.assign(body, {
  // //           goods_img: saveDir
  // //       }));

  // //       //2、增加图库
  // //       let goods_image_list = body.goods_image_list;
  // //       if (result._id && goods_image_list && typeof (goods_image_list) !== 'string') {
  // //           for (var i = 0; i < goods_image_list.length; i++) {
  // //               await this.goodsImageService.add({
  // //                   goods_id: result._id,
  // //                   img_url: goods_image_list[i]
  // //               })
  // //           }
  // //       }
  // //       //3、增加商品属性
  // //       let attr_id_list = body.attr_id_list;
  // //       let attr_value_list = body.attr_value_list;
  // //       if (result._id && attr_id_list && typeof (attr_id_list) !== 'string') {

  // //           for (var i = 0; i < attr_id_list.length; i++) {
  // //               //获取当前 商品类型id对应的商品类型属性
  // //               let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
  // //               await this.goodsAttrService.add({
  // //                   goods_id: result._id,
  // //                   //可能会用到的字段  开始
  // //                   goods_cate_id: result.goods_cate_id,
  // //                   attribute_id: attr_id_list[i],
  // //                   attribute_type: goodsTypeAttributeResult[0].attr_type,
  // //                   //可能会用到的字段  结束
  // //                   attribute_title: goodsTypeAttributeResult[0].title,
  // //                   attribute_value: attr_value_list[i],
  // //               })
  // //           }

  // //       }
  // //       this.toolsService.success(res, `/${Config.adminPath}/goods`);

  // //   }

  // @Get('edit')
  // @Render('admin/goods/edit')
  // async edit(@Request() req, @Query() query) {
  //   /*
  //       1、获取商品数据

  //       2、获取商品分类

  //       3、获取所有颜色 以及选中的颜色

  //       4、商品的图库信息

  //       5、获取商品类型

  //       6、获取规格信息
  //       */

  //   //获取上一页的地址  req.prevPage

  //   //1、获取商品数据
  //   var goodsResult = await this.goodsService.find({ _id: query.id });

  //   console.log(goodsResult);

  //   //2、获取商品分类
  //   let goodsCateResult = await this.goodsCateService.getModel().aggregate([
  //     {
  //       $lookup: {
  //         from: 'goods_cate',
  //         localField: '_id',
  //         foreignField: 'pid',
  //         as: 'items',
  //       },
  //     },
  //     {
  //       $match: {
  //         pid: '0',
  //       },
  //     },
  //   ]);

  //   //3、获取所有颜色  以及选中的颜色
  //   let goodsColorResult = await this.goodsColorService.find({});
  //   //goodsColorResult是不可改变对象
  //   //不可改变对象：我们可以通过序列化和反序列化来改变它里面的属性
  //   goodsColorResult = JSON.parse(JSON.stringify(goodsColorResult));

  //   if (goodsResult[0].goods_color) {
  //     var tempColorArr = goodsResult[0].goods_color.split(',');
  //     for (var i = 0; i < goodsColorResult.length; i++) {
  //       if (tempColorArr.indexOf(goodsColorResult[i]._id.toString()) != -1) {
  //         goodsColorResult[i].checked = true;
  //       }
  //     }
  //   }

  //   console.log(goodsColorResult);

  //   //4、商品的图库信息

  //   let goodsImageResult = await this.goodsImageService.find({
  //     goods_id: goodsResult[0]._id,
  //   });

  //   //5、获取商品类型
  //   let goodsTypeResult = await this.goodsTypeService.find({});

  //   //6、获取规格信息  商品类型属性

  //   let goodsAttrResult = await this.goodsAttrService.find({
  //     goods_id: goodsResult[0]._id,
  //   });

  //   let goodsAttrStr = '';

  //   goodsAttrResult.forEach(async (val) => {
  //     if (val.attribute_type == 1) {
  //       goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
  //     } else if (val.attribute_type == 2) {
  //       goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
  //     } else {
  //       // 获取 attr_value  获取可选值列表
  //       const oneGoodsTypeAttributeResult =
  //         await this.goodsTypeAttributeService.find({
  //           _id: val.attribute_id,
  //         });

  //       const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

  //       goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

  //       goodsAttrStr += '<select name="attr_value_list">';

  //       for (let j = 0; j < arr.length; j++) {
  //         if (arr[j] == val.attribute_value) {
  //           goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
  //         } else {
  //           goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
  //         }
  //       }
  //       goodsAttrStr += '</select>';
  //       goodsAttrStr += '</li>';
  //     }
  //   });

  //   return {
  //     goodsCate: goodsCateResult,
  //     goodsColor: goodsColorResult,
  //     goodsType: goodsTypeResult,
  //     goods: goodsResult[0],
  //     goodsAttr: goodsAttrStr,
  //     goodsImage: goodsImageResult,
  //     prevPage: req.prevPage, //上一页的地址
  //   };
  // }

  // //执行增加
  // //     @Post("doEdit")
  // //     @UseInterceptors(FileInterceptor('goods_img'))
  // //     async doEdit(@Body() body, @UploadedFile() file, @Response() res) {

  // // //0、获取edit传过来的上一页地址
  // //         let prevPage=body.prevPage || `/${Config.adminPath}/goods`;

  // // //1、修改商品数据
  // //         let goods_id = body._id;
  // //         //注意 goods_color的类型
  // //         if (body.goods_color && typeof (body.goods_color) !== 'string') {
  // //             body.goods_color = body.goods_color.join(',');
  // //         }

  // //         if (file) {
  // //             let { saveDir,uploadDir } = await this.toolsService.uploadFile(file);
  // //             //生成缩略图
  // //             if(uploadDir){
  // //                 this.toolsService.jimpImg(uploadDir);
  // //             }

  // //             await this.goodsService.update({
  // //                 "_id": goods_id
  // //             }, Object.assign(body, {
  // //                 goods_img: saveDir
  // //             }));
  // //         } else {
  // //             await this.goodsService.update({
  // //                 "_id": goods_id
  // //             }, body);
  // //         }

  // // //2、修改图库数据 （增加）

  // //         let goods_image_list = body.goods_image_list;
  // //         if (goods_id && goods_image_list && typeof (goods_image_list) !== 'string') {
  // //             for (var i = 0; i < goods_image_list.length; i++) {
  // //                 await this.goodsImageService.add({
  // //                     goods_id: goods_id,
  // //                     img_url: goods_image_list[i]
  // //                 })
  // //             }
  // //         }

  // // // 3、修改商品类型属性数据         1、删除当前商品id对应的类型属性  2、执行增加

  // //         // 3.1 删除当前商品id对应的类型属性
  // //         await this.goodsAttrService.deleteMany({"goods_id":goods_id})

  // //         // 3.2 执行增加
  // //         let attr_id_list = body.attr_id_list;
  // //         let attr_value_list = body.attr_value_list;
  // //         if (goods_id && attr_id_list && typeof (attr_id_list) !== 'string') {

  // //             for (var i = 0; i < attr_id_list.length; i++) {
  // //                 //获取当前 商品类型id对应的商品类型属性
  // //                 let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
  // //                 await this.goodsAttrService.add({
  // //                     goods_id: goods_id,
  // //                     goods_cate_id: body.goods_cate_id,   //分类id
  // //                     attribute_id: attr_id_list[i],
  // //                     attribute_type: goodsTypeAttributeResult[0].attr_type,
  // //                     attribute_title: goodsTypeAttributeResult[0].title,
  // //                     attribute_value: attr_value_list[i],
  // //                 })
  // //             }

  // //         }
  // //         this.toolsService.success(res, prevPage);

  // //     }

  // @Get('changeGoodsImageColor')
  // async changeGoodsImageColor(@Query() query) {
  //   let color_id = query.color_id;
  //   let goods_image_id = query.goods_image_id;
  //   if (color_id) {
  //     //注意
  //     color_id = new mongoose.Types.ObjectId(color_id);
  //   }
  //   let result = await this.goodsImageService.update(
  //     {
  //       _id: goods_image_id,
  //     },
  //     { color_id: color_id },
  //   );
  //   if (result) {
  //     return { success: true, message: '更新数据成功' };
  //   } else {
  //     return { success: false, message: '更新数据失败' };
  //   }
  // }

  // @Get('removeGoodsImage')
  // async removeGoodsImage(@Query() query) {
  //   let goods_image_id = query.goods_image_id;

  //   let result = await this.goodsImageService.delete({
  //     _id: goods_image_id,
  //   });
  //   if (result) {
  //     return { success: true, message: '删除数据成功' };
  //   } else {
  //     return { success: false, message: '删除数据失败' };
  //   }
  // }

  //注意：建议软删除

  // @Get('delete')
  // async delete(@Request() req, @Query() query, @Response() res) {
  //   let result = await this.goodsService.delete({ _id: query.id });
  //   if (result.ok == 1) {
  //     await this.goodsAttrService.deleteMany({ goods_id: query.id });

  //     await this.goodsImageService.deleteMany({ goods_id: query.id });
  //   }

  //   let prevPage = req.prevPage || `/${Config.adminPath}/goods`;
  //   this.toolsService.success(res, prevPage);
  // }

  @Get('colorAndType')
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
  async handleAdd(@Body() body) {
    //生成缩略图
    //1、增加商品数据
    if (body.goods_color && typeof body.goods_color !== 'string') {
      body.goods_color = body.goods_color.join(',');
    }
    var result = await this.goodsService.add(body);

    //2、增加图库
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
    //3、增加商品属性
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
  async list(@Query() query) {
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
  async detail(@Request() req, @Query() query) {
    /*
        1、获取商品数据

        2、获取商品分类

        3、获取所有颜色 以及选中的颜色

        4、商品的图库信息

        5、获取商品类型

        6、获取规格信息
        */

    //获取上一页的地址  req.prevPage

    //1、获取商品数据
    var goodsResult = await this.goodsService.find({ _id: query.id });

    console.log(goodsResult);

    //2、获取商品分类
    let goodsCateResult = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);

    //3、获取所有颜色  以及选中的颜色
    let goodsColorResult = await this.goodsColorService.find({});
    //goodsColorResult是不可改变对象
    //不可改变对象：我们可以通过序列化和反序列化来改变它里面的属性
    goodsColorResult = JSON.parse(JSON.stringify(goodsColorResult));

    if (goodsResult[0].goods_color) {
      var tempColorArr = goodsResult[0].goods_color.split(',');
      for (var i = 0; i < goodsColorResult.length; i++) {
        if (tempColorArr.indexOf(goodsColorResult[i]._id.toString()) != -1) {
          goodsColorResult[i].checked = true;
        }
      }
    }

    console.log(goodsColorResult);

    //4、商品的图库信息

    let goodsImageResult = await this.goodsImageService.find({
      goods_id: goodsResult[0]._id,
    });

    //5、获取商品类型
    let goodsTypeResult = await this.goodsTypeService.find({});

    //6、获取规格信息  商品类型属性

    let goodsAttrResult = await this.goodsAttrService.find({
      goods_id: goodsResult[0]._id,
    });

    let goodsAttrStr = '';

    goodsAttrResult.forEach(async (val) => {
      if (val.attribute_type == 1) {
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value  获取可选值列表
        const oneGoodsTypeAttributeResult =
          await this.goodsTypeAttributeService.find({
            _id: val.attribute_id,
          });

        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

        goodsAttrStr += '<select name="attr_value_list">';

        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == val.attribute_value) {
            goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttrStr += '</select>';
        goodsAttrStr += '</li>';
      }
    });
    return new ResultData(
      '操作成功',
      {
        goodsCate: goodsCateResult,
        goodsColor: goodsColorResult,
        goodsType: goodsTypeResult,
        goods: goodsResult[0],
        goodsAttr: goodsAttrStr,
        goodsImage: goodsImageResult,
        prevPage: req.prevPage, //上一页的地址
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

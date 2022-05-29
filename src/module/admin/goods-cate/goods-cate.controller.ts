import { GoodsCateUpdateDTO } from './dto/goods-cate-update.dto'
import { GoodsDetailResponse, GoodsDetailVO } from './vo/goods-cate-detail.vo';
import { IdDTO } from './dto/id.dto';
import { ResultData } from './../../../common/result/ResultData';
import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Response,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoodsCateCreateDTO } from './dto/goods-cate-create.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';


import { Config } from '../../../config/config';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { ToolsService } from '../../../service/tools/tools.service';
import * as mongoose from 'mongoose';

@ApiTags('商品分类')
@Controller(`${Config.adminPath}/goodsCate`)
export class GoodsCateController {
  constructor(
    private goodsCateService: GoodsCateService,
    private toolsService: ToolsService,
  ) {}

  @Get()
  @Render('admin/goodsCate/index')
  async index() {
    let result = await this.goodsCateService.getModel().aggregate([
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

    // console.log(result);
    return {
      list: result,
    };
  }

  @Get('add')
  @Render('admin/goodsCate/add')
  async add() {
    var result = await this.goodsCateService.find({ pid: '0' });
    return {
      cateList: result,
    };
  }

//   @Post('doAdd')
//   @UseInterceptors(FileInterceptor('cate_img'))
//   async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
//     var pid = body.pid;
//     let { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
//     try {
//       if (pid != 0) {
//         body.pid = mongoose.Types.ObjectId(pid); //注意
//       }

//       await this.goodsCateService.add(
//         Object.assign(body, {
//           cate_img: saveDir,
//         }),
//       );
//       //缩略图
//       if (uploadDir) {
//         this.toolsService.jimpImg(uploadDir);
//       }

//       this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
//     } catch (error) {
//       console.log(error);
//       this.toolsService.error(
//         res,
//         '非法请求',
//         `/${Config.adminPath}/goodsCate/add`,
//       );
//     }
//   }

  @Get('edit')
  @Render('admin/goodsCate/edit')
  async edit(@Query() query) {
    //获取所有的以及分类
    try {
      var cateList = await this.goodsCateService.find({ pid: '0' });

      var result = await this.goodsCateService.find({ _id: query.id });

      console.log(result);

      return {
        cateList: cateList,
        list: result[0],
      };
    } catch (error) {
      return error;
    }
  }

//   @Post('doEdit')
//   @UseInterceptors(FileInterceptor('cate_img'))
//   async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
//     let id = body._id;
//     let pid = body.pid;
//     try {
//       if (pid != 0) {
//         body.pid = new mongoose.Types.ObjectId(pid); //注意
//       }

//       if (file) {
//         let { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
//         await this.goodsCateService.update(
//           { _id: id },
//           Object.assign(body, {
//             cate_img: saveDir,
//           }),
//         );
//         //生成缩略图
//         if (uploadDir) {
//           this.toolsService.jimpImg(uploadDir);
//         }
//       } else {
//         await this.goodsCateService.update({ _id: id }, body);
//       }
//       this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
//     } catch (error) {
//       this.toolsService.error(
//         res,
//         '修改失败',
//         `/${Config.adminPath}/goodsCate/edit?id=${id}`,
//       );
//     }
//   }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    let result = await this.goodsCateService.delete({ _id: query.id });
    this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
  }

  /**start */

  @Get('goodsCateTop')
  async goodsCateTop() {
    var result = await this.goodsCateService.find({ pid: '0' });
    return new ResultData('操作成功', result, true);
  }
  @Post('add')
  // @UseInterceptors(FileInterceptor('cate_img'))
  async handleAdd(@Body() body: GoodsCateCreateDTO) {
    var pid = body.pid;
    try {
      if (pid != 0) {
        body.pid = new mongoose.Types.ObjectId(pid); //注意
      }
      await this.goodsCateService.add(body);
      return new ResultData('操作成功', null, true);
    } catch (error) {
      console.log(error);
      return new ResultData('非法请求', null, true);
    }
  }

  @Get('all')
  async all() {
    let result = await this.goodsCateService.getModel().aggregate([
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

    // console.log(result);
    return new ResultData('操作成功', result, true);
  }

  @Get('detail')
  @ApiOkResponse({ description: '分类详情', type: GoodsDetailResponse })
  async detail(@Query() query:IdDTO): Promise<ResultData<GoodsDetailVO>> {
    //获取所有的以及分类
    try {
      var result = await this.goodsCateService.find({ _id: query.id });

      console.log(result);

      return new ResultData('操作成功', result[0], true);
    } catch (error) {
      return error;
    }
  }

  @Post('update')
  async update(@Body() body: GoodsCateUpdateDTO) {
    let id = body.id;
    let pid = body.pid;
    try {
      if (pid != 0) {
        body.pid = new mongoose.Types.ObjectId(pid); //注意
      }
      await this.goodsCateService.update({ _id: id }, body);

      return new ResultData('操作成功', null, true);
    } catch (error) {
      return new ResultData('修改失败', null, true);
    }
  }
  @Post('delete')
  async handleDelete(@Query() query: IdDTO) {
    let result = await this.goodsCateService.delete({ _id: query.id });
    return new ResultData('操作成功', result, true);
  }
}

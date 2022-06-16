import { ResultData } from './../../../common/result/ResultData';
import {
  Controller,
  Render,
  Get,
  Query,
  Param,
  Response,
} from '@nestjs/common';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import * as mongoose from 'mongoose';
@Controller('base/category')
export class CategoryController {
  constructor(
    private goodsService: GoodsService,
    private goodsCateService: GoodsCateService,
  ) {}
  @Get('list')
  // @Render('default/category/list')
  async index(@Query() query) {
      console.log(query)
    var pid = query.pid;
    let page = query.page || 1;
    let pageSize = 12;
    let limit = (page - 1) * pageSize;

    var cateResult = await this.goodsService.getCategoryGoods(
      pid,
      '',
      pageSize,
      limit,
    );
    // 1、获取当前分类
    var currentCateResult = await this.goodsCateService.find({ _id: pid });
    if (currentCateResult[0].pid == '0') {
      //2、获取它下面的子分类
      console.log(pid, 'pid');
      
      var subCateResult = await this.goodsCateService.find({
        pid: new mongoose.Types.ObjectId(pid),
      });
    } else {
      var subCateResult = await this.goodsCateService.find({
        pid: new mongoose.Types.ObjectId(currentCateResult[0].pid),
        // pid: currentCateResult[0].pid,
      });
    }
    console.log(currentCateResult[0].pid, 'currentCateResult[0].pid');
    
    console.log(subCateResult, 'subCateResult')
    return new ResultData('操作成功', {
        goodsList:cateResult,
        subCate:subCateResult,
        currentCate:currentCateResult[0]
    }, true);
    //指定模板渲染
    // let tpl=currentCateResult[0].template?currentCateResult[0].template:"default/category/list";

    // res.render(tpl,{
    //     goodsList:cateResult,
    //     subCate:subCateResult,
    //     currentCate:currentCateResult[0]
    // })
  }
}

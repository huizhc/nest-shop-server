import { CacheService } from './../../../service/cache/cache.service';
import { GoodsService } from './../../../service/goods/goods.service';
import { GoodsCateService } from './../../../service/goods-cate/goods-cate.service';
import { FocusService } from './../../../service/focus/focus.service';
import { ResultData } from './../../../common/result/ResultData';
import { NavService } from './../../../service/nav/nav.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('base/index')
export class IndexController {
  constructor(
    private navService: NavService,
    private focusService: FocusService,
    private goodsCateService: GoodsCateService,
    private goodsService: GoodsService,
    private cacheService: CacheService,
  ) {}

  @Get()
  async index() {
    let topNavResult,
      focusResult,
      goodsCateResult,
      middleNavResult,
      phoneResult;
    // console.time('index');
    //测试发送短信
    // this.toolsService.sendMsg();

    //轮播图
    // topNavResult = await this.cacheService.get('topNav');
    // if (!topNavResult) {
    topNavResult = await this.navService.find({
      position: 1,
      status: 1,
    });
    this.cacheService.set('topNav', topNavResult, 60 * 60);
    // }

    // focusResult = await this.cacheService.get('focus');
    // if (!focusResult) {
    focusResult = await this.focusService.find(
      {},
      {
        sort: -1,
      },
    );
    this.cacheService.set('focus', focusResult, 60 * 60);
    // }
    // goodsCateResult = await this.cacheService.get('goodsCate');
    // if (!goodsCateResult) {
    goodsCateResult = await this.goodsCateService.getModel().aggregate([
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
          status: 1,
        },
      },
    ]);
    this.cacheService.set('goodsCate', goodsCateResult, 60 * 60);
    // }

    // middleNavResult = await this.cacheService.get('middleNav');
    // if (!middleNavResult) {
    middleNavResult = await this.navService.find({
      position: 2,
      status: 1,
    });
    middleNavResult = JSON.parse(JSON.stringify(middleNavResult));
    for (let i = 0; i < middleNavResult.length; i++) {
      if (middleNavResult[i].relation) {
        try {
          //1、relation转换成数组
          let temArr = middleNavResult[i].relation
            .replace(/，/g, ',')
            .split(',');
          let relationIdsArr = [];
          //2、数组中的_id 转换成 Obejct _id
          temArr.forEach((value) => {
            relationIdsArr.push(new mongoose.Types.ObjectId(value));
          });
          //3、数据库里面查找 _id 对应的数据
          let relationGoodsArr = await this.goodsService.findIn(
            {
              _id: { $in: relationIdsArr },
            },
            'title goods_img shop_price',
            10,
          );
          //4、扩展以前对象的属性
          middleNavResult[i].subGoods = relationGoodsArr;
        } catch (error) {
          middleNavResult[i].subGoods = [];
        }
      }
    }
    this.cacheService.set('middleNav', middleNavResult, 60 * 60);
    // }
    //middleNavResult 不可改变对象 (坑)  改为可改变对象
    // //手机
    // let phoneResult= await this.cacheService.get('indexPhone');
    // if(!phoneResult){
    //     phoneResult=await this.goodsService.getCategoryGoods('5bbf058f9079450a903cb77b','hot',8);
    //     this.cacheService.set('indexPhone',phoneResult,60*60);
    // }

    // //电视
    // let tvResult= await this.cacheService.get('indexTv');
    // if(!tvResult){
    //     tvResult=await this.goodsService.getCategoryGoods('5bbf05ac9079450a903cb77c','hot',8);
    //     this.cacheService.set('indexTv',tvResult,60*60);
    // }
    // phoneResult = await this.cacheService.get('phone');
    // if (!phoneResult) {
    phoneResult = await this.goodsService.getCategoryGoods(
      '5bbf058f9079450a903cb77b',
      'hot',
      8,
    );
    this.cacheService.set('phone', phoneResult, 60 * 60);
    // }
    // console.timeEnd('index');

    return new ResultData(
      '操作成功',
      {
        topNav: topNavResult,
        focus: focusResult,
        goodsCate: goodsCateResult,
        middleNav: middleNavResult,
        phone: phoneResult,
      },
      true,
    );

    // return {
    // topNav:topNavResult
    //     focus:focusResult,
    //     phone:phoneResult
    // };
  }

  @Get('news')
  news() {
    return '我是前台新闻首页';
  }
}

import { ResultData } from './../../../common/result/ResultData';
import { Controller,Get,Render, Param,Query} from '@nestjs/common';
import {GoodsService} from '../../../service/goods/goods.service';
import {GoodsColorService} from '../../../service/goods-color/goods-color.service';
import {GoodsImageService} from '../../../service/goods-image/goods-image.service';
import {GoodsAttrService} from '../../../service/goods-attr/goods-attr.service';
import  * as mongoose from 'mongoose';
@Controller('base/product')
export class ProductController {
    constructor(
        private goodsService:GoodsService,
        private goodsColorService:GoodsColorService,
        private goodsImageService:GoodsImageService,
        private goodsAttrService:GoodsAttrService,
        
    ){}
    @Get('getImagelist')
    async getImagelist(@Query() query){
        console.log(query, 'query');
        
        try {            
            let goods_id=query.goods_id;
            let color_id=query.color_id;
            let goodsImageResult=await this.goodsImageService.find({
                goods_id: new mongoose.Types.ObjectId(goods_id),
                color_id: new mongoose.Types.ObjectId(color_id)
            })
            if (goodsImageResult.length == 0) {
                goodsImageResult = await this.goodsImageService.find({ "goods_id": goods_id });
            }
        return new ResultData('操作成功', goodsImageResult, true)

            // return {
            //     success:true,
            //     result:goodsImageResult
            // }
        } catch (error) {
        return new ResultData('操作失败', null, false)
        // return {
        //         success:false,
        //         result:[]
        //     }
        }
    }

    @Get(':id')
    // @Render('default/product/info')
    async index(@Param() params){
        //1、获取商品详情
        let goods_id=params.id;
        let goodsInfo=await this.goodsService.find({"_id":goods_id});

        //2、获取关联商品
 
        let relationGoodsIds = this.goodsService.strToArray(goodsInfo[0].relation_goods);
        let relationGoods=await this.goodsService.findIn(
            {"_id":{$in:relationGoodsIds}},
            'goods_version shop_price'
        );
                 
        //3、获取关联赠品

        var goodsGiftIds = this.goodsService.strToArray(goodsInfo[0].goods_gift);
        var goodsGift = await this.goodsService.findIn({
            _id:{$in: goodsGiftIds}
        },'goods_img title');

        //4、获取关联颜色

        var goodsColorIds = this.goodsService.strToArray(goodsInfo[0].goods_color);        
        var goodsColor = await this.goodsColorService.find({
            _id: {$in: goodsColorIds}
        });        

        //5、获取关联配件
        var goodsFittingIds = this.goodsService.strToArray(goodsInfo[0].goods_fitting);
        var goodsFitting = await this.goodsService.findIn({
            _id:{$in: goodsFittingIds}
        });

        //6、获取商品关联的图片
        var goodsImage = await this.goodsImageService.find({ "goods_id": goods_id })
        
        //7、获取规格参数信息

        var goodsAttr = await this.goodsAttrService.find({ "goods_id": goods_id });

        
        
 //8、获取更多参数  循环商品属性

    /*

       颜色:红色,白色,黄色 |  尺寸:41,42,43

        [ 
          
          { cate: '颜色', list: [ '红色', '白色', '黄色 ' ] },
          { cate: ' 尺寸', list: [ '41', '42', '43' ] } 
      
        ]


      算法：

        var goodsAttr='颜色红色,白色,黄色 | 尺寸a41,42,43';
      
        if(goodsAttr&& goodsAttr.indexOf(':')!=-1){    
            goodsAttr=goodsAttr.replace(/，/g,',');
            goodsAttr=goodsAttr.replace(/：/g,':');            
            goodsAttr= goodsAttr.split('|');
            for( var i=0;i<goodsAttr.length;i++){                
                if(goodsAttr[i].indexOf(':')!=-1){
                    goodsAttr[i]={
                        cate:goodsAttr[i].split(':')[0],
                        list:goodsAttr[i].split(':')[1].split(',')
                    };
                }else{
                    goodsAttr[i]={}
                }
            }

        }else{
          goodsAttr=[]
          
        }
        console.log(goodsAttr);

    */   
        
        return new ResultData('操作成功', {
            goodsInfo:goodsInfo[0],
            relationGoods:relationGoods,
            goodsGift:goodsGift,
            goodsColor:goodsColor,
            goodsFitting:goodsFitting,
            goodsImage:goodsImage,
            goodsAttr:goodsAttr
        }, true)

        // return {
        //     goodsInfo:goodsInfo[0],
        //     relationGoods:relationGoods,
        //     goodsGift:goodsGift,
        //     goodsColor:goodsColor,
        //     goodsFitting:goodsFitting,
        //     goodsImage:goodsImage,
        //     goodsAttr:goodsAttr
        // };
    }


}

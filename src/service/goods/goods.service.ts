import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {GoodsInterface} from '../../interface/goods.interface';
import {GoodsCateService} from '../../service/goods-cate/goods-cate.service';
import * as mongoose from 'mongoose';
@Injectable()
export class GoodsService {
    constructor(@InjectModel('Goods') private readonly goodsModel,private goodsCateService:GoodsCateService) {}

    async find(json:GoodsInterface={},skip=0,limit=0,fields?:string,sort?:object){
        try {
            sort=sort?sort:{'add_time':-1};
            return await this.goodsModel.find(json,fields).skip(skip).limit(limit).sort(sort);
        } catch (error) {
            return [];
        }       
    }

    async findIn(json,fields?:string,limit:number=10,skip:number=0){
        try {
            return await this.goodsModel.find(json,fields).skip(skip).limit(limit);
        } catch (error) {
            return [];
        }       
    }

    async count(json:GoodsInterface={}){
        try {
            return await this.goodsModel.find(json).count();
        } catch (error) {
            return [];
        }       
    }

    async add(json:GoodsInterface){
        try {
            var access=new this.goodsModel(json);
            var result=await access.save();
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(json1:GoodsInterface,json2:GoodsInterface){
        try {
            var result=await this.goodsModel.updateOne(json1,json2);          
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(json:GoodsInterface){
        try {
            var result=await this.goodsModel.deleteOne(json);          
            return result;
        } catch (error) {
            return null;
        }
    }

    getModel(){
       return this.goodsModel;
    }

     /*
        根据商品分类获取推荐商品
        @param {String} cate_id - 分类id
        @param {String} type -  hot  best  new
        @param {Number} limit -  数量
    */
    async getCategoryGoods(cate_id:string,type:string,limit:number=8,skip:number=0){

        
        // 1、获取当前分类下面的子分类
        var cateIdsResult=await this.goodsCateService.find({"pid":mongoose.Types.ObjectId(cate_id)});

        if(cateIdsResult.length==0){
            cateIdsResult=[{_id:mongoose.Types.ObjectId(cate_id)}];
        }
        
        //2、把子分类的_id放在数组里面        
        let temArr=[];
        cateIdsResult.forEach((value)=>{
            temArr.push(value._id);
        });

        //3、查找条件
        let findJson={cate_id: { $in: cateIdsResult }};
        //判断类型 合并对象    
        switch(type){
            case 'hot':    
                    findJson=Object.assign(findJson,{"is_hot":1});
                    break;        
            case 'best':        
                    findJson=Object.assign(findJson,{"is_best":1});
                    break;        
            case 'new':        
                    findJson=Object.assign(findJson,{"is_new":1});        
                    break;
            default :        
                findJson=Object.assign(findJson,{});        
                break;
        }

        //4、获取子分类下面的热门商品
        let goodsArr =await this.findIn(findJson,'title goods_img shop_price',limit,skip);

        return goodsArr;


    }

    strToArray(str:string){
        let idsArr=[]
        try {          
            let temArr = str.replace(/，/g, ',').split(',');             
            temArr.forEach((value) => {
                idsArr.push(mongoose.Types.ObjectId(value));
            })
            return idsArr;
        } catch (error) {
            return idsArr;
        }
      

    }

}

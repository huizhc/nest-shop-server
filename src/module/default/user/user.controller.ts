import { ResultData } from './../../../common/result/ResultData';
import { Controller, Get, Post, Render, Request } from '@nestjs/common';
import { OrderService } from '../../../service/order/order.service';
import { OrderItemService } from '../../../service/order-item/order-item.service';
import { CookieService } from '../../../service/cookie/cookie.service';
import * as mongoose from 'mongoose';
@Controller('user')
export class UserController {

    constructor(private orderService: OrderService, private cookieService: CookieService,private orderItemService:OrderItemService) { }

    @Get('welcome')
    @Render('default/user/welcome')
    index() {
        return {}
    }
    // @Get('order')
    // @Render('default/user/order')
    // async order(@Request() req) {
    //     const uid = this.cookieService.get(req, 'userinfo')._id;
    //     let order_status = req.query.order_status || -1;
    //     let keywords=req.query.keywords;
    //     let page = req.query.page || 1;
    //     let pageSize = 3;
    //     let json = { "uid": new mongoose.Types.ObjectId(uid) };   //查询当前用户下面的所有订单
    //     //状态删选
    //     if(order_status!=-1){
    //         json=Object.assign(json,{order_status:parseInt(order_status)});
    //     }
    //     //关键词删选
    //     if(keywords){            
    //         let orderItemJson=Object.assign({"uid":new mongoose.Types.ObjectId(uid)},{"product_title":{$regex:new RegExp(keywords)}});            
    //         let orderItemResult=await this.orderItemService.find(orderItemJson);  
            
    //         if(orderItemResult.length>0){    
    //             var tempArr=[];              
    //             orderItemResult.forEach((value) => {
    //                 tempArr.push(new mongoose.Types.ObjectId(value.order_id));
    //             })                
              
    //             json=Object.assign(json,{
    //                 _id: { $in: tempArr }
    //             })
    
    //         }
            

    //     }
    //     // 总数量
    //     const totalNum = await this.orderService.count(json);
    //     //聚合管道要注意顺序    
    //     const result = await this.orderService.getModel().aggregate([
    //         {
    //             $lookup: {
    //                 from: 'order_item',
    //                 localField: '_id',
    //                 foreignField: 'order_id',
    //                 as: 'orderItems',
    //             },
    //         },
    //         {
    //             $sort: {"add_time":-1}
    //         },
    //         {
    //             $match: json   //条件
    //         },
    //         {
    //             $skip: (page - 1) * pageSize,
    //         },
    //         {
    //             $limit: pageSize,
    //         }

    //     ]);

    //     return {
    //         list: result,
    //         totalPages: Math.ceil(totalNum / pageSize),
    //         page,
    //         order_status,
    //         keywords
    //     };

    // }
    @Post('order')
    // @Render('default/user/order')
    async orderList(@Request() req) {
        const uid = this.cookieService.get(req, 'userinfo')._id;
        let order_status = req.query.order_status || -1;
        let keywords=req.query.keywords;
        let page = req.query.page || 1;
        let pageSize = 3;
        // let json = { "uid": new mongoose.Types.ObjectId(uid) };   //查询当前用户下面的所有订单
        let json = { "uid": uid };   //查询当前用户下面的所有订单
        //状态删选
        if(order_status!=-1){
            json=Object.assign(json,{order_status:parseInt(order_status)});
        }
        //关键词删选
        if(keywords){            
            // let orderItemJson=Object.assign({"uid":new mongoose.Types.ObjectId(uid)},{"product_title":{$regex:new RegExp(keywords)}});            
            let orderItemJson=Object.assign({"uid":uid},{"product_title":{$regex:new RegExp(keywords)}});            
            let orderItemResult=await this.orderItemService.find(orderItemJson);  
            
            if(orderItemResult.length>0){    
                var tempArr=[];              
                orderItemResult.forEach((value) => {
                    tempArr.push(new mongoose.Types.ObjectId(value.order_id));
                })                
              
                json=Object.assign(json,{
                    _id: { $in: tempArr }
                })
    
            }
            

        }
        // 总数量
        const totalNum = await this.orderService.count(json);
        //聚合管道要注意顺序    
        const result = await this.orderService.getModel().aggregate([
            {
                $lookup: {
                    from: 'order_item',
                    localField: '_id',
                    foreignField: 'order_id',
                    as: 'orderItems',
                },
            },
            {
                $sort: {"add_time":-1}
            },
            {
                $match: json   //条件
            },
            {
                $skip: (page - 1) * pageSize,
            },
            {
                $limit: pageSize,
            }

        ]);

        return new ResultData('操作成功', {
            list: result,
            totalPages: Math.ceil(totalNum / pageSize),
            page,
            order_status,
            keywords
        }, true)

    }

    // @Get('orderinfo')
    // @Render('default/user/orderinfo')
    // async orderInfo(@Request() req) {

    //     let id=req.query.id;

    //     let orderResult=await this.orderService.find({"_id":id});

    //     orderResult=JSON.parse(JSON.stringify(orderResult));

    //     orderResult[0]["orderItems"]=await this.orderItemService.find({"order_id":id})

    //     return {
    //         orderInfo:orderResult[0]
    //     }
    // }

    @Post('orderinfo')
    // @Render('default/user/orderinfo')
    async orderInfo(@Request() req) {

        let id=req.query.id;

        let orderResult=await this.orderService.find({"_id":id});

        orderResult=JSON.parse(JSON.stringify(orderResult));

        orderResult[0]["orderItems"]=await this.orderItemService.find({"order_id":id})

        return new ResultData('操作成功', orderResult[0], true)
    }

}

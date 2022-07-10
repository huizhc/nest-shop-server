import { GoodsService } from './../../../service/goods/goods.service';
import { AuthGuard } from '@nestjs/passport';
import { ResultData } from './../../../common/result/ResultData';
import {
  Controller,
  Get,
  Query,
  Response,
  Request,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CookieService } from '../../../service/cookie/cookie.service';
import { AddressService } from '../../../service/address/address.service';
import { OrderService } from '../../../service/order/order.service';
import { OrderItemService } from '../../../service/order-item/order-item.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller('base/buy')
export class BuyController {
  constructor(
    private cookieService: CookieService,
    private addressService: AddressService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private toolsService: ToolsService,
    private goodsService: GoodsService,
  ) {}
  @Get('checkout')
  async checkout(@Query() query, @Request() req, @Response() res) {
    let orderList = [];
    let allPrice = 0;
    let orderSign = this.toolsService.getMd5(this.toolsService.getRandomNum());
    req.session.orderSign = orderSign;

    let cartList = this.cookieService.get(req, 'cartList');
    if (cartList && cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].checked) {
          orderList.push(cartList[i]);
          allPrice += cartList[i].price * cartList[i].num;
        }
      }
      if (allPrice == 0) {
        res.redirect('/cart');
      } else {
        let uid = this.cookieService.get(req, 'userinfo')._id;
        let addressResult = await this.addressService.find(
          { uid: uid },
          { default_address: -1 },
        );
        await res.render('default/buy/checkout', {
          orderList: orderList,
          allPrice: allPrice,
          addressList: addressResult,
          orderSign: orderSign,
        });
      }
    } else {
      res.redirect('/cart');
    }
  }
  @Get('orderSign')
  @UseGuards(AuthGuard('jwt'))
  async orderSign(@Query() query, @Request() req) {
    let orderSign = this.toolsService.getMd5(this.toolsService.getRandomNum());
    req.session.orderSign = orderSign;
    return new ResultData('操作成功', orderSign, true);
  }
  //支付
  @Get('confirm')
  async confirm(@Query() query, @Response() res) {
    var id = query.id;
    var orderResult = await this.orderService.find({ _id: id });
    if (orderResult && orderResult.length > 0) {
      //获取商品
      var orderItemResult = await this.orderItemService.find({ order_id: id });
      await res.render('default/buy/confirm', {
        orderResult: orderResult[0],
        orderItemResult: orderItemResult,
      });
    } else {
      res.redirect('/');
    }

    res.send('获取订单信息-去支付');
  }
  //提交订单
  @Post('doOrder')
  @UseGuards(AuthGuard('jwt'))
  async doOrder(@Body() body, @Request() req) {
    /*
          1、获取收货地址信息
          2、获取购买商品的信息
          3、把订单信息放在订单表，把商品信息放在商品表
          4、删除购物车里面的选中数据
        */
    //防止重复提交
    console.log(body.orderSign, req.session.orderSign);
    if (body.orderSign != req.session.orderSign) {
      return new ResultData('订单已失效，请重新提交', { back: 1 }, false);
    }
    req.session.orderSign = null;
    
    let uid = req.user.id;
    let addressResult = await this.addressService.find({
      uid: uid,
      default_address: 1,
    });
    let orderList;
    if (typeof body.orderList == 'string') {
      try {
        orderList = JSON.parse(body.orderList);
      } catch (error) {
        return new ResultData('请重试', { flush: 1 }, false);
      }
    }

    if (
      addressResult &&
      addressResult.length > 0 &&
      orderList &&
      orderList.length > 0
    ) {
      let ids = orderList.map((v) => v.id);
      let products = await this.goodsService.findIn({ _id: { $in: ids } });
      let status = {
        pass: true,
        orderPrice: 0,
        pStatusArray: [],
      };
    for (let product of orderList) {
        let iStatus = this.getProductStatus(product.id, product.num, products);
        if (!iStatus)
          return new ResultData(
            'id为' + product.id + '的商品不存在，订单创建失败',
            status,
            false,
          );
        if (!iStatus.haveStock) {
          status.pass = false;
        }
        status.orderPrice += iStatus.totalPrice;
        status.pStatusArray.push(iStatus);
      }
    if (!status.pass) {
        return new ResultData('商品库存不足', status, false);
      }

      let order_id = await this.toolsService.getOrderId();
      let name = addressResult[0].name;
      let phone = addressResult[0].phone;
      let address = addressResult[0].address;
      let zipcode = addressResult[0].zipcode;
      let pay_status = 0;
      let pay_type = '';
      let order_status = 0;

      let orderResult = await this.orderService.add({
        uid,
        order_id,
        name,
        phone,
        address,
        zipcode,
        pay_status,
        pay_type,
        order_status,
        all_price: status.orderPrice,
      });

      if (orderResult && orderResult._id) {
        for (let i = 0; i < orderList.length; i++) {
          let json = {
            uid: uid,
            order_id: orderResult._id, //订单id
            product_title: products[i].title,
            product_id: products[i]._id,
            product_img: products[i].goods_img,
            product_price: products[i].shop_price,
            product_num: orderList[i].num,
          };
          await this.orderItemService.add(json);
        }
    } else {
        return new ResultData('请重试', { flush: 1 }, false);
        // res.redirect('/buy/checkout');
      }
      //删除购物车里面的选中数据
      // var unCheckedCartList = cartList.filter((value) => {
      //     if (!value.checked) {
      //         return value;
      //     }
      // })
      // this.cookieService.set(res, 'cartList', unCheckedCartList);
      return new ResultData('操作成功', orderResult._id, true);

      // res.redirect('/buy/confirm?id=' + orderResult._id);
    } else {
      //非法请求
      return new ResultData('请重试', { flush: 1 }, false);
      // res.redirect('/buy/checkout');
    }
  }

  private getProductStatus(id, count, products) {
    let i = -1;
    let status = {
      id: null,
      haveStock: false,
      num: 0,
      totalPrice: 0,
      title: '',
    };
    i = products.findIndex((v) => v._id == id);
    if (i == -1) {
      return null;
    } else {
      let product = products[i];
      status.id = product._id;
      status.num = count;
      status.title = product.title;
      status.totalPrice = product.shop_price * count;
      if (product.goods_number - count >= 0) {
        status.haveStock = true;
      }
    }
    return status;
  }
}

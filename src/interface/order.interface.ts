export interface OrderInterface {
    _id?:String;
    uid?:String;
    all_price?:Number;
    order_id?:String;
    name?:String;
    phone?:Number;
    address?:String;
    zipcode?:String;
    pay_status?:Number;   // 支付状态： 0 表示未支付     1 已经支付
    pay_type?:String;      // 支付类型： alipay    wechat  
    order_status?:Number;
    add_time?:Number;
}

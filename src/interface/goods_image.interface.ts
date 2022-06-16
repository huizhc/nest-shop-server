import  * as mongoose from 'mongoose';

export interface GoodsImageInterface {
    _id?:String;
    goods_id?:mongoose.Types.ObjectId;
    img_url?:String;
    color_id?: mongoose.Types.ObjectId;
    status?: Number,
    sort?: Number,    
    add_time?: Number
}
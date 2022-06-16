
import * as mongoose from 'mongoose';
export interface GoodsCateInterface {
  _id?:String;
  title?:String;
  cate_img?: String;   
  filter_attr?:String;
  link?:String;
  template?:String;
  pid?:any;    
  sub_title?: String;         /*seo相关的标题  关键词  描述*/
  keywords?: String;
  description?: String;      
  status?: Number;   
  add_time?: Number;
}
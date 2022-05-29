import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class GoodsColorService {

    constructor(@InjectModel('GoodsColor') private readonly goodsColorModel) { }

    async find(json, fields?: string) {
        try {
            return await this.goodsColorModel.find(json, fields);
        } catch (error) {
            return [];
        }
    }
   
}



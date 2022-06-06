import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {NavInterface} from '../../interface/nav.interface'
@Injectable()
export class NavService {
    constructor(@InjectModel('Nav') private readonly navModel) {}
    
    async find(json:NavInterface={},skip=0,limit=0,sort={},fields?:string){
        try {
            return await this.navModel.find(json,fields).skip(skip).limit(limit).sort(sort);
        } catch (error) {
            return [];
        }       
    }

    async count(json:NavInterface={}){
        try {
            return await this.navModel.find(json).count();
        } catch (error) {
            return [];
        }       
    }


    async add(json:NavInterface){
        try {
            var access=new this.navModel(json);
            var result=await access.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    async update(json1:NavInterface,json2:NavInterface){
        try {
            var result=await this.navModel.updateOne(json1,json2);          
            return result;
        } catch (error) {
            return null;
        }
    }
    async delete(json:NavInterface){
        try {
            var result=await this.navModel.deleteOne(json);          
            return result;
        } catch (error) {
            return null;
        }
    }
    getModel(){
       return this.navModel;
    }

}

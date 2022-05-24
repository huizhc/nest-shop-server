import { MemberInterface } from './../../interface/member.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
    constructor(@InjectModel('Member') private readonly memberModel) { }
    
    async find(json: MemberInterface = {}, fields?: string) {
        try {
            return await this.memberModel.find(json, fields);
        } catch (error) {
            return [];
        }
    }

    async add(json: MemberInterface) {
        try {
            var admin = new this.memberModel(json);
            var result = await admin.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    async update(json1: MemberInterface, json2: MemberInterface) {
        try {
            var result = await this.memberModel.updateOne(json1, json2);
            return result;
        } catch (error) {
            return null;
        }
    }

    async delete(json: MemberInterface) {
        try {
            var result = await this.memberModel.deleteOne(json);
            return result;
        } catch (error) {
            return null;
        }
    }

    getModel() {
        return this.memberModel;
    }
}

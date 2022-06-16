import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {UserInterface} from '../../interface/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel, 
    ) { }


    async find(json: UserInterface = {}, fields?: string) {
        try {
            return await this.userModel.find(json, fields);
        } catch (error) {
            return [];
        }
    }
    async count(json: UserInterface = {}) {
        try {
            return await this.userModel.find(json).count();
        } catch (error) {
            return [];
        }
    }

    async add(json: UserInterface) {
        try {
            var admin = new this.userModel(json);
            var result = await admin.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    async update(json1: UserInterface, json2: UserInterface) {
        try {
            var result = await this.userModel.updateOne(json1, json2);
            return result;
        } catch (error) {
            return null;
        }
    }

    async delete(json: UserInterface) {
        try {
            var result = await this.userModel.deleteOne(json);
            return result;
        } catch (error) {
            return null;
        }
    }


    getModel() {
        return this.userModel;
    }


}

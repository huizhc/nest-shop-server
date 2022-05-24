import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AdminInterface } from '../../interface/admin.interface';
import { RoleAccessService } from '../../service/role-access/role-access.service';
import { AccessService } from '../../service/access/access.service';
import { Config } from '../../config/config';

@Injectable()
export class AdminService {
    constructor(@InjectModel('Admin') private readonly adminModel, private roleAccessService: RoleAccessService, private accessService: AccessService) { }


    async find(json: AdminInterface = {}, fields?: string) {
        try {
            return await this.adminModel.find(json, fields);
        } catch (error) {
            return [];
        }
    }

    async add(json: AdminInterface) {
        try {
            var admin = new this.adminModel(json);
            var result = await admin.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    async update(json1: AdminInterface, json2: AdminInterface) {
        try {
            var result = await this.adminModel.updateOne(json1, json2);
            return result;
        } catch (error) {
            return null;
        }
    }

    async delete(json: AdminInterface) {
        try {
            var result = await this.adminModel.deleteOne(json);
            return result;
        } catch (error) {
            return null;
        }
    }

    getModel() {
        return this.adminModel;
    }

    async checkAuth(req) {

        /*
          1、获取当前用户的角色    （如果超级管理员跳过权限判断 is_super=1）
          2、根据角色获取当前角色的权限列表                       
          3、获取当前访问的url 对应的权限id
          4、判断当前访问的url对应的权限id 是否在权限列表中的id中
      */

        //  1、获取当前用户的角色

        var pathname: string = req.baseUrl;

        pathname = pathname.replace(`/${Config.adminPath}/`, '');

        var userinfo = req.session.userinfo;
        var role_id = userinfo.role_id;
        if (userinfo.is_super == 1 || pathname == 'login/loginOut' || pathname == "main/welcome" || pathname == "main" || pathname == "login" || pathname == "login/doLogin") {
            return true;
        }

        // 2、根据角色获取当前角色的权限列表

        var accessResult = await this.roleAccessService.find({ "role_id": role_id });

        var roleAccessArray = [];
        accessResult.forEach(value => {
            roleAccessArray.push(value.access_id.toString());
        });

        console.log(roleAccessArray);


        //   3、获取当前访问的url 对应的权限id


        var accessResult = await this.accessService.find({ "url": pathname });

        if (accessResult.length > 0) {

            // 4、判断当前访问的url对应的权限id 是否在权限列表中的id中

            if (roleAccessArray.indexOf(accessResult[0]._id.toString()) != -1) {

                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }




    }

}

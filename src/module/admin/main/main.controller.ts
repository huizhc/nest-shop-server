/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-02-10 09:16:55
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-06-01 15:23:31
 * @FilePath: \【源码】nestxiaomi\src\module\admin\main\main.controller.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by huizhc 1125133876@qq.com, All Rights Reserved. 
 */
import { Controller, Get, Render ,Request} from '@nestjs/common';
import {Config} from '../../../config/config';
import { AccessService } from '../../../service/access/access.service';
import { RoleAccessService } from '../../../service/role-access/role-access.service';

@Controller(`${Config.adminPath}/main`)
export class MainController {
    constructor(private accessService:AccessService,private roleAccessService:RoleAccessService) { }
    @Get()
    @Render('admin/main/index')
    async index(@Request() req){

        //1、获取全部的权限
        var userinfo=req.session.userinfo;
        var role_id=userinfo.role_id;
        var result = await this.accessService.getModel().aggregate([
            {
                $lookup: {
                    from: 'access',
                    localField: '_id',
                    foreignField: 'module_id',
                    as: 'items'
                }
            },
            {
                $match: {
                    "module_id": '0'
                }
            }
        ]);

       //2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中


       var accessResult=await this.roleAccessService.find({"role_id":role_id});

        var roleAccessArray=[];
       accessResult.forEach(value => {
            roleAccessArray.push(value.access_id.toString());
       });

       console.log(roleAccessArray);


       // 3、循环遍历所有的权限数据，判断当前权限是否在角色权限的数组中,如果是的话给当前数据加入checked属性

       for(var i=0;i<result.length;i++){

            if(roleAccessArray.indexOf(result[i]._id.toString())!=-1){
                result[i].checked=true;
            }


            for(var j=0;j<result[i].items.length;j++){

                if(roleAccessArray.indexOf(result[i].items[j]._id.toString())!=-1){
                    result[i].items[j].checked=true;
                }
            }
       }


        return {

            asideList:result
        };
    }

    @Get('welcome')
    @Render('admin/main/welcome')
    welcome(){
        return {};
    }

}

import { Injectable, NestMiddleware } from '@nestjs/common';

import {Config} from '../config/config';

import {AdminService} from '../service/admin/admin.service'

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  constructor(private adminService:AdminService){}
  async use(req: any, res: any, next: () => void) {

    

    var pathname=req.baseUrl;  //获取访问的地址
    var userinfo=req.session.userinfo;
    if(userinfo && userinfo.username){
       //设置全局变量
      res.locals.userinfo=userinfo;      
      var hasAuth=await this.adminService.checkAuth(req);
      console.log(hasAuth);
      if(hasAuth){
        next();
      }else{
        res.send('您没有权限访问当前地址');
      }

      
    }else{
      //排除不需要做权限判断的页面  
      if(pathname==`/${Config.adminPath}/login` || pathname==`/${Config.adminPath}/login/code` ||  pathname==`/${Config.adminPath}/login/doLogin`){
       next();
      }else{
        res.redirect(`/${Config.adminPath}/login`);
      }
    }
    
  }
}

import { CookieService } from './../../service/cookie/cookie.service';
// import { MemberService } from './../../admin/member/member.service';
import { MemberSchema } from './../../schema/member.schema';
import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../../schema/admin.schema';
import { RoleSchema } from '../../schema/role.schema'; 
import { AccessSchema } from '../../schema/access.schema'; 
import { RoleAccessSchema } from '../../schema/role_access.schema'; 
import { FocusSchema } from '../../schema/focus.schema'; 

import {AdminService} from '../../service/admin/admin.service';
import { RoleService } from '../../service/role/role.service';
import { RoleController } from './role/role.controller';
import { AccessService } from '../../service/access/access.service';
import { FocusService } from '../../service/focus/focus.service';
import { RoleAccessService } from '../../service/role-access/role-access.service';
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { MemberController } from './member/member.controller';
import { MemberLoginController } from './member-login/member-login.controller';




@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema,collection:"admin" },
      { name: 'Role', schema: RoleSchema,collection:"role" } ,
      { name: 'Access', schema: AccessSchema,collection:"access" },
      { name: 'RoleAccess', schema: RoleAccessSchema,collection:"role_access" }, 
      { name: 'Focus', schema: FocusSchema,collection:"focus" },  
      // { name: 'Member', schema: MemberSchema,collection:"member" }  
      
   ])
  ],
  controllers: [MainController, LoginController, ManagerController, RoleController, AccessController, FocusController, MemberController, MemberLoginController],
  // providers:[ToolsService,AdminService,RoleService,AccessService,RoleAccessService,FocusService,MemberService],
  providers:[ToolsService,AdminService,RoleService,AccessService,RoleAccessService,FocusService,CookieService],
  exports:[AdminService,RoleService,AccessService,RoleAccessService,CookieService]
})
export class AdminModule {}

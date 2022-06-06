import { NavService } from './../../service/nav/nav.service';
import { NavController } from './nav/nav.controller';
import { NavSchema } from './../../schema/nav.schema';
import { GoodsImageService } from './../../service/goods-image/goods-image.service';
import { GoodsImageSchema } from './../../schema/goods_image.schema';
import { GoodsColorSchema } from './../../schema/goods_color.schema';
import { GoodsAttrService } from './../../service/goods-attr/goods-attr.service';
import { GoodsColorService } from './../../service/goods-color/goods-color.service';
import { GoodsAttrSchema } from './../../schema/goods_attr.schema';
import { GoodsService } from './../../service/goods/goods.service';
import { GoodsController } from './goods/goods.controller';
import { GoodsSchema } from './../../schema/goods.schema';
import { GoodsCateController } from './goods-cate/goods-cate.controller';
import { GoodsCateService } from './../../service/goods-cate/goods-cate.service';
import { GoodsCateSchema } from './../../schema/goods_cate.schema';
import { GoodsTypeAttributeController } from './goods-type-attribute/goods-type-attribute.controller';
import { GoodsTypeAttributeService } from './../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeAttributeSchema } from './../../schema/goods_type_attribute.schema';
import { GoodsTypeService } from './../../service/goods-type/goods-type.service';
import { GoodsTypeController } from './goods-type/goods-type.controller';
import { GoodsTypeSchema } from './../../schema/goods_type.schema';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
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
      { name: 'GoodsType', schema: GoodsTypeSchema,collection:"goods_type" },  
      { name: 'GoodsTypeAttribute', schema: GoodsTypeAttributeSchema,collection:"goods_type_attribute" },  
      { name: 'GoodsCate', schema: GoodsCateSchema,collection:"goods_cate" },  
      { name: 'Goods', schema: GoodsSchema,collection:"goods" },  
      { name: 'GoodsAttr', schema: GoodsAttrSchema,collection:"goods_attr" },  
      { name: 'GoodsColor', schema: GoodsColorSchema,collection:"goods_color" },  
      { name: 'GoodsImage', schema: GoodsImageSchema,collection:"goods_image" },  
      { name: 'Nav', schema: NavSchema,collection:"nav" },  
      
   ]),
   JwtModule.register({
    secret: 'dasdjanksjdasd', // 密钥
    signOptions: { expiresIn: '8h' }, // token 过期时效
  }),
  ],
  controllers: [MainController, LoginController, ManagerController, RoleController, AccessController, FocusController, MemberController, MemberLoginController, GoodsTypeController, GoodsTypeAttributeController, GoodsCateController, GoodsController, NavController],
  providers:[ToolsService,AdminService,RoleService,AccessService,RoleAccessService,FocusService,CookieService,JwtStrategy, GoodsTypeService, GoodsTypeAttributeService, GoodsCateService, GoodsService, GoodsAttrService, GoodsColorService, GoodsImageService, NavService],
  exports:[AdminService,RoleService,AccessService,RoleAccessService,CookieService]
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { GoodsCateController } from './goods-cate/goods-cate.controller';
import { GoodsTypeAttributeController } from './goods-type-attribute/goods-type-attribute.controller';
import { GoodsTypeController } from './goods-type/goods-type.controller';
import { GoodsController } from './goods/goods.controller';
import { LoginController } from './login/login.controller';
import { MainController } from './main/main.controller';
import { ManagerController } from './manager/manager.controller';
import { MemberLoginController } from './member-login/member-login.controller';
import { MemberController } from './member/member.controller';
import { NavController } from './nav/nav.controller';
import { RoleController } from './role/role.controller';
import { SystemController } from './system/system.controller';

@Module({
  imports: [
    PublicModule,
  ],
  controllers: [
    MainController,
    LoginController,
    ManagerController,
    RoleController,
    AccessController,
    FocusController,
    MemberController,
    MemberLoginController,
    GoodsTypeController,
    GoodsTypeAttributeController,
    GoodsCateController,
    GoodsController,
    NavController,
    SystemController,
  ],
})
export class AdminModule {}

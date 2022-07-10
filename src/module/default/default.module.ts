import { UserController } from './user/user.controller';
// import { JwtModule } from '@nestjs/jwt';
import { BuyController } from './buy/buy.controller';
import { AddressController } from './address/address.controller';
import { PassController } from './pass/pass.controller';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';
import { Config } from './../../config/config';
import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { IndexController } from './index/index.controller';
import { RedisModule} from 'nestjs-redis';
import { JwtStrategy } from '../public/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'dasdjanksjdasd', // 密钥
      signOptions: { expiresIn: '8h' }, // token 过期时效
    }),

    PublicModule,
    RedisModule.register(Config.redisOptions),
  ],
  providers: [JwtStrategy],
  controllers: [IndexController,CategoryController,ProductController,PassController,AddressController,BuyController,UserController]
})
export class DefaultModule {}

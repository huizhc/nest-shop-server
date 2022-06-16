import { PassController } from './pass/pass.controller';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';
import { Config } from './../../config/config';
import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { IndexController } from './index/index.controller';
import { RedisModule} from 'nestjs-redis';

@Module({
  imports: [
    PublicModule,
    RedisModule.register(Config.redisOptions),
  ],
  controllers: [IndexController,CategoryController,ProductController,PassController]
})
export class DefaultModule {}

import { Config } from './../../../config/config';
import { ResultData } from './../../../common/result/ResultData';
// import { CacheService } from './../../../service/cache/cache.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller(`${Config.adminPath}/system`)
export class SystemController {
  // constructor(private cacheService: CacheService) {}

  // @Post('clearCache')
  // clearCache() {
  //   this.cacheService.clear();
  //   return new ResultData('操作成功', null, true);
  // }
}

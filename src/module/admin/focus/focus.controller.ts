import { ResultData } from './../../../common/result/ResultData';
import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Response,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from '../../../config/config';

import { ToolsService } from '../../../service/tools/tools.service';
import { FocusService } from '../../../service/focus/focus.service';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(
    private toolsService: ToolsService,
    private focusService: FocusService,
  ) {}

  @Get()
  // @Render('admin/focus/index')
  async index() {
    let result = await this.focusService.find();
    return {
      focusList: result,
    };
  }

  @Get('add')
  @Render('admin/focus/add')
  add() {
    return {};
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    console.log(body);
    console.log(file);

    let saveDir = this.toolsService.uploadFile(file);
    console.log(saveDir);
    await this.focusService.add(
      Object.assign(body, {
        focus_img: saveDir,
      }),
    );

    return new ResultData('操作成功', null, true);
    // this.toolsService.success(res,`/${Config.adminPath}/focus`);
  }

  @Get('edit')
  @Render('admin/focus/edit')
  async edit(@Query() query) {
    try {
      let result = await this.focusService.find({ _id: query.id });

      return {
        focus: result[0],
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('doEdit')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    let _id = body._id;

    if (file) {
      let saveDir = this.toolsService.uploadFile(file);
      await this.focusService.update(
        {
          _id: _id,
        },
        Object.assign(body, {
          focus_img: saveDir,
        }),
      );
    } else {
      await this.focusService.update(
        {
          _id: _id,
        },
        body,
      );
    }

    this.toolsService.success(res, `/${Config.adminPath}/focus`);
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = await this.focusService.delete({ _id: query.id });
    this.toolsService.success(res, `/${Config.adminPath}/focus`);
  }
  //富文本编辑器上传图片  图库上传图片
  @Post('imageUpload')
  @UseInterceptors(FileInterceptor('file'))
  async doUpload(@UploadedFile() file) {
    console.log(file);
    
    let saveDir = await this.toolsService.uploadFile(file);
    //缩略图
    //    if (uploadDir) {
    //        this.toolsService.jimpImg(uploadDir);
    //    }
    console.log(saveDir);
    return new ResultData('操作成功', '/' + saveDir, true);
    // return { link: '/' + saveDir };
  }
}

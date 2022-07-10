import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ResultData } from './../../../common/result/ResultData';
import { Controller, Request, Render, Get, Response, Query, Post, Body, UseGuards } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { UserService } from '../../../service/user/user.service';
import { UserTempService } from '../../../service/user-temp/user-temp.service';
import { CookieService } from '../../../service/cookie/cookie.service';
// import * as request from "request"
// import * as urlencode from "urlencode"

@Controller('base/pass')
export class PassController {
   constructor(
      private toolsService: ToolsService,
      private userService: UserService,
      private userTempService: UserTempService,
      private cookieService: CookieService,
    private readonly jwtService: JwtService,
    ) { }

   @Get('code')
   getCode(@Query() query, @Request() req, @Response() res) {
      let widht = query.width || 100;
      let height = query.height || 52;
      let svgCaptcha = this.toolsService.getCaptcha(4, widht, height);
      //设置session
      req.session.identify_code = svgCaptcha.text;
      res.type('image/svg+xml');
      res.send(svgCaptcha.data);
   }

   //登录页面
   @Get('login')
   @Render('default/pass/login')
   login(@Request() req) {

      return {
         prevPage: req.prevPage || ""
      }
   }
   //退出登录
   @Get('loginOut')
   loginOut(@Response() res) {
      this.cookieService.set(res, 'userinfo', '');
      res.redirect('/');
   }
   //执行登录
   @Post('doLogin')
   async doLogin(@Body() body, @Request() req) {
      var username = body.username;
      var password = body.password;
      var identify_code = body.identify_code;
      if (identify_code.toUpperCase() != req.session.identify_code.toUpperCase()) {
         //后端重新生成验证码
         let svgCaptcha = this.toolsService.getCaptcha(4, 80, 40);
         req.session.identify_code = svgCaptcha.text;
         return new ResultData('输入的图形验证码不正确', null, false)
      } else {
         password = this.toolsService.getMd5(password);
         let userInfo = await this.userService.find({ "phone": username, "password": password }, '_id phone last_ip add_time email status');
         if (userInfo && userInfo.length > 0) {
            const token =  this.jwtService.sign({
               id: userInfo[0]._id,
               username: userInfo[0].phone,
             });
            // this.cookieService.set(res, 'userinfo', userInfo[0]);
            return new ResultData('登录成功', token, true)
         } else {
            let svgCaptcha = this.toolsService.getCaptcha(4, 80, 40);
            req.session.identify_code = svgCaptcha.text;
            return new ResultData('用户名或者密码不正确', null, false)
         }

      }
   }

@Post('userInfo')
  @UseGuards(AuthGuard('jwt'))
  userInfo(@Request() req) {
      return new ResultData('登录成功', req.user, true)
   }

   @Get('registerStep1')
   @Render('default/pass/register_step1')
   register1() {
      return {}
   }

   @Get('registerStep2')
   async register2(@Query() qeury) {
      let sign = qeury.sign;
      let identify_code = qeury.identify_code;
      let userTempResult = await this.userTempService.find({ "sign": sign });
      if (userTempResult.length > 0) {
         return new ResultData('操作成功', {
            phone: userTempResult[0].phone,
            identify_code: identify_code,
            sign: sign
         }, true)
      } else {
         return new ResultData('操作成功', null, true)
      }
   }

   @Get('registerStep3')
   // @Render('default/pass/register_step3')
   async register3(@Query() qeury, @Request() req) {
      let sign = qeury.sign;
      let phone_code = qeury.phone_code;
      //1、判断手机收到的验证码是否正确
      if (req.session.phone_code != phone_code) {
         return new ResultData('验证码不正确', null, true)
      }

      //2、验证传过来的参数是否正确
      let userTempResult = await this.userTempService.find({ "sign": sign });
      if (userTempResult && userTempResult.length > 0) {
         return new ResultData('操作成功', {
            phone: userTempResult[0].phone,
            phone_code: phone_code,
            sign: sign
         }, true)
      } else {
         return new ResultData('参数不正确', null, true)
      }
   }
   //验证验证码
   @Get('validatePhoneCode')
   async validatePhoneCode(@Query() query, @Request() req) {

      var sign = query.sign;
      var phone_code = query.phone_code;
      var add_day = await this.toolsService.getDay();         //年月日
      //1、验证数据是否合法
      var userTempResult = await this.userTempService.find({ "sign": sign, add_day: add_day });
      if (userTempResult.length == 0) {
         return new ResultData('参数错误', null, false)
      }

      //2、验证验证码是否正确
      if (req.session.phone_code != phone_code) {
         return new ResultData('输入的验证码错误', null, false)
      }
      //3、判断验证码有没有过期
      var nowTime = await this.toolsService.getTime();
      if ((nowTime - userTempResult[0].add_time) / 1000 / 60 > 15) {
         return new ResultData('验证码已经过期', null, false)
      }
         return new ResultData('验证码输入正确', {
            sign: sign,
         phone_code: phone_code
         }, true)

   }


   //发送短信验证码
   @Get('sendCode')
   async sendCode(@Query() query, @Request() req) {
      let phone = query.phone;
      let identify_code = query.identify_code;
      //1、验证图形验证码是否合法
      if (req.session.identify_code != identify_code) {
         return new ResultData('输入的图形验证码不正确', null, false)
      }
      //2、判断手机格式是否合法
      var reg = /^[\d]{11}$/;
      if (!reg.test(phone)) {
         return new ResultData('手机号格式不合法', null, false)
      }
      //3、验证手机号是否注册
      let userResult = await this.userService.find({ "phone": phone });
      if (userResult && userResult.length > 0) {
         return new ResultData('此用户已经存在', null, false)
      }
      //4、判断手机号发送验证码次数
      var add_day = await this.toolsService.getDay();         //年月日      
      var add_time = await this.toolsService.getTime();         //年月日      
      var sign = await this.toolsService.getMd5(phone + add_day);  //签名
      var ip = req.ip.replace(/::ffff:/, '');     //获取客户端ip         
      var phone_code = await this.toolsService.getRandomNum();  //发送短信的随机码    

      let userTempResult = await this.userTempService.find({ "phone": phone, sign: sign, add_day: add_day });

      let ipCount = await this.userTempService.count({ "ip": ip, add_day: add_day });
      if (userTempResult && userTempResult.length > 0) {
         if (ipCount > 10) {
         return new ResultData('发送失败', {sign, phone}, false)
         }

         if (userTempResult[0].send_count < 4) {
            let send_count = userTempResult[0].send_count + 1;
            await this.userTempService.update({ "phone": phone, sign: sign, add_day: add_day }, { send_count: send_count, add_time });
            // 发送验证码 保存验证
            // this.toolsService.sendMsg()         
            req.session.phone_code = phone_code;
         return new ResultData('短信发送成功', {sign, phone, phone_code}, true)
         } else {
         return new ResultData('当前手机号发送短信的次数太多了', {sign, phone}, false)
         }


      } else {
         //发送验证码 保存验证
         // this.toolsService.sendMsg()         
         req.session.phone_code = phone_code;
         this.userTempService.add({
            phone,
            add_day,
            sign,
            ip,
            send_count: 1
         });
         return new ResultData('短信发送成功', {sign, phone, phone_code}, true)

      }


   }
   @Post('doRegister')
   async doRegister(@Body() body, @Request() req) {
      let sign = body.sign;
      let phone_code = body.phone_code;
      let password = body.password;
      let rpassword = body.rpassword;
      let ip = req.ip.replace(/::ffff:/, '');

      //1、判断手机收到的验证码是否正确
      if (req.session.phone_code != phone_code) {
         return new ResultData('验证码不正确', null, false)
      }
      if (password != rpassword) return  new ResultData('两次密码不一致', null, false)
      //2、获取sign对应的手机信息
      let userTempResult = await this.userTempService.find({ "sign": sign });
      if (userTempResult.length > 0) {
         //完成注册

         let userResult = await this.userService.add(
            {
               phone: userTempResult[0].phone,
               password: this.toolsService.getMd5(password),
               last_ip: ip
            }
         );
         //执行登录
         if (userResult) {
            let userInfo = await this.userService.find({ "phone": userTempResult[0].phone }, '_id phone last_ip add_time email status');
            // this.cookieService.set(res, 'userinfo', userInfo[0]);
            return new ResultData('登录成功', userInfo, true)
            // res.redirect('/');
         }

      } else {
            return new ResultData('请重新注册', null, true)
      }


   }

   // //qq登录
   // @Get('qqLogin')
   // qqLogin(@Request() req, @Response() res) {

   //    var qqAppID = '101021562';
   //    var qqAppkey = 'ed7c37aba68da6eb9390952feff220e3';
   //    var qqRedirect_uri = 'http://www.qianbao.com/pass/qqCallBack';

   //    var authorization = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + qqAppID + '&redirect_uri=' + urlencode(qqRedirect_uri) + '&state=233&scope=get_user_info,get_vip_info,get_vip_rich_info';
   //    res.redirect(authorization);

   // }

   // //qq登录回调 获取用户信息
   // @Get('qqCallBack')
   // qqCallBack(@Request() req, @Response() res) {
   //    var qqAppID = '101021562';
   //    var qqAppkey = 'ed7c37aba68da6eb9390952feff220e3';
   //    var qqRedirect_uri = 'http://www.qianbao.com/pass/qqCallBack';

   //    //拿到code
   //    var code = req.query.code;
   //    //获取token
   //    var getTokenUrl = 'https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=' + qqAppID + '&client_secret=' + qqAppkey + '&code=' + code + '&redirect_uri=' + urlencode(qqRedirect_uri);
   //    // res.send(getTokenUrl);
   //    request.get({ url: getTokenUrl }, function (err, httpResponse, body) {

   //       var str = body;
   //       var access_token = str.split('=')[1].split('&')[0];
   //       //获取用户openid
   //       var getMeUrl = 'https://graph.qq.com/oauth2.0/me?access_token=' + access_token;
   //       request.get({ url: getMeUrl }, function (err, httpResponse, body) {
   //          //QQ返回的是字符串，不是json，也不能直接转json，日了狗
   //          var str = body;
   //          var jsonStr = str.replace('callback( ', '');
   //          jsonStr = jsonStr.replace(' );', '');
   //          jsonStr = JSON.parse(jsonStr);
   //          var qqOpenid = jsonStr['openid'];
   //          var qqClient_id = jsonStr['client_id'];
   //          //拿到两个参数以后去获取用户资料
   //          request.get({ url: 'https://graph.qq.com/user/get_user_info?access_token=' + urlencode(access_token) + '&oauth_consumer_key=' + urlencode(qqAppID) + '&openid=' + urlencode(qqOpenid) }, function (err, httpResponse, body) {
   //             body = JSON.parse(body);
   //             //qqOpenid每个用户是唯一的
   //             res.send("\
   //                  <h1>QQ昵称："+ body.nickname + "openid:" + qqOpenid + "</h1>\
   //                  <p>![]("+ body.figureurl_qq_1 + ")</p>\
   //                  <p>性别："+ body.gender + "</p>\
   //                  <p>地区："+ body.province + "," + body.city + "</p>\
   //              ");
   //          })
   //       })
   //    })

   // }

   // //微信登录
   // @Get('wxLogin')
   // wxLogin(@Request() req, @Response() res) {

   //    var AppID = 'wx813101a6e424e076';
   //    var AppSecret = '99e52c8c0f926156547bca266f53e6b6';
   //    // 第一步：用户同意授权，获取code    
   //    // 这是编码后的地址
   //    var return_uri = urlencode('http://open.itying.com/pass/wxCallBack');
   //    var scope = 'snsapi_login';
   //    res.redirect("https://open.weixin.qq.com/connect/qrconnect?appid=" + AppID + "&redirect_uri=" + return_uri + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect")

   // }

   // //微信登录
   // @Get('wxCallBack')
   // wxCallBack(@Request() req, @Response() res) {
   //    var AppID = 'wx813101a6e424e076';
   //    var AppSecret = '99e52c8c0f926156547bca266f53e6b6';

   //    // 第二步：通过code换取网页授权access_token
   //    var code = req.query.code;
   //    request.get(
   //       {
   //          url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=authorization_code',
   //       },
   //       function (error, response, body) {
   //          if (response.statusCode == 200) {
   //             // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
   //             var data = JSON.parse(body);
   //             var access_token = data.access_token;
   //             var openid = data.openid;
   //             request.get(
   //                {
   //                   url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
   //                },
   //                function (error, response, body) {
   //                   if (response.statusCode == 200) {
   //                      // 第四步：根据获取的用户信息进行对应操作
   //                      var userinfo = JSON.parse(body);
   //                      //其实，到这就写完了，你应该拿到微信信息以后去干该干的事情，比如对比数据库该用户有没有关联过你们的数据库，如果没有就让用户关联....等等等...
   //                      // 小测试，实际应用中，可以由此创建一个帐户
   //                      res.send("\
   //                              <h1>"+ userinfo.nickname + " 的个人信息</h1>\
   //                              <p><img src='"+ userinfo.headimgurl + "' /></p>\
   //                              <p>"+ userinfo.city + "，" + userinfo.province + "，" + userinfo.country + "</p>\
   //                              <p>openid: "+ userinfo.openid + "</p>\
   //                          ");
   //                   } else {
   //                   }
   //                }
   //             );
   //          } else {
   //          }
   //       }
   //    )

   // }

 
}

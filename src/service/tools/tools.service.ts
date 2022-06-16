import { Injectable } from '@nestjs/common';

//引入验证码库
import * as svgCaptcha from 'svg-captcha';

//md5加密
import * as md5 from 'md5';
//格式化日期
import {
    format
} from 'silly-datetime';

import * as https from 'https';
import * as qs from 'querystring';
import { join, extname } from 'path';

import { Config } from '../../config/config';

//创建目录
import * as mkdirp from 'mkdirp';

import { createWriteStream } from 'fs';

@Injectable()
export class ToolsService {
    getCaptcha(size?: number, width?: number, height?: number) {
        let captcha = svgCaptcha.create({
            size: size || 4,
            fontSize: 50,
            width: width || 100,
            height: height || 34,
            background: "#cc9966"
        });
        return captcha;
    }
    getMd5(str: string) {
        return md5(str);
    }

    
    getRandomNum() {
        var random_str = '';
        for (var i = 0; i < 4; i++) {
            random_str += Math.floor(Math.random() * 10);
        }
        return random_str;
    }


    async success(res, redirectUrl) {
        await res.render('admin/public/success', {
            redirectUrl: redirectUrl
        })
    }
    async error(res, message, redirectUrl) {
        await res.render('admin/public/error', {
            message: message,
            redirectUrl: redirectUrl
        })
    }
    getTime() {

        let d = new Date();
        return d.getTime();
    }
    
    getDay() { 
        var day = format(new Date(), 'YYYYMMDD'); 
        return day; 
    }

    uploadFile(file) {

        /*
          1、获取当前日期   20191013
          2、根据日期创建目录
          3、实现上传
          4、返回图片保存的地址
          
        */
        if (file) {

            // 1、获取当前日期   20191013
            let day = format(new Date(), 'YYYYMMDD');  //目录名称

            let d = this.getTime();  //时间戳  当前图片的名称


            // 2、根据日期创建目录

            let dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);

            mkdirp.sync(dir);

            let uploadDir = join(dir, d + extname(file.originalname));

            // 3、实现上传

            const writeImage = createWriteStream(uploadDir);
            writeImage.write(file.buffer);

            // 4、返回图片保存的地址

            let saveDir = join(Config.uploadDir, day, d + extname(file.originalname));

            return saveDir;

        }else{
            return '';
        }



    }

    getOrderId(){
        //订单如何生成  
        var nowTime=this.getTime();     
        var randomNum=this.getRandomNum();
        return nowTime.toString()+randomNum.toString();  
    }

    //发送短信

    sendMsg() {
        var apikey = "62c24eexxxxxxxxxxxxxa9e0a";
        // 修改为您要发送的手机号码，多个号码用逗号隔开
        var mobile = "150XXXxxx801";
        // 修改为您要发送的短信内容
        var text = "【IT营】您的验证码是145678";
        // // 指定发送的模板编号
        // var tpl_id = 1;
        // // 指定发送模板的内容
        // var tpl_value = { "#code#": "1234", "#company#": "yunpian" };


        // 语音短信的内容
        var code = "666111";
        // 查询账户信息https地址
        var get_user_info_uri = "/v2/user/get.json";
        // 智能匹配模板发送https地址
        var sms_host = "sms.yunpian.com";
        var voice_host = "voice.yunpian.com";

        var send_sms_uri = "/v2/sms/single_send.json";
        // 指定模板发送接口https地址
        var send_tpl_sms_uri = "/v2/sms/tpl_single_send.json";
        // 发送语音验证码接口https地址
        var send_voice_uri = "/v2/voice/send.json";

        query_user_info(get_user_info_uri, apikey);

        //send_sms(send_sms_uri, apikey, mobile, text);

        //send_tpl_sms(send_tpl_sms_uri, apikey, mobile, tpl_id, tpl_value);

        send_voice_sms(send_voice_uri, apikey, mobile, code);


        function query_user_info(uri, apikey) {
            var post_data = {
                apikey: apikey
            }; //这是需要提交的数据
            var content = qs.stringify(post_data);
            post(uri, content, sms_host);
        }

        function send_sms(uri, apikey, mobile, text) {
            var post_data = {
                apikey: apikey,
                mobile: mobile,
                text: text
            }; //这是需要提交的数据
            var content = qs.stringify(post_data);
            post(uri, content, sms_host);
        }

        function send_tpl_sms(uri, apikey, mobile, tpl_id, tpl_value) {
            var post_data = {
                apikey: apikey,
                mobile: mobile,
                tpl_id: tpl_id,
                tpl_value: qs.stringify(tpl_value)
            }; //这是需要提交的数据
            var content = qs.stringify(post_data);
            post(uri, content, sms_host);
        }
        function send_voice_sms(uri, apikey, mobile, code) {
            var post_data = {
                apikey: apikey,
                mobile: mobile,
                code: code
            }; //这是需要提交的数据
            var content = qs.stringify(post_data);
            console.log(content);
            post(uri, content, voice_host);
        }
        function post(uri, content, host) {
            var options = {
                hostname: host,
                port: 443,
                path: uri,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            };
            var req = https.request(options, function (res) {
                // console.log('STATUS: ' + res.statusCode);
                // console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding("utf8");
                res.on("data", function (chunk) {
                    console.log("BODY: " + chunk);
                });
            });
            //console.log(content);
            req.write(content);

            req.end();
        }
    }
}

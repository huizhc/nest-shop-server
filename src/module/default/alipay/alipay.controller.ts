import { Controller, Get, Response, Request, Post } from '@nestjs/common';

// express-xml-bodyparser
import * as Alipay from "alipay-mobile";

@Controller('alipay')
export class AlipayController {
    @Get()
    async index(@Response() res) {

        const alipayOptions = {
            //Appid
            app_id: '2021001144694156',  
            //应用私钥  工具生成的
            appPrivKeyFile: "MIIEowIBAAKCAQEAmZlUXdYU5qhpSe7bmv+NAEQehXq2wkV2pAhr9zU2fKJSB77V1Z9079SYTs0yGX3XpGKqVYVGZu6F3js9QX1/PPfELHrxOa4mHXQz+TryniXx1e1ng4kDedy1SyS8xTBeGCvReIqAtMUeAo/hedgvdtgYEvY5hZqbV7b3zEpEkq/XgvgaH5nmYR/fDnocwQt5OpDlXNGMrfhU4g0nvQHzb8Kcd2YSjkDB37o/yV9i0Wq8vJqPdWCJOGxCOafy1Qt1VfPF6s9h/9V8mWTGrMGyaUUgz/0ILdlt/bHzRSR9K5qa0x9mEfnGZRj14x3WGIlNfSmS88a4wR0iXP+UtEASXwIDAQABAoIBABoUDV3tNhk/aLjzw/daAh+UcTYqcpMjZhRNlb8gGsMocBL+lKGzdBAwITfn4OSxGAbB9beVbDGXt8TWe/z9iLfaPUVsDj7D0ZbYnuZm2sB9IsU2jIepoJx1G5bJgv9bye4CqorzwQxwFztKIHcmfFCKOfQmN/f2Gv/WgdX+mgvpaNPfHn3gnnNpmhq2Mb8QiNhLvPMhKXORk08a2xGLUEO43Iw7YSg8lZ4L6So/ROSPCtyErAgVTxAkfKoFyJAaHykKPeeLt9Zy5aPndmizIWwCMXb0+Zq7bDmKS3yvq8Nr95ZjOc09GD1nit2vWLCPJxNc2lzkSBxIAmDmXta0+LECgYEA6LMl02AgB47zxXfvhDSpW3SABrzU8GyOnZjcYdf2cZkDtgx0QE3g5E2YeWFcSny3+x3ug6nVjjIscZaBap3DxwMft2PrGX7Bfmecg3hJ+TF7KLFuAkmG+qqzkPeox9YTs/aRBRVBu9oo+Io44HqryIoehCpX59+CjqznhLEX8FcCgYEAqPqR3wJPI38XqGLKoxpI20l99rGD/mj2J3PvFXGtti3e5ZB4irsxO8U38vHEw/2kEXEJZW+2trS486pXaKE8JfrRItjaCUbgUSO+3lCpdkl9gXfimEr0xD2zPf92aAcxqQiG65I+k2Ch5ba2YmteTGi55SB6FuEAvHtGhRf7iTkCgYEAlFQ1pVJduFOwIcx8uaoT1j8hqKnPll2sXtrkh93wsqKV0gKIS8EYvI6VxbGA8d4kLIb81aJ5hUWIPPNyFTLxa7cbDXw8jSjWUCvdgZQ4mwamed73v698weXzxlGHnbJhJtLhx/qvxv2eJid9b+HiBFe+cgLHu/8mKqoefd+g4csCgYAAsOWfz9abAo4KNj015Ymeu/Iz7A3qIGvBRYwYvlpDgHSE485aYuGUqP3NlIeFdagSGjA7pfVNUfffpzasStyAG0J3rgNWPl/0dPz208WdojdNLDxU+xl9I/NzsXO+gSkG0+4ZUIPI/oAq/FBKnr3H+jWoZjWZmlnya16idLKmoQKBgEU5tCv8klIdPLwHu0UOrMWtbPnWABzCu2eJdova0zJblHE5KTgu3U2td/wEfiDJVYpnK3XSZkxhjJWKxxtWSQwUjZwK00pc2J/wxW1wPq7uXI0/jiJT/C4BDwDor20wMm8hqOgdCxPT1yIbD25WUF7QVRBUuX/wQHJfdrsPKzUe",
            //支付宝公钥  用工具生成的应用公钥换取的支付公钥
            alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
        }

        
        const service = new Alipay(alipayOptions);

        var randStr = Math.floor(Math.random() * 1000);
        const data = {
            subject: 'nest小米支付测试1111',
            out_trade_no: '123456' + randStr,  //订单号
            total_amount: '0.2'
        }

        const basicParams = {
            return_url: "http://pay.apiying.com/alipay/alipayReturn", //返回地址
            notify_url: 'http://pay.apiying.com/alipay/alipayNotify' //支付成功异步通知地址
        }
        const result = await service.createPageOrderURL(data, basicParams)

        console.log(result);
        res.redirect(result.data);

    }

    @Get("alipayReturn")
    async order() {
        return "执行 alipayReturn 跳转到订单页面"
    }

    @Post("alipayNotify")
    async alipayNotify(@Request() req) {      
        var params = req.body;    //接收 post 提交的 XML    
        const alipayOptions = {
            //Appid
            app_id: '2021001144694156',  
            //应用私钥  工具生成的
            appPrivKeyFile: "MIIEowIBAAKCAQEAmZlUXdYU5qhpSe7bmv+NAEQehXq2wkV2pAhr9zU2fKJSB77V1Z9079SYTs0yGX3XpGKqVYVGZu6F3js9QX1/PPfELHrxOa4mHXQz+TryniXx1e1ng4kDedy1SyS8xTBeGCvReIqAtMUeAo/hedgvdtgYEvY5hZqbV7b3zEpEkq/XgvgaH5nmYR/fDnocwQt5OpDlXNGMrfhU4g0nvQHzb8Kcd2YSjkDB37o/yV9i0Wq8vJqPdWCJOGxCOafy1Qt1VfPF6s9h/9V8mWTGrMGyaUUgz/0ILdlt/bHzRSR9K5qa0x9mEfnGZRj14x3WGIlNfSmS88a4wR0iXP+UtEASXwIDAQABAoIBABoUDV3tNhk/aLjzw/daAh+UcTYqcpMjZhRNlb8gGsMocBL+lKGzdBAwITfn4OSxGAbB9beVbDGXt8TWe/z9iLfaPUVsDj7D0ZbYnuZm2sB9IsU2jIepoJx1G5bJgv9bye4CqorzwQxwFztKIHcmfFCKOfQmN/f2Gv/WgdX+mgvpaNPfHn3gnnNpmhq2Mb8QiNhLvPMhKXORk08a2xGLUEO43Iw7YSg8lZ4L6So/ROSPCtyErAgVTxAkfKoFyJAaHykKPeeLt9Zy5aPndmizIWwCMXb0+Zq7bDmKS3yvq8Nr95ZjOc09GD1nit2vWLCPJxNc2lzkSBxIAmDmXta0+LECgYEA6LMl02AgB47zxXfvhDSpW3SABrzU8GyOnZjcYdf2cZkDtgx0QE3g5E2YeWFcSny3+x3ug6nVjjIscZaBap3DxwMft2PrGX7Bfmecg3hJ+TF7KLFuAkmG+qqzkPeox9YTs/aRBRVBu9oo+Io44HqryIoehCpX59+CjqznhLEX8FcCgYEAqPqR3wJPI38XqGLKoxpI20l99rGD/mj2J3PvFXGtti3e5ZB4irsxO8U38vHEw/2kEXEJZW+2trS486pXaKE8JfrRItjaCUbgUSO+3lCpdkl9gXfimEr0xD2zPf92aAcxqQiG65I+k2Ch5ba2YmteTGi55SB6FuEAvHtGhRf7iTkCgYEAlFQ1pVJduFOwIcx8uaoT1j8hqKnPll2sXtrkh93wsqKV0gKIS8EYvI6VxbGA8d4kLIb81aJ5hUWIPPNyFTLxa7cbDXw8jSjWUCvdgZQ4mwamed73v698weXzxlGHnbJhJtLhx/qvxv2eJid9b+HiBFe+cgLHu/8mKqoefd+g4csCgYAAsOWfz9abAo4KNj015Ymeu/Iz7A3qIGvBRYwYvlpDgHSE485aYuGUqP3NlIeFdagSGjA7pfVNUfffpzasStyAG0J3rgNWPl/0dPz208WdojdNLDxU+xl9I/NzsXO+gSkG0+4ZUIPI/oAq/FBKnr3H+jWoZjWZmlnya16idLKmoQKBgEU5tCv8klIdPLwHu0UOrMWtbPnWABzCu2eJdova0zJblHE5KTgu3U2td/wEfiDJVYpnK3XSZkxhjJWKxxtWSQwUjZwK00pc2J/wxW1wPq7uXI0/jiJT/C4BDwDor20wMm8hqOgdCxPT1yIbD25WUF7QVRBUuX/wQHJfdrsPKzUe",
            //支付宝公钥  用工具生成的应用公钥换取的支付公钥
            alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
        }

        //实例化 alipay
        var service = new Alipay(alipayOptions);
        var result = await service.makeNotifyResponse(params);
        console.log(result)

        //验证结果是否正确 如果正确执行更新订单操作
    }

}

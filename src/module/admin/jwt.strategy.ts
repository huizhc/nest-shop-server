// src/modules/user/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dasdjanksjdasd',
    });
  }
  
  async validate(payload: any) {
    return { 
      id: payload.id,
    //   status: payload.status,
    //   add_time: payload.add_time,
      username: payload.username,
    //   mobile: payload.mobile,
    //   email: payload.email,
    //   role_id: payload.role_id,
    //   is_super: payload.is_super,
    };
  }
}

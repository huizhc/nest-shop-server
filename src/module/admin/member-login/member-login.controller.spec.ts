import { Test, TestingModule } from '@nestjs/testing';
import { MemberLoginController } from './member-login.controller';

describe('MemberLoginController', () => {
  let controller: MemberLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberLoginController],
    }).compile();

    controller = module.get<MemberLoginController>(MemberLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NavController } from './nav.controller';

describe('Nav Controller', () => {
  let controller: NavController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NavController],
    }).compile();

    controller = module.get<NavController>(NavController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CartMockService } from './cart.mock.service';

describe('CartService', () => {
  let service: CartMockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartMockService],
    }).compile();

    service = module.get<CartMockService>(CartMockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

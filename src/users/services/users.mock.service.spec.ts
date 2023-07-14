import { Test, TestingModule } from '@nestjs/testing';
import { UsersMockService } from './users.mock.service';

describe('UsersMockService', () => {
  let service: UsersMockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersMockService],
    }).compile();

    service = module.get<UsersMockService>(UsersMockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

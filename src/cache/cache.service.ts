import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get(key: string) {
    return await this.cacheManager.get(key);
  }
  async set(key: string, value: object) {
    await this.cacheManager.set(key, JSON.stringify(value));
  }
  async del(key: any) {
    await this.cacheManager.del(key);
  }
}

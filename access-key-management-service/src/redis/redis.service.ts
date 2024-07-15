import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: 'localhost', // Replace with your Redis host
            port: 6379,        // Replace with your Redis port
        });
    }

    async set(key: string, value: any, ttl: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        await this.redisClient.set(key, stringValue, 'EX', ttl);
    }

    async get(key: string): Promise<any> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }

    async update(key: string, value: any, ttl: number): Promise<void> {
        const exists = await this.redisClient.exists(key);
        if (!exists) {
            return;
            //throw new Error(`Key ${key} does not exist`);
        }
        const stringValue = JSON.stringify(value);
        await this.redisClient.set(key, stringValue, 'EX', ttl);
    }

    async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
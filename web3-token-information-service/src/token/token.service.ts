import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokenService {


    private readonly logger = new Logger(TokenService.name);
    constructor(
        private readonly redisService: RedisService
    ) { }

    async getTokenInfo(userKey: string) {
        try {
            const keyDetails = await this.redisService.get(userKey);
            this.logger.log("keyDetails->", keyDetails);
            if (!keyDetails || keyDetails.expiration < new Date()) {
                throw new HttpException('Invalid or expired key', HttpStatus.UNAUTHORIZED);
            }
            const rateLimit = keyDetails.rateLimit; // Rate limit from the key
            const userId = keyDetails.userId; // You may need userId for Redis key

            const requestCountKey = `rate_limit:${userId}:${userKey}`;

            // Check current request count
            const currentCount = await this.redisService.get(requestCountKey);

            if (currentCount && parseInt(currentCount) >= rateLimit) {
                throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
            }

            // Increment request count
            await this.redisService.multi([
                { command: 'incr', args: [requestCountKey] },
                { command: 'expire', args: [requestCountKey, 60] }, // Set expiration time for key (1 minute)
            ]);

            return await this.getTokenData(); // Returns mock token data since we can get the token data after validation from a third party api
        } catch (err) {
            this.logger.error(`Token fetch and validation went wrong!`, err);
            throw new HttpException('Error in fetching Token!', HttpStatus.BAD_REQUEST);
        }
    }


    async getTokenData() {
        return {
            "userId": "1234",
            "key": "1234",
            "rateLimit": 2,
            "expiration": "2024-07-15T00:00:00.000Z",
            "token": "token_info"
        }
    }
}

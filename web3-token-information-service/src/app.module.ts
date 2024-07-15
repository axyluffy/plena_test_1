import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';

@Module({
  imports: [RedisModule],
  controllers: [AppController, TokenController],
  providers: [AppService, TokenService],
})
export class AppModule { }

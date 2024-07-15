import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeySchema } from './model/key.entity';
import { KeyController } from './key/key.controller';
import { KeyService } from './key/key.service';

import * as dotenv from 'dotenv';
import { RedisModule } from './redis/redis.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {

    }),
    MongooseModule.forFeature([{ name: 'Key', schema: KeySchema }]),
    RedisModule
  ],
  controllers: [AppController, KeyController],
  providers: [AppService, KeyService],
})
export class AppModule { }

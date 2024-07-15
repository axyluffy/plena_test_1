import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key } from '../model/key.entity';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class KeyService {
    private readonly logger = new Logger(KeyService.name);
    constructor(
        @InjectModel('Key') private readonly accessKeyModel: Model<Key>,
        private readonly redisService: RedisService
    ) { }

    async create(createKeyDto: CreateKeyDto): Promise<Key> {
        try {
            const newKey = new this.accessKeyModel(createKeyDto);
            newKey.save();
            this.logger.log(`new key added into the database!, ${newKey}`);
            const ttl = Math.floor((new Date(createKeyDto.expiration).getTime() - Date.now()) / 1000); //ttl in seconds
            await this.redisService.set(createKeyDto.key, createKeyDto, ttl);
            this.logger.log(`new key added to the redis server!, ${newKey}`);
            return newKey;
        } catch (err) {
            this.logger.error(`Create key error - something went wrong`, err);
        }
    }

    async update(key: string, updateKeyDto: UpdateKeyDto): Promise<Key> {
        try {
            const keyFromDb = await this.accessKeyModel.findOne({ key });
            const newKey = {
                userId: keyFromDb.userId,
                key: updateKeyDto.key ? updateKeyDto.key : keyFromDb.key,
                rateLimit: updateKeyDto.rateLimit ? updateKeyDto.rateLimit : keyFromDb.rateLimit,
                expiration: updateKeyDto.expiration ? updateKeyDto.expiration : keyFromDb.expiration,
                isActive: updateKeyDto.isActive
            }
            const updated = await this.accessKeyModel.findOneAndUpdate({ key }, updateKeyDto, { new: true });
            this.logger.log(`key updated into the database!, ${newKey}`);
            const ttl = Math.floor((new Date(newKey.expiration).getTime() - Date.now()) / 1000); //ttl in seconds
            await this.redisService.update(newKey.key, newKey, ttl);
            this.logger.log(`key added to the redis server!, ${newKey}`);
            return updated;
        } catch (err) {
            this.logger.error(`Update key error - something went wrong`, err);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redisService.delete(key);
            await this.accessKeyModel.deleteOne({ key });
        } catch (err) {
            this.logger.error(`Delete key error - something went wrong`, err);
        }
    }

    async findOne(key: string): Promise<Key> {
        try {
            return this.accessKeyModel.findOne({ key });
        } catch (err) {
            this.logger.error(`Get key error - something went wrong`, err);
        }
    }

    async findAll(): Promise<Key[]> {
        try {
            const allKeys = await this.accessKeyModel.find({ isActive: true });
            return allKeys;
        } catch (err) {
            this.logger.error(`Get All key error - something went wrong`, err);
            throw new Error('Could not retrieve keys');
        }
    }

    async changeState(key: string): Promise<Key> {
        try {
            const keyFromDb = await this.accessKeyModel.findOne({ key });
            const newKey = {
                userId: keyFromDb.userId,
                key: keyFromDb.key,
                rateLimit: keyFromDb.rateLimit,
                expiration: keyFromDb.expiration,
                isActive: false
            }
            const ttl = Math.floor((new Date(newKey.expiration).getTime() - Date.now()) / 1000); //ttl in seconds
            await this.redisService.update(key, newKey, ttl);
            return this.accessKeyModel.findOneAndUpdate({ key }, { isActive: false }, { new: true });
        } catch (err) {
            this.logger.error(`Change State key error - something went wrong`, err);
        }
    }
}

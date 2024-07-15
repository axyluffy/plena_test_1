import { Controller, Post, Body, Patch, Delete, Param, Get } from '@nestjs/common';
import { KeyService } from '../key/key.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('key')
export class KeyController {
    constructor(private readonly accessKeyService: KeyService) { }

    @Post()
    create(@Body() createKeyDto: CreateKeyDto) {
        return this.accessKeyService.create(createKeyDto);
    }

    @Patch(':key')
    update(@Param('key') key: string, @Body() updateKeyDto: UpdateKeyDto) {
        return this.accessKeyService.update(key, updateKeyDto);
    }

    @Delete(':key')
    delete(@Param('key') key: string) {
        return this.accessKeyService.delete(key);
    }

    @Get(':key')
    findOne(@Param('key') key: string) {
        return this.accessKeyService.findOne(key);
    }

    @Get('')
    findAll() {
        return this.accessKeyService.findAll();
    }

    @Patch('/change-state/:key')
    updateState(@Param('key') key: string) {
        return this.accessKeyService.changeState(key);
    }
}

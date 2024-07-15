import { Controller, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Get(':key')
    findOne(@Param('key') key: string) {
        return this.tokenService.getTokenInfo(key);
    }
}

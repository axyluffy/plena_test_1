import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

require('dotenv').config();

class ConfigService {

    private readonly logger = new Logger(ConfigService.name);

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            this.logger.error(`Config error - missing env.${key}`);
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode !== 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        const isProduction = this.isProduction();

        return {
            type: 'postgres',

            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            //username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),

            entities: ['**/*.entity{.ts,.js}'],

            migrationsTableName: 'migration',

            migrations: ['src/migration/*.ts'],

            // cli: {
            //     migrationsDir: 'src/migration',
            // },

            ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        //'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
        'MODE'
    ]);

export { configService };
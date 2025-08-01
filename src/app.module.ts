import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SharedModule } from './shared/shared.module';
import { ReportsModule } from './domain/reports/reports.module';

import { ProductsModule } from './domain/products/products.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_configService: ConfigService) => ({
        type: 'postgres',
        host: _configService.get('DATABASE_HOST'),
        port: _configService.get<number>('DATABASE_PORT'),
        username: _configService.get('DATABASE_USER'),
        password: _configService.get('DATABASE_PASSWORD'),
        database: _configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // switch to false in production!
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ProductsModule,
    ReportsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

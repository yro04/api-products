import { Module } from '@nestjs/common';
import { ReportsController } from './controller/reports.controller';
import { ReportsService } from './service/report.service';
import { ProductsModule } from '../products/products.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [ProductsModule, SharedModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

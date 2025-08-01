import { Module } from '@nestjs/common';
import { ContentfulModule } from './services/contentful/contentful.module';
import { AuthModule } from './services/auth/auth.module';

@Module({
  imports: [ContentfulModule, AuthModule],
  providers: [],
  controllers: [],
  exports: [ContentfulModule, AuthModule],
})
export class SharedModule {}

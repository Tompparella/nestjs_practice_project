import cookieSession from 'cookie-session';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users';
import { User, UserProfiling, Profile } from './users/entities';
import { InstitutionsModule } from './institutions';
import {
  University,
  Guild,
  InstitutionProfiling,
  Institution,
} from './institutions/entities';
import { ContentModule } from './content';
import { Content, ContentProfiling } from './content/entities';
import { Profiling, Tag } from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        synchronize: process.env.NODE_ENV !== 'production',
        entities: [
          User,
          Profile,
          Profiling,
          UserProfiling,
          ContentProfiling,
          InstitutionProfiling,
          Institution,
          University,
          Guild,
          Tag,
          Content,
        ],
        cache: true,
      }),
    }),
    UsersModule,
    InstitutionsModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}

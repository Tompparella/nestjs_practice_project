import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users';
import { InstitutionsModule } from './institutions';
import { ContentModule } from './content';
import { University, Guild } from './institutions/entities';
import { Content, ContentProfiling } from './content/entities';
import { User, UserProfiling } from './users/entities';
import { ProfilesModule } from './profiles';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Profile } from './users/entities/profile.entity';
import { Tag } from './common';

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
          UserProfiling,
          ContentProfiling,
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
    ProfilesModule,
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

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { parse } from 'pg-connection-string';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const parsed = parse(process.env.DATABASE_URL!);

    const adapter = new PrismaPg({
      host: parsed.host ?? undefined,
      port: parsed.port ? parseInt(parsed.port) : undefined,
      user: parsed.user ?? undefined,
      password: parsed.password ?? undefined,
      database: parsed.database ?? undefined,
    });
    super({
      adapter,
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

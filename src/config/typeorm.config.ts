import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5492,
  username: 'task-management',
  password: 'task-management',
  database: 'task-management',
  autoLoadEntities: true,
  synchronize: true,
};

import express, { Express } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { LoginModule } from './modules/login/login.module';
import { UsersModule } from './modules/users/users.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { OvertimeModule } from './modules/overtime/overtime.module';
import { VacationsModule } from './modules/vacations/vacations.module';
import { QualityModule } from './modules/quality/quality.module';
import Auth from './middleware/auth';

class AppModule {
  app: Express;

  constructor() {
    this.app = express();
    this.commonMiddleware();
    this.modules();
  }

  private commonMiddleware() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  private modules() {
    this.app.use('/v1/login', new LoginModule().router);
    this.app.use('/v1/users', Auth.user, new UsersModule().router);
    this.app.use('/v1/permissions', Auth.user, new PermissionsModule().router);
    this.app.use('/v1/overtime', Auth.user, new OvertimeModule().router);
    this.app.use('/v1/vacations', Auth.user, new VacationsModule().router);
    this.app.use('/v1/quality', new QualityModule().router);
  }
}

export default new AppModule();

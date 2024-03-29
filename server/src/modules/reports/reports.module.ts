import { Router } from 'express';
import { ReportsController } from './reports.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class ReportsModule {
  public router: Router;
  private controller: ReportsController;

  constructor() {
    this.router = Router();
    this.controller = new ReportsController();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/salary', this.controller.generateSalaryReport);
    this.router.post('/quality', this.controller.generateQualityReport);
    // this.router.get('/tasks', this.controller.myInfo);
  }
}

import { Request, Response } from 'express';
import { ReportsBusiness } from './reports.business';
import { createReadStream, unlink } from 'fs';

export class ReportsController {
  constructor(private business = new ReportsBusiness()) {}

  public generateSalaryReport = async (req: Request, res: Response) => {
    const { employeesIds, year, month } = req.body;

    const { path, filename } = await this.business.generateSalaryPDF(employeesIds, year, month);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    let readStream = createReadStream(path);
    readStream.pipe(res);
    readStream.on('close', () => {
      unlink(path, (err) => {
        if (err) console.log(err);
        console.log('Reporte borrado');
      });
    });
  };
}

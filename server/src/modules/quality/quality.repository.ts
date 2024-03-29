import { Quality, DriverRating } from './quality.model';
import DB from '../../database/database';

export class QualityRepository {
  public async insertVote(vote: Quality): Promise<void> {
    await DB.query('INSERT INTO control_calidad SET ?', vote);
  }

  public async getDriversRating(): Promise<DriverRating[]> {
    const result = await DB.query(
      `SELECT cc.id_empleado
        , SUM(cc.calificacion) AS suma_calificaciones
        , COUNT(cc.id_empleado) AS cantidad_calificaciones
        , e.nombre
        , e.p_apellido
        , e.s_apellido
      FROM control_calidad cc
        INNER JOIN empleados e
        ON cc.id_empleado = e.id
      GROUP BY id_empleado;`,
      ''
    );

    return [...result];
  }

  public async getVotesFromDriver(userId: number): Promise<Quality[]> {
    const result = await DB.query(
      `SELECT id
        , calificacion
        , nombre_cliente
        , comentario
        , fecha
      FROM control_calidad
      WHERE id_empleado = ?`,
      [userId]
    );

    return [...result];
  }

  public async getDrivers() {
    const result = await DB.query(
      `SELECT id
        , CONCAT(nombre, ' ', p_apellido) as nombre
      FROM empleados
      WHERE tipo_empleado = 3 AND activo = 1`,
      ''
    );

    return [...result];
  }

  public async deleteVote(voteId: number) {
    await DB.query('DELETE FROM control_calidad WHERE id = ?;', voteId);
  }

  public async addWarning(data: { id_empleado: number; descripcion: string }) {
    await DB.query('INSERT INTO amonestaciones SET ?;', data);
  }

  public async addCongrat(data: { id_empleado: number; descripcion: string }) {
    await DB.query('INSERT INTO felicitaciones SET ?;', data);
  }

  public getWarnings(): Promise<{ id_empleado: number }[]> {
    return DB.query(
      `SELECT CONCAT(e.nombre, ' ', e.p_apellido) AS empleado, a.id_empleado, a.id, a.fecha, a.descripcion FROM amonestaciones a INNER JOIN empleados e ON a.id_empleado = e.id WHERE a.activo = 1 ORDER BY fecha DESC;`,
      ''
    );
  }

  public getCongrats(): Promise<{ id_empleado: number }[]> {
    return DB.query(
      `SELECT CONCAT(e.nombre, ' ', e.p_apellido) AS empleado, a.id_empleado, a.id, a.fecha, a.descripcion FROM felicitaciones a INNER JOIN empleados e ON a.id_empleado = e.id WHERE a.activo = 1 ORDER BY fecha DESC;`,
      ''
    );
  }
}

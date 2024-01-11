export namespace askDBO {
  export const GET_HISTORIAN = `
  SELECT h.id, h.tag_name, h.date, h.value
  FROM Historian.dbo.Datos h
  WHERE  `;
  export const GET_LOCACION = `SELECT l.id, l.descripcion, l.observacion, l.tipoLocacionId, l.estado FROM BalanceAgua.dbo.Locacion l WHERE `;
  export const GET_EQUIPOS_LOCACION = `SELECT e.id, e.locacionId, e.tagName, e.descripcion 'descEquipo',e.tipoEquipoId, e.tipoFuncionId, e.estado, l.descripcion 'descLoca', l.tipoLocacionId FROM BalanceAgua.dbo.Equipo e, BalanceAgua.dbo.Locacion l WHERE`;
  export const GET_LECTURA_PROMEDIO = `SELECT promedio = AVG(ALL t.value) FROM (SELECT h.id, h.tag_name, h.date, h.value FROM Historian.dbo.Datos h WHERE `;
  export const GET_LOCACIONES_RELACIONADAS = `SELECT * FROM BalanceAgua.dbo.Locaciones_Relacionadas`;
  export const GET_EQUIPOS_RELACIONADAS = `SELECT * FROM BalanceAgua.dbo.Relacion`;
}

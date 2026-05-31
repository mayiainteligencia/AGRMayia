import type { Colaborador, RegistroTurno } from '../../../types/agro.types';

export const camposDisponibles = [
  'Rancho La Joya',
  'Campeche Norte',
  'Invernadero Principal',
];

export const colaboradoresActivos: Colaborador[] = [
  { id: 'C-001', nombre: 'Bruno Hernández',    puesto: 'Agrónomo',          campo: 'Rancho La Joya',       estado: 'activo' },
  { id: 'C-002', nombre: 'Julieta Romero',     puesto: 'Fenología',         campo: 'Rancho La Joya',       estado: 'activo' },
  { id: 'C-003', nombre: 'Susana Vargas',      puesto: 'Empaque / Lab',     campo: 'Invernadero Principal', estado: 'activo' },
  { id: 'C-004', nombre: 'Pablo Ibarra',       puesto: 'Ingeniería',        campo: 'Campeche Norte',       estado: 'activo' },
  { id: 'C-005', nombre: 'Evelyn Cruz',        puesto: 'Plagas',            campo: 'Rancho La Joya',       estado: 'activo' },
  { id: 'C-006', nombre: 'Diana Martínez',     puesto: 'Aduana',            campo: 'Invernadero Principal', estado: 'activo' },
  { id: 'C-007', nombre: 'Sergio Mendoza',     puesto: 'Suelo y Agua',      campo: 'Campeche Norte',       estado: 'activo' },
  { id: 'C-008', nombre: 'Lucía Cosechadora',  puesto: 'Cosechador',        campo: 'Rancho La Joya',       estado: 'activo', tarifaKg: 10, qrId: 'QR-CSCH-014' },
];

export const registrosHoy: RegistroTurno[] = [
  { id: 'RT-1', colaboradorId: 'C-001', colaborador: 'Bruno Hernández', puesto: 'Agrónomo',     campo: 'Rancho La Joya',        horaEntrada: '06:02', verificacionFacial: true, pinVerificado: true, turno: 'matutino',   estado: 'completado' },
  { id: 'RT-2', colaboradorId: 'C-002', colaborador: 'Julieta Romero',  puesto: 'Fenología',    campo: 'Rancho La Joya',        horaEntrada: '06:08', verificacionFacial: true, pinVerificado: true, turno: 'matutino',   estado: 'completado' },
  { id: 'RT-3', colaboradorId: 'C-003', colaborador: 'Susana Vargas',   puesto: 'Empaque / Lab', campo: 'Invernadero Principal', horaEntrada: '06:14', verificacionFacial: true, pinVerificado: true, turno: 'matutino',   estado: 'completado' },
  { id: 'RT-4', colaboradorId: 'C-005', colaborador: 'Evelyn Cruz',     puesto: 'Plagas',       campo: 'Rancho La Joya',        horaEntrada: '06:18', verificacionFacial: true, pinVerificado: true, turno: 'matutino',   estado: 'completado' },
  { id: 'RT-5', colaboradorId: 'C-008', colaborador: 'Lucía Cosechadora', puesto: 'Cosechador', campo: 'Rancho La Joya',        horaEntrada: '06:22', verificacionFacial: true, pinVerificado: false, turno: 'matutino',  estado: 'pendiente' },
  { id: 'RT-6', colaboradorId: 'C-006', colaborador: 'Diana Martínez',  puesto: 'Aduana',       campo: 'Invernadero Principal', horaEntrada: '14:01', verificacionFacial: true, pinVerificado: true, turno: 'vespertino', estado: 'completado' },
];

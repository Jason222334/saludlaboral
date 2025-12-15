export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  rol: Role;
  activo: boolean;
  created_at: string;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Clinica {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  logo_url?: string;
}

export interface Paciente {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F';
  telefono?: string;
  email?: string;
  empresa_id?: number;
  empresa?: Empresa;
}

export interface Empresa {
  id: number;
  ruc: string;
  razon_social: string;
}

export interface Admision {
  id: number;
  paciente: Paciente;
  empresa: Empresa;
  fecha_admision: string;
  motivo: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  total: number;
}

// Agrega esto al final de types/index.ts
export interface HistoriaClinica {
  id: number;
  paciente_id: number;
  medico_id: number;
  fecha_consulta: string | Date;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  usuarios?: { nombre: string; apellido: string }; // El médico
  resultados_examen?: any[];
  historia_clinica_adjuntos?: any[];
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
}
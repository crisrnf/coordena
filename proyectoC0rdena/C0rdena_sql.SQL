-- Tabla de roles
CREATE TABLE Rol (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    permisos TEXT
);

-- Usuarios generales (docentes, coordinadores, directivos, alumnos, cocina)
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    dni VARCHAR(20) UNIQUE,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- Cursos de la institución
CREATE TABLE Curso (
    id_curso INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL, -- ej: "3°B"
    nivel ENUM('Ciclo Básico','Ciclo Superior') NOT NULL
);

-- Relación alumnos con curso (solo alumnos tienen fila acá)
CREATE TABLE Alumno (
    id_alumno INT PRIMARY KEY,
    fecha_nacimiento DATE,
    id_curso INT NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES Usuario(id_usuario), -- alumno es un usuario
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
);

-- Relación docentes con cursos (muchos a muchos)
CREATE TABLE Docente_Curso (
    id_docente INT,
    id_curso INT,
    PRIMARY KEY (id_docente, id_curso),
    FOREIGN KEY (id_docente) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
);

-- Asistencias
CREATE TABLE Asistencia (
    id_asistencia INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    estado ENUM('Presente','Ausente','Justificado','Llegó tarde') NOT NULL,
    justificacion VARCHAR(100),
    id_alumno INT NOT NULL,
    marcada_por INT NOT NULL, -- usuario que tomó la asistencia
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno),
    FOREIGN KEY (marcada_por) REFERENCES Usuario(id_usuario)
);

-- Opcional: notificaciones
CREATE TABLE Notificacion (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo VARCHAR(50), -- ej: "ausencia", "inicio_sesion", "comedor"
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Lo ideal es una tabla Asistencia_Log que registre los cambios (antes/después, quién modificó, fecha de modificación).
CREATE TABLE Asistencia_Log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_asistencia INT NOT NULL,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_modificador INT NOT NULL,
    estado_anterior ENUM('Presente','Ausente','Justificado','Llegó tarde'),
    estado_nuevo ENUM('Presente','Ausente','Justificado','Llegó tarde'),
    FOREIGN KEY (id_asistencia) REFERENCES Asistencia(id_asistencia),
    FOREIGN KEY (usuario_modificador) REFERENCES Usuario(id_usuario)
);

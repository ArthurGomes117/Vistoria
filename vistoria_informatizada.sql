CREATE DATABASE IF NOT EXISTS vistoria_informatizada
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vistoria_informatizada;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('ANALISTA', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vistorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_identificador VARCHAR(50) NOT NULL UNIQUE,
    placa VARCHAR(15) NULL,
    modelo VARCHAR(100) NULL,
    ano INT NULL,
    foto_url VARCHAR(255) NULL,
    informacoes_iniciais TEXT,
    descricao TEXT,
    responsavel VARCHAR(100) NOT NULL,
    data_abertura DATE NOT NULL,
    finalizada TINYINT(1) NOT NULL DEFAULT 0,
    usuario_id INT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vistorias_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ocorrencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vistoria_id INT NOT NULL,
    classificacao VARCHAR(100) NOT NULL,
    data_ocorrencia DATETIME NOT NULL,
    descricao TEXT NOT NULL,
    registrado_por INT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ocorrencias_vistoria
        FOREIGN KEY (vistoria_id) REFERENCES vistorias(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ocorrencias_usuario
        FOREIGN KEY (registrado_por) REFERENCES usuarios(id)
        ON DELETE SET NULL
);

INSERT IGNORE INTO usuarios (id, nome, email, senha_hash, perfil) VALUES
(1, 'Arthur Analista', 'analista@vistoria.com', '1234', 'ANALISTA'),
(2, 'Carlos Operador', 'operador@vistoria.com', '1234', 'OPERADOR');

INSERT IGNORE INTO vistorias (
    id, codigo_identificador, placa, modelo, ano, foto_url,
    informacoes_iniciais, descricao, responsavel, data_abertura, finalizada, usuario_id
) VALUES
(1, 'VST-001', 'ABC1D23', 'Honda Civic EXL', 2022, '../imgs/CarroVistoria.png',
 'Veículo entregue com chave reserva e manual.', 'Vistoria periódica de frota.', 'Arthur Analista', '2026-11-27', 0, 1);

INSERT IGNORE INTO ocorrencias (
    id, vistoria_id, classificacao, data_ocorrencia, descricao, registrado_por
) VALUES
(1, 1, 'Funilaria', '2026-11-27 10:30:00', 'Pequeno risco superficial no para-choque traseiro.', 2);

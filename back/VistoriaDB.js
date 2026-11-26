const db = require('./db');

const VistoriaDB = {
    // --- VISTORIAS ---
    getVistorias: function (callback) {
        const sql = 'SELECT * FROM vistorias ORDER BY id DESC';
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    getVistoriaById: function (id, callback) {
        const sql = 'SELECT * FROM vistorias WHERE id = ?';
        db.query(sql, [id], function (err, results) {
            if (err) throw err;
            callback(results[0] || null);
        });
    },

    buscarVistoriasPorFiltro: function (filtro, callback) {
        const termo = `%${filtro}%`;
        const sql = `
            SELECT * FROM vistorias
            WHERE codigo_identificador LIKE ?
               OR placa LIKE ?
               OR modelo LIKE ?
               OR responsavel LIKE ?
            ORDER BY id DESC
        `;
        db.query(sql, [termo, termo, termo, termo], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    saveVistoria: function (vistoria, callback) {
        const sql = `
            INSERT INTO vistorias (
                codigo_identificador, placa, modelo, ano,
                foto_url, informacoes_iniciais,
                descricao, responsavel, data_abertura, finalizada, usuario_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            vistoria.codigo_identificador,
            vistoria.placa || null,
            vistoria.modelo || null,
            vistoria.ano || null,
            vistoria.foto_url || null,
            vistoria.informacoes_iniciais || '',
            vistoria.descricao || '',
            vistoria.responsavel,
            vistoria.data_abertura,
            vistoria.finalizada ? 1 : 0,
            vistoria.usuario_id || null
        ];

        db.query(sql, params, function (err, result) {
            if (err) throw err;
            callback({
                id: result.insertId,
                ...vistoria
            });
        });
    },

    updateVistoria: function (vistoria, callback) {
        const sql = `
            UPDATE vistorias
            SET codigo_identificador = ?,
                placa = ?,
                modelo = ?,
                ano = ?,
                foto_url = ?,
                informacoes_iniciais = ?,
                descricao = ?,
                responsavel = ?,
                data_abertura = ?,
                finalizada = ?
            WHERE id = ?
        `;
        const params = [
            vistoria.codigo_identificador,
            vistoria.placa || null,
            vistoria.modelo || null,
            vistoria.ano || null,
            vistoria.foto_url || null,
            vistoria.informacoes_iniciais || '',
            vistoria.descricao || '',
            vistoria.responsavel,
            vistoria.data_abertura,
            vistoria.finalizada ? 1 : 0,
            vistoria.id
        ];

        db.query(sql, params, function (err, result) {
            if (err) throw err;
            callback(vistoria);
        });
    },

    deleteVistoriaById: function (id, callback) {
        const sql = 'DELETE FROM vistorias WHERE id = ?';
        db.query(sql, [id], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows);
        });
    },


    getOcorrencias: function (callback) {
        const sql = `
            SELECT o.*, v.codigo_identificador, v.placa, v.modelo
            FROM ocorrencias o
            INNER JOIN vistorias v ON o.vistoria_id = v.id
            ORDER BY o.data_ocorrencia DESC
        `;
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    getOcorrenciasByVistoriaId: function (vistoriaId, callback) {
        const sql = 'SELECT * FROM ocorrencias WHERE vistoria_id = ? ORDER BY data_ocorrencia DESC';
        db.query(sql, [vistoriaId], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    saveOcorrencia: function (ocorrencia, callback) {
        const sql = `
            INSERT INTO ocorrencias (
                vistoria_id, classificacao, data_ocorrencia, descricao, registrado_por
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            ocorrencia.vistoria_id,
            ocorrencia.classificacao,
            ocorrencia.data_ocorrencia,
            ocorrencia.descricao,
            ocorrencia.registrado_por || null
        ];

        db.query(sql, params, function (err, result) {
            if (err) throw err;
            callback({
                id: result.insertId,
                ...ocorrencia
            });
        });
    },


    saveUsuario: function (usuario, callback) {
        const sql = `
            INSERT INTO usuarios (nome, email, senha_hash, perfil)
            VALUES (?, ?, ?, ?)
        `;
        const params = [
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.perfil
        ];

        db.query(sql, params, function (err, result) {
            if (err) throw err;
            callback({
                id: result.insertId,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            });
        });
    },

    autenticarUsuario: function (email, senha, callback) {
        const sql = `
            SELECT id, nome, email, perfil
            FROM usuarios
            WHERE email = ? AND senha_hash = ?
        `;
        db.query(sql, [email, senha], function (err, results) {
            if (err) throw err;
            callback(results[0] || null);
        });
    }
};

module.exports = VistoriaDB;
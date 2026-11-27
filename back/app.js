const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const VistoriaDB = require('./VistoriaDB');

app.get('/', function (req, res) {
    res.send('API Vistoria Informatizada');
});


app.get('/vistorias', function (req, res) {
    VistoriaDB.getVistorias(function (vistorias) {
        res.json(vistorias);
    });
});

app.get('/vistorias/filtro/:termo', function (req, res) {
    VistoriaDB.buscarVistoriasPorFiltro(req.params.termo, function (vistorias) {
        res.json(vistorias);
    });
});

app.get('/vistorias/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    VistoriaDB.getVistoriaById(id, function (vistoria) {
        if (!vistoria) {
            return res.status(404).json({ erro: 'Vistoria não encontrada' });
        }
        res.json(vistoria);
    });
});

app.post('/vistorias', function (req, res) {
    const vistoria = req.body;
    VistoriaDB.saveVistoria(vistoria, function (vistoriaSalva) {
        res.status(201).json(vistoriaSalva);
    });
});

app.put('/vistorias', function (req, res) {
    const vistoria = req.body;
    if (!vistoria.id) {
        return res.status(400).json({ erro: 'Informe o ID da vistoria' });
    }

    VistoriaDB.updateVistoria(vistoria, function (vistoriaAtualizada) {
        res.json({
            msg: 'Vistoria atualizada com sucesso',
            vistoria: vistoriaAtualizada
        });
    });
});

app.delete('/vistorias/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    VistoriaDB.deleteVistoriaById(id, function (affectedRows) {
        if (affectedRows === 0) {
            return res.status(404).json({ erro: 'Vistoria não encontrada' });
        }
        res.json({ msg: 'Vistoria removida com sucesso' });
    });
});


app.get('/ocorrencias', function (req, res) {
    VistoriaDB.getOcorrencias(function (ocorrencias) {
        res.json(ocorrencias);
    });
});

app.get('/vistorias/:id/ocorrencias', function (req, res) {
    const vistoriaId = parseInt(req.params.id);
    if (isNaN(vistoriaId)) {
        return res.status(400).json({ erro: 'ID de vistoria inválido' });
    }

    VistoriaDB.getOcorrenciasByVistoriaId(vistoriaId, function (ocorrencias) {
        res.json(ocorrencias);
    });
});

app.post('/ocorrencias', function (req, res) {
    const ocorrencia = req.body;
    if (!ocorrencia.vistoria_id || !ocorrencia.classificacao || !ocorrencia.descricao) {
        return res.status(400).json({
            erro: 'Informe vistoria_id, classificacao e descricao'
        });
    }

    VistoriaDB.saveOcorrencia(ocorrencia, function (ocorrenciaSalva) {
        res.status(201).json(ocorrenciaSalva);
    });
});


app.post('/usuarios', function (req, res) {
    const usuario = req.body;
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.perfil) {
        return res.status(400).json({ erro: 'Preencha nome, email, senha e perfil' });
    }

    VistoriaDB.saveUsuario(usuario, function (usuarioSalvo) {
        res.status(201).json(usuarioSalvo);
    });
});

app.post('/login', function (req, res) {
    const { email, senha } = req.body;
    VistoriaDB.autenticarUsuario(email, senha, function (usuario) {
        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
        }
        res.json({
            msg: 'Login realizado com sucesso',
            usuario: usuario
        });
    });
});


const server = app.listen(3000, function () {
    console.log('Servidor iniciado em http://localhost:3000');
});
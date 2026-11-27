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
    VistoriaDB.getVistorias(function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        res.json(resultado);
    });
});

app.get('/vistorias/filtro/:termo', function (req, res) {
    VistoriaDB.buscarVistoriasPorFiltro(req.params.termo, function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        res.json(resultado);
    });
});

app.get('/vistorias/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    VistoriaDB.getVistoriaById(id, function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        if (!resultado) {
            return res.status(404).json({ erro: 'Vistoria não encontrada' });
        }
        res.json(resultado);
    });
});

app.post('/vistorias', function (req, res) {
    const vistoria = req.body;
    if (!vistoria.codigo_identificador || !vistoria.responsavel || !vistoria.data_abertura) {
        return res.status(400).json({
            erro: 'Informe codigo_identificador, responsavel e data_abertura'
        });
    }

    VistoriaDB.saveVistoria(vistoria, function (vistoriaSalva) {
        if (vistoriaSalva && vistoriaSalva.erro) {
            return res.status(400).json({ erro: vistoriaSalva.erro });
        }
        res.status(201).json(vistoriaSalva);
    });
});

app.put('/vistorias', function (req, res) {
    const vistoria = req.body;
    if (!vistoria.id) {
        return res.status(400).json({ erro: 'Informe o ID da vistoria' });
    }
    if (!vistoria.codigo_identificador || !vistoria.responsavel || !vistoria.data_abertura) {
        return res.status(400).json({
            erro: 'Informe codigo_identificador, responsavel e data_abertura'
        });
    }

    VistoriaDB.updateVistoria(vistoria, function (vistoriaAtualizada) {
        if (vistoriaAtualizada && vistoriaAtualizada.erro) {
            return res.status(400).json({ erro: vistoriaAtualizada.erro });
        }
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

    VistoriaDB.deleteVistoriaById(id, function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(400).json({ erro: resultado.erro });
        }
        if (resultado === 0) {
            return res.status(404).json({ erro: 'Vistoria não encontrada' });
        }
        res.json({ msg: 'Vistoria removida com sucesso' });
    });
});

app.get('/ocorrencias', function (req, res) {
    VistoriaDB.getOcorrencias(function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        res.json(resultado);
    });
});

app.get('/vistorias/:id/ocorrencias', function (req, res) {
    const vistoriaId = parseInt(req.params.id);
    if (isNaN(vistoriaId)) {
        return res.status(400).json({ erro: 'ID de vistoria inválido' });
    }

    VistoriaDB.getOcorrenciasByVistoriaId(vistoriaId, function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        res.json(resultado);
    });
});

app.post('/ocorrencias', function (req, res) {
    const ocorrencia = req.body;
    if (
        !ocorrencia.vistoria_id ||
        !ocorrencia.classificacao ||
        !ocorrencia.data_ocorrencia ||
        !ocorrencia.descricao
    ) {
        return res.status(400).json({
            erro: 'Informe vistoria_id, classificacao, data_ocorrencia e descricao'
        });
    }

    VistoriaDB.saveOcorrencia(ocorrencia, function (ocorrenciaSalva) {
        if (ocorrenciaSalva && ocorrenciaSalva.erro) {
            return res.status(400).json({ erro: ocorrenciaSalva.erro });
        }
        res.status(201).json(ocorrenciaSalva);
    });
});

app.post('/usuarios', function (req, res) {
    const usuario = req.body;
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.perfil) {
        return res.status(400).json({ erro: 'Preencha nome, email, senha e perfil' });
    }

    VistoriaDB.saveUsuario(usuario, function (usuarioSalvo) {
        if (usuarioSalvo && usuarioSalvo.erro) {
            return res.status(400).json({ erro: usuarioSalvo.erro });
        }
        res.status(201).json(usuarioSalvo);
    });
});

app.post('/login', function (req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe e-mail e senha' });
    }

    VistoriaDB.autenticarUsuario(email, senha, function (resultado) {
        if (resultado && resultado.erro) {
            return res.status(500).json({ erro: resultado.erro });
        }
        if (!resultado) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
        }
        res.json({
            msg: 'Login realizado com sucesso',
            usuario: resultado
        });
    });
});

const server = app.listen(3000, function () {
    console.log('Servidor iniciado em http://localhost:3000');
});
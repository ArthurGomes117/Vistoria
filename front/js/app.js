import {
    buscarVistoriaPorId,
    salvarVistoria,
    atualizarVistoria
} from "./api.js";

import {
    mostrarMensagem,
    limparFormularioVistoria,
    preencherFormularioVistoria
} from "./ui.js";

import {
    validarVistoria
} from "./validation.js";

import {
    exigirAnalista,
    renderizarBarraUsuario
} from "./auth.js";

let usuarioLogado = null;

window.addEventListener("DOMContentLoaded", async () => {
    usuarioLogado = exigirAnalista();
    if (!usuarioLogado) return;

    renderizarBarraUsuario();

    document.getElementById("btnSalvar").addEventListener("click", salvar);
    document.getElementById("btnNovo").addEventListener("click", limparFormularioVistoria);

    const inputResp = document.getElementById("responsavel");
    if (inputResp && !inputResp.value) {
        inputResp.value = usuarioLogado.nome;
    }

    const params = new URLSearchParams(window.location.search);
    const idEditar = params.get("editar");

    if (idEditar) {
        try {
            const vistoria = await buscarVistoriaPorId(Number(idEditar));
            if (vistoria) {
                preencherFormularioVistoria(vistoria);
            }
        } catch (erro) {
            mostrarMensagem(erro.message, "erro");
        }
    }
});

async function salvar() {
    const id = document.getElementById("id").value;

    const vistoria = {
        codigo_identificador: document.getElementById("codigoIdentificador").value.trim(),
        placa: document.getElementById("placa").value.trim().toUpperCase(),
        modelo: document.getElementById("modelo").value.trim(),
        ano: Number(document.getElementById("ano").value),
        foto_url: document.getElementById("fotoUrl").value.trim(),
        responsavel: document.getElementById("responsavel").value.trim(),
        data_abertura: document.getElementById("dataAbertura").value,
        informacoes_iniciais: document.getElementById("informacoesIniciais").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        finalizada: document.getElementById("finalizada").checked,
        usuario_id: usuarioLogado.id
    };

    const erros = validarVistoria(vistoria);
    if (erros.length > 0) {
        mostrarMensagem(erros.join(" | "), "erro");
        return;
    }

    try {
        if (id) {
            vistoria.id = Number(id);
            await atualizarVistoria(vistoria);
            mostrarMensagem("Vistoria atualizada", "sucesso");
        } else {
            await salvarVistoria(vistoria);
            mostrarMensagem("Vistoria cadastrada", "sucesso");
        }

        limparFormularioVistoria();
        document.getElementById("responsavel").value = usuarioLogado.nome;
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    }
}
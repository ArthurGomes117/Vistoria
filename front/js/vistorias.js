import {
    listarVistorias,
    buscarVistoriasPorFiltro,
    excluirVistoria,
    listarOcorrencias,
    listarOcorrenciasPorVistoria,
    salvarOcorrencia
} from "./api.js";

import {
    mostrarMensagem,
    limparFormularioOcorrencia
} from "./ui.js";

import {
    validarOcorrencia
} from "./validation.js";

import {
    paginate
} from "./pagination.js";

import {
    exigirLogin,
    renderizarBarraUsuario
} from "./auth.js";

let usuarioLogado = null;
let vistorias = [];
let paginaAtual = 1;
const itensPorPagina = 5;

window.addEventListener("DOMContentLoaded", () => {
    usuarioLogado = exigirLogin();
    if (!usuarioLogado) return;

    renderizarBarraUsuario();
    aplicarPermissoesNaTela();

    carregarVistorias();
    carregarHistoricoOcorrencias();

    document.getElementById("btnBuscar").addEventListener("click", pesquisar);
    document.getElementById("btnListarTodos").addEventListener("click", carregarVistorias);
    document.getElementById("btnSalvarOcorrencia").addEventListener("click", registrarOcorrencia);
    document.getElementById("selectVistoriaOcorrencia").addEventListener("change", aoSelecionarVistoria);
});

function aplicarPermissoesNaTela() {
    // Esconde links/botões de criar nova vistoria se não for ANALISTA
    if (usuarioLogado.perfil !== "ANALISTA") {
        document.querySelectorAll('a[href*="Cadastro.html"]').forEach(el => {
            el.style.display = "none";
        });
    }
}

async function carregarVistorias() {
    vistorias = await listarVistorias();
    paginaAtual = 1;
    atualizarSelectVistorias();
    renderizarTabela();
}

function atualizarSelectVistorias() {
    const select = document.getElementById("selectVistoriaOcorrencia");
    const valorAtual = select.value;

    select.innerHTML = `<option value="">Selecione uma vistoria...</option>`;
    vistorias.forEach(v => {
        const statusTag = v.finalizada ? " [FINALIZADA]" : "";
        select.innerHTML += `
            <option value="${v.id}">
                ${v.codigo_identificador} | ${v.placa || ""} - ${v.modelo || ""}${statusTag}
            </option>
        `;
    });

    if (valorAtual) {
        select.value = valorAtual;
    }
}

function renderizarTabela() {
    const tbody = document.getElementById("tbodyVistorias");
    tbody.innerHTML = "";

    const pagina = paginate(vistorias, paginaAtual, itensPorPagina);
    const ehAnalista = usuarioLogado.perfil === "ANALISTA";

    pagina.forEach(v => {
        const statusTexto = v.finalizada ? "Finalizada" : "Em aberto";
        const dataFmt = v.data_abertura ? String(v.data_abertura).slice(0, 10) : "-";
        const fotoHtml = v.foto_url
            ? `<img src="${v.foto_url}" alt="Veículo" style="width:70px;height:45px;object-fit:cover;border-radius:4px;">`
            : "-";
        const veiculoTexto = `${v.modelo || "-"} (${v.ano || "-"})<br><strong>${v.placa || "-"}</strong>`;

        const botoesAnalista = ehAnalista
            ? `
                <button onclick="editarVistoria(${v.id})">Editar</button>
                <button onclick="remover(${v.id})">Excluir</button>
              `
            : "";

        tbody.innerHTML += `
        <tr>
            <td>${v.id}</td>
            <td>${v.codigo_identificador}</td>
            <td>${veiculoTexto}</td>
            <td>${fotoHtml}</td>
            <td>${v.responsavel}</td>
            <td>${dataFmt}</td>
            <td>${v.descricao || "-"}</td>
            <td>${statusTexto}</td>
            <td>
                ${botoesAnalista}
                <button onclick="selecionarParaOcorrencia(${v.id})">+ Ocorrência</button>
            </td>
        </tr>
        `;
    });

    renderizarPaginas();
}

function renderizarPaginas() {
    const qtd = Math.ceil(vistorias.length / itensPorPagina);
    let html = "";

    for (let i = 1; i <= qtd; i++) {
        html += `<button onclick="irPagina(${i})">${i}</button>`;
    }

    document.getElementById("pagination").innerHTML = html;
}

window.irPagina = function (pagina) {
    paginaAtual = pagina;
    renderizarTabela();
};

window.editarVistoria = function (id) {
    if (usuarioLogado.perfil !== "ANALISTA") return;
    window.location.href = `./Cadastro.html?editar=${id}`;
};

window.remover = async function (id) {
    if (usuarioLogado.perfil !== "ANALISTA") return;
    if (!confirm("Deseja excluir esta vistoria?")) return;

    await excluirVistoria(id);
    mostrarMensagem("Vistoria removida", "sucesso");
    carregarVistorias();
    carregarHistoricoOcorrencias();
};

window.selecionarParaOcorrencia = async function (vistoriaId) {
    const select = document.getElementById("selectVistoriaOcorrencia");
    select.value = String(vistoriaId);
    await aoSelecionarVistoria();
    select.scrollIntoView({ behavior: "smooth" });
};

async function pesquisar() {
    const termo = document.getElementById("filtroBusca").value.trim();
    const statusFiltro = document.getElementById("filtroStatus").value;

    let lista = termo
        ? await buscarVistoriasPorFiltro(termo)
        : await listarVistorias();

    if (statusFiltro === "aberta") {
        lista = lista.filter(v => !v.finalizada);
    } else if (statusFiltro === "finalizada") {
        lista = lista.filter(v => Boolean(v.finalizada));
    }

    vistorias = lista;
    paginaAtual = 1;
    renderizarTabela();
}

async function registrarOcorrencia() {
    const vistoriaId = Number(document.getElementById("selectVistoriaOcorrencia").value);
    const vistoriaAlvo = vistorias.find(v => v.id === vistoriaId);

    if (vistoriaAlvo && vistoriaAlvo.finalizada) {
        mostrarMensagem("Não é possível registrar ocorrência em uma vistoria já finalizada", "erro");
        return;
    }

    const ocorrencia = {
        vistoria_id: vistoriaId,
        classificacao: document.getElementById("classificacaoOcorrencia").value.trim(),
        data_ocorrencia: document.getElementById("dataOcorrencia").value,
        descricao: document.getElementById("descricaoOcorrencia").value.trim(),
        registrado_por: usuarioLogado.id
    };

    const erros = validarOcorrencia(ocorrencia);
    if (erros.length > 0) {
        mostrarMensagem(erros.join(" | "), "erro");
        return;
    }

    try {
        await salvarOcorrencia(ocorrencia);
        mostrarMensagem("Ocorrência registrada com sucesso", "sucesso");
        limparFormularioOcorrencia();
        await aoSelecionarVistoria();
        await carregarHistoricoOcorrencias();
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    }
}

async function aoSelecionarVistoria() {
    const vistoriaId = document.getElementById("selectVistoriaOcorrencia").value;
    const ul = document.getElementById("ocorrenciasDaVistoria");
    ul.innerHTML = "";

    if (!vistoriaId) return;

    const lista = await listarOcorrenciasPorVistoria(vistoriaId);
    if (!lista.length) {
        ul.innerHTML = "<li>Nenhuma ocorrência registrada para esta vistoria ainda.</li>";
        return;
    }

    lista.forEach(oc => {
        const dt = String(oc.data_ocorrencia).replace("T", " ").slice(0, 16);
        ul.innerHTML += `<li><strong>[${oc.classificacao}]</strong> (${dt}) — ${oc.descricao}</li>`;
    });
}

async function carregarHistoricoOcorrencias() {
    const tbody = document.getElementById("tbodyHistoricoOcorrencias");
    if (!tbody) return;

    const lista = await listarOcorrencias();
    tbody.innerHTML = "";

    lista.forEach(oc => {
        const dt = String(oc.data_ocorrencia).replace("T", " ").slice(0, 16);
        tbody.innerHTML += `
        <tr>
            <td>${oc.id}</td>
            <td>${oc.codigo_identificador || oc.vistoria_id} (${oc.placa || "-"})</td>
            <td>${oc.classificacao}</td>
            <td>${dt}</td>
            <td>${oc.descricao}</td>
        </tr>
        `;
    });
}
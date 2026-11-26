export function mostrarMensagem(texto, tipo) {
    const div = document.getElementById("mensagem");
    div.className = tipo;
    div.innerText = texto;

    setTimeout(() => {
        div.innerHTML = "";
        div.className = "";
    }, 3000);
}

export function limparFormularioVistoria() {
    document.getElementById("id").value = "";
    document.getElementById("codigoIdentificador").value = "";
    document.getElementById("placa").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("fotoUrl").value = "";
    document.getElementById("responsavel").value = "";
    document.getElementById("dataAbertura").value = "";
    document.getElementById("informacoesIniciais").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("finalizada").checked = false;
}

export function preencherFormularioVistoria(vistoria) {
    document.getElementById("id").value = vistoria.id;
    document.getElementById("codigoIdentificador").value = vistoria.codigo_identificador || "";
    document.getElementById("placa").value = vistoria.placa || "";
    document.getElementById("modelo").value = vistoria.modelo || "";
    document.getElementById("ano").value = vistoria.ano || "";
    document.getElementById("fotoUrl").value = vistoria.foto_url || "";
    document.getElementById("responsavel").value = vistoria.responsavel || "";
    document.getElementById("dataAbertura").value = vistoria.data_abertura
        ? String(vistoria.data_abertura).slice(0, 10)
        : "";
    document.getElementById("informacoesIniciais").value = vistoria.informacoes_iniciais || "";
    document.getElementById("descricao").value = vistoria.descricao || "";
    document.getElementById("finalizada").checked = Boolean(vistoria.finalizada);
}

export function limparFormularioOcorrencia() {
    document.getElementById("classificacaoOcorrencia").value = "";
    document.getElementById("dataOcorrencia").value = "";
    document.getElementById("descricaoOcorrencia").value = "";
}
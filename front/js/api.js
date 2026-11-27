const API_URL = "http://localhost:3000";

async function tratarResposta(response) {
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok || (data && data.erro)) {
        const mensagem = (data && data.erro) || `Erro HTTP ${response.status}`;
        throw new Error(mensagem);
    }

    return data;
}

export async function listarVistorias() {
    const response = await fetch(`${API_URL}/vistorias`);
    return await tratarResposta(response);
}

export async function buscarVistoriaPorId(id) {
    const response = await fetch(`${API_URL}/vistorias/${id}`);
    return await tratarResposta(response);
}

export async function buscarVistoriasPorFiltro(termo) {
    const response = await fetch(`${API_URL}/vistorias/filtro/${encodeURIComponent(termo)}`);
    return await tratarResposta(response);
}

export async function salvarVistoria(vistoria) {
    const response = await fetch(`${API_URL}/vistorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vistoria)
    });
    return await tratarResposta(response);
}

export async function atualizarVistoria(vistoria) {
    const response = await fetch(`${API_URL}/vistorias`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vistoria)
    });
    return await tratarResposta(response);
}

export async function excluirVistoria(id) {
    const response = await fetch(`${API_URL}/vistorias/${id}`, {
        method: "DELETE"
    });
    return await tratarResposta(response);
}

export async function listarOcorrencias() {
    const response = await fetch(`${API_URL}/ocorrencias`);
    return await tratarResposta(response);
}

export async function listarOcorrenciasPorVistoria(vistoriaId) {
    const response = await fetch(`${API_URL}/vistorias/${vistoriaId}/ocorrencias`);
    return await tratarResposta(response);
}

export async function salvarOcorrencia(ocorrencia) {
    const response = await fetch(`${API_URL}/ocorrencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ocorrencia)
    });
    return await tratarResposta(response);
}

export async function cadastrarUsuario(usuario) {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    return await tratarResposta(response);
}

export async function fazerLogin(email, senha) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });
    return await tratarResposta(response);
}
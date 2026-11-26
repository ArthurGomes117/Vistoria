const API_URL = "http://localhost:3000";


export async function listarVistorias() {
    const response = await fetch(`${API_URL}/vistorias`);
    return await response.json();
}

export async function buscarVistoriaPorId(id) {
    const response = await fetch(`${API_URL}/vistorias/${id}`);
    return await response.json();
}

export async function buscarVistoriasPorFiltro(termo) {
    const response = await fetch(`${API_URL}/vistorias/filtro/${encodeURIComponent(termo)}`);
    return await response.json();
}

export async function salvarVistoria(vistoria) {
    const response = await fetch(`${API_URL}/vistorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vistoria)
    });
    return await response.json();
}

export async function atualizarVistoria(vistoria) {
    const response = await fetch(`${API_URL}/vistorias`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vistoria)
    });
    return await response.json();
}

export async function excluirVistoria(id) {
    const response = await fetch(`${API_URL}/vistorias/${id}`, {
        method: "DELETE"
    });
    return await response.json();
}


export async function listarOcorrencias() {
    const response = await fetch(`${API_URL}/ocorrencias`);
    return await response.json();
}

export async function listarOcorrenciasPorVistoria(vistoriaId) {
    const response = await fetch(`${API_URL}/vistorias/${vistoriaId}/ocorrencias`);
    return await response.json();
}

export async function salvarOcorrencia(ocorrencia) {
    const response = await fetch(`${API_URL}/ocorrencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ocorrencia)
    });
    return await response.json();
}


export async function cadastrarUsuario(usuario) {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    return await response.json();
}

export async function fazerLogin(email, senha) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });
    return await response.json();
}
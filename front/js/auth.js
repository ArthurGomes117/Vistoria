const CHAVE_SESSAO = "usuarioVistoria";

export function salvarSessao(usuario) {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
}

export function obterSessao() {
    const raw = sessionStorage.getItem(CHAVE_SESSAO);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function encerrarSessao() {
    sessionStorage.removeItem(CHAVE_SESSAO);
    window.location.href = "./Login.html";
}

export function exigirLogin() {
    const usuario = obterSessao();
    if (!usuario) {
        window.location.href = "./Login.html";
        return null;
    }
    return usuario;
}

export function exigirAnalista() {
    const usuario = exigirLogin();
    if (!usuario) return null;

    if (usuario.perfil !== "ANALISTA") {
        window.location.href = "./Vistorias.html";
        return null;
    }
    return usuario;
}

export function renderizarBarraUsuario() {
    const usuario = obterSessao();
    const header = document.querySelector("header");
    if (!header || !usuario) return;

    const existente = document.getElementById("barraUsuario");
    if (existente) existente.remove();

    const div = document.createElement("div");
    div.id = "barraUsuario";
    div.style.cssText = "display:flex;align-items:center;gap:10px;font-size:14px;";

    const linkCadastro = usuario.perfil === "ANALISTA"
        ? `<a href="./Cadastro.html"><button type="button">Cadastrar Vistoria</button></a>`
        : "";

    div.innerHTML = `
        <span><strong>${usuario.nome}</strong> (${usuario.perfil})</span>
        <a href="./Vistorias.html"><button type="button">Vistorias</button></a>
        ${linkCadastro}
        <button id="btnSairSessao" type="button">Sair</button>
    `;

    header.appendChild(div);
    document.getElementById("btnSairSessao").addEventListener("click", encerrarSessao);
}
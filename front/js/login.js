import { fazerLogin, cadastrarUsuario } from "./api.js";
import { mostrarMensagem } from "./ui.js";
import { salvarSessao } from "./auth.js";

const TECLAS_3X4 = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "*", "0", "#"
];

let alvoTeclado = "login"; // "login" ou "cadastro"

window.addEventListener("DOMContentLoaded", () => {
    renderizarTeclado();

    const inputSenhaLogin = document.getElementById("loginSenha");
    const inputSenhaCad = document.getElementById("cadSenha");

    inputSenhaLogin.addEventListener("focus", () => { alvoTeclado = "login"; });
    inputSenhaCad.addEventListener("focus", () => { alvoTeclado = "cadastro"; });

    // Bloqueia digitação direta no teclado físico em ambos os campos de senha
    [inputSenhaLogin, inputSenhaCad].forEach(input => {
        ["keydown", "keypress", "paste", "drop"].forEach(evento => {
            input.addEventListener(evento, e => e.preventDefault());
        });
    });

    document.getElementById("btnBackspace").addEventListener("click", apagarUltimoCaractere);
    document.getElementById("btnLimparTeclado").addEventListener("click", limparSenhaAlvo);
    document.getElementById("btnToggleSenha").addEventListener("click", alternarVisibilidadeSenha);
    document.getElementById("btnEntrar").addEventListener("click", autenticar);
    document.getElementById("btnCadastrarUsuario").addEventListener("click", criarUsuario);
});

function getInputAlvo() {
    return alvoTeclado === "cadastro"
        ? document.getElementById("cadSenha")
        : document.getElementById("loginSenha");
}

function renderizarTeclado() {
    const container = document.getElementById("tecladoVirtual");
    container.innerHTML = "";

    TECLAS_3X4.forEach(char => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tecla-btn";
        btn.textContent = char;
        btn.addEventListener("click", () => {
            const input = getInputAlvo();
            input.value += char;
        });
        container.appendChild(btn);
    });
}

function apagarUltimoCaractere() {
    const input = getInputAlvo();
    input.value = input.value.slice(0, -1);
}

function limparSenhaAlvo() {
    getInputAlvo().value = "";
}

function alternarVisibilidadeSenha() {
    const input = document.getElementById("loginSenha");
    const btn = document.getElementById("btnToggleSenha");
    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "Ocultar";
    } else {
        input.type = "password";
        btn.textContent = "Ver";
    }
}

async function autenticar() {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    if (!email || !senha) {
        mostrarMensagem("Informe o e-mail e use o teclado virtual para a senha", "erro");
        return;
    }

    try {
        const res = await fazerLogin(email, senha);
        if (res.erro) {
            mostrarMensagem(res.erro, "erro");
            return;
        }

        salvarSessao(res.usuario);
        mostrarMensagem(`Bem-vindo, ${res.usuario.nome}!`, "sucesso");

        setTimeout(() => {
            if (res.usuario.perfil === "ANALISTA") {
                window.location.href = "./Cadastro.html";
            } else {
                window.location.href = "./Vistorias.html";
            }
        }, 600);
    } catch (err) {
        mostrarMensagem("Erro ao conectar com o servidor: " + err.message, "erro");
    }
}

async function criarUsuario() {
    const nome = document.getElementById("cadNome").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value;
    const perfil = document.getElementById("cadPerfil").value;

    if (!nome || !email || !senha || !perfil) {
        mostrarMensagem("Preencha nome, e-mail, senha e perfil", "erro");
        return;
    }

    try {
        const res = await cadastrarUsuario({ nome, email, senha, perfil });
        if (res.erro) {
            mostrarMensagem(res.erro, "erro");
            return;
        }

        mostrarMensagem(`Usuário ${res.nome} (${res.perfil}) cadastrado!`, "sucesso");
        document.getElementById("cadNome").value = "";
        document.getElementById("cadEmail").value = "";
        document.getElementById("cadSenha").value = "";
        alvoTeclado = "login";
    } catch (err) {
        mostrarMensagem("Erro ao cadastrar usuário: " + err.message, "erro");
    }
}
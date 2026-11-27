require('dotenv').config();
const mysql = require('mysql2');

const variaveisObrigatorias = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const faltando = variaveisObrigatorias.filter((chave) => !process.env[chave]);

if (faltando.length > 0) {
    console.error(`Erro: configure o arquivo .env em back/ antes de iniciar. Variáveis ausentes: ${faltando.join(', ')}`);
    process.exit(1);
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;
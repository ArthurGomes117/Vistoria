const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@123Gomes',
    database: 'vistoria_informatizada'
});

connection.connect(function (err) {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;
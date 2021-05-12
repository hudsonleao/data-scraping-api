const mongoose = require('mongoose');
mongoose.connect('mongodb://scraping:12Dwd234cvewfads@localhost:27017/scraping', { useUnifiedTopology: true, useNewUrlParser: true  });

const Servidores = new mongoose.Schema({
    tipo: String,
    cpf: String,
    nomeServidor: String,
    matricula: String,
}, { collection: 'servidores' }
);

module.exports = { Mongoose: mongoose, Servidores: Servidores }
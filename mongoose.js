const mongoose = require('mongoose');
mongoose.connect('mongodb://USERNAME:PASSWORD@cluster0.aw32k.mongodb.net/scraping?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true  });

const Servidores = new mongoose.Schema({
    tipo: String,
    cpf: String,
    nomeServidor: String,
    matricula: String,
}, { collection: 'servidores' }
);

module.exports = { Mongoose: mongoose, Servidores: Servidores }
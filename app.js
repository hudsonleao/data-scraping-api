const express = require('express')
const puppeteer = require('./puppeteer');
const app = express();
const db = require("./mongoose");
const Servidores = db.Mongoose.model('servidores', db.Servidores, 'servidores');

app.use(express.json());
app.get('/', (req, res) => {
    puppeteer();
    res.json({
        message: "Verificação de atualização iniciada com sucesso! Por favor aguarde."
    })
});

app.get('/api', async (req, res) => {

    let { page, limit } = req.query;
    const servidores = await Servidores.find({}, {}, { skip: parseInt(page - 1) || 0, limit: parseInt(limit) || 15 })
    res.json({
        data: servidores
    })
});

app.get('/api/:id', async (req, res) => {

    let { id } = req.params;
    const servidores = await Servidores.findById({ _id: id })
    res.json({
        data: servidores
    })
});

app.listen(3000, () => {
    console.log("Data scraping API inicializada com sucesso!");
    console.log("Acessar: http://localhost:3000/")
})
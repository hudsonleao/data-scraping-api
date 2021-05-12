const express = require('express')
const puppeteer = require('./puppeteer');
const app = express();


app.use(express.json());
app.get('/', (req, res) =>{
    puppeteer();
    res.json({
        message: "Verificação de atualização iniciada com sucesso! Por favor aguarde."
    })
});

app.listen(3000, () => {
    console.log("Data scraping API inicializada com sucesso!")
    console.log('PORTA: 3000')
})
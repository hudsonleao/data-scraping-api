const puppeteer = require('puppeteer');
const db = require("./mongoose");
const Servidores = db.Mongoose.model('servidores', db.Servidores, 'servidores');

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://www.portaltransparencia.gov.br/servidores/orgao');

    await page.waitForSelector('.box-tabela-filtro__lista-botoes');
    await page.evaluate(() => {

        return new Promise(async (resolve) => {
            document.querySelectorAll('.box-tabela-filtro__lista-botoes li > div > button')[1].click();
            setTimeout(() => resolve(document), 500)
        })
    });

    await page.evaluate(async () => {
        return new Promise((resolve) => {
            document.querySelector("#tipo").options[0].selected = true;
            setTimeout(() => resolve(document), 500)
        })
    });

    await page.evaluate(async () => {
        return new Promise((resolve) => {
            document.querySelector(".btn-adicionar").click();
            setTimeout(() => resolve(document), 500)
        })
    });

    await page.evaluate(async () => {
        return new Promise((resolve) => {
            document.querySelector(".btn-filtros-aplicados-consultar").click();
            setTimeout(() => resolve(document), 500)
        })
    });

    let urlsOrgaos = await page.evaluate(async () => {

        let lista = [...document.querySelectorAll("#lista > tbody > tr")];
        let urls = []

        for await (const listaTr of lista) {
            urls.push(listaTr.querySelector('a').href)
        }

        return urls
    });

    for await (const url of urlsOrgaos) {
        await page.goto(url);
        await page.waitForSelector('#lista > tbody > tr');
        await page.evaluate(async () => {
            return new Promise((resolve) => {
                document.querySelector('.botao__gera_paginacao_completa > button').click();
                setTimeout(() => resolve(document), 1000)
            })
        });
        await page.waitForSelector('#lista_info');

        let paginas = await page.evaluate(async () => {
            return new Promise((resolve) => {
                document.querySelector("a[data-dt-idx='7']");
                setTimeout(() => resolve(document.querySelector("a[data-dt-idx='7']").innerHTML), 500)
            })
        });
        for (let i = 0; i < parseInt(paginas); i++) {
            let dados = await page.evaluate(async () => {
                try {
                    let tipos = [...document.querySelectorAll("span[data-original-title='<strong>Tipo</strong>']")];
                    let CPFs = [...document.querySelectorAll("span[data-original-title='<strong>CPF</strong>']")];
                    let nomesServidores = [...document.querySelectorAll("span[data-original-title='<strong>Nome do Servidor</strong>']")];
                    let matriculas = [...document.querySelectorAll("span[data-original-title='<strong>Matrícula</strong>']")];
                    let data = [];
                    for (let y = 0; y < tipos.length; y++) {
                        data.push({
                            tipo: tipos[y].innerText,
                            cpf: CPFs[y].innerText,
                            nomeServidor: nomesServidores[y].innerText,
                            matricula: matriculas[y].innerText,
                        })

                    }
                    await new Promise((resolve) => {
                        document.querySelector("a[data-dt-idx='8']").click()
                        setTimeout(() => resolve(document.querySelector("a[data-dt-idx='7']").innerHTML), 2000)
                    })
                    return data;
                } catch (error) {
                    console.log(error)
                }
            });
            for (const dado of dados) {
                let existeRegistro = await Servidores.findOne(dado);
                if(!existeRegistro)
                await Servidores.create(dado)
            }
        }
       
    }

    await browser.close();
};
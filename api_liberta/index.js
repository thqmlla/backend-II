import cors from 'cors';
import express from 'express';
//import pool from './servico/conexao.js';
import { retornaCampeonatos, retornaCampeonatosID, retornaCampeonatosAno, retornaCampeonatosTime} from './servico/retornaCampeonatos_servico.js';
import { cadastraCampeonato } from './servico/cadastroCampeonato_servico.js';
import { atualizaCampeonato, atualizaCampeonatoParcial } from './servico/atualizaCampeonato_servico.js';

const app = express();
app.use(cors());
app.use(express.json()); // Suporte para JSON no corpo(body) da requisição

app.patch('/campeonatos/:id' , async (req, res) => {
    const {id} = req.params;
    const {campeao, vice, ano} = req.body;

    const camposAtualizar = {}; //{campeao : "flamengo"}
    if(campeao) camposAtualizar.campeao = campeao;
    if(vice) camposAtualizar.vice = vice;
    if(ano) camposAtualizar.ano = ano;

    if(Object.keys(camposAtualizar).length === 0)
    {
        res.status(400).send("Nenhum campo válido foi enviado para atualização");
    } else {
        const resultado = await atualizaCampeonatoParcial(id, camposAtualizar);

        if (resultado.affectedRows > 0) {
            res.status(202).send("Registro foi atualizado com sucesso");
        } else {
            res.status(404).send("Registro não encontrado");
        }
    }
})

app.put('/campeonatos/:id' , async (req, res) => {
    const {id} = req.params; //desestruturação
    const {campeao, vice, ano} = req.body;

    if (campeao == undefined || vice == undefined || ano == undefined) {
        res.status(400).send('Todos os campos devem ser informados')
    } else {
        const resultado = await atualizaCampeonato(id, campeao, vice, ano);
        if (resultado.affectedRows > 0) {
            res.status(202).send('Registro atualizado com sucesso');
        } else {
            res.status(404).send('Registro não encontrado')
        }
    }
})

app.post('/campeonatos', async (req, res) => {
    const campeao = req.body.campeao;
    const vice = req.body.vice;
    const ano = req.body.ano;

    await cadastraCampeonato(campeao, vice, ano);
    res.status(204).end();
})

app.get('/campeonatos', async (req, res) => {    //localhost:9000/campeonatos
    let campeonatos;
    const ano = req.query.ano;        //localhost:9000/campeonatos?ano = 2010
    const time = req.query.time;     //localhost:9000/campeonatos?time = flamengo

    if (typeof ano === 'undefined' && typeof time === 'undefined') {
        campeonatos = await retornaCampeonatos();
    }
    else if (typeof ano !== 'undefined') {
        campeonatos = await retornaCampeonatosAno(ano);
    }
    else if (typeof time !== 'undefined') {
        campeonatos = await retornaCampeonatosTime(time);
    }
    if (campeonatos.length > 0) {
        res.json(campeonatos);
    } else {
        res.status (404).json({mensagem: "Nenhum campeonato encontrado" });
    }
})

app.get('/campeonatos/:id', async (req, res) => {
    const id = parseInt(req.params.id); //localhost:9000/campeonatos/14
    const campeonato = await retornaCampeonatosID(id);
    if (campeonato.length > 0) {
        res.json(campeonato);
    } else {
        res.status (404).json({ mensagem: "Nenhum campeonato encontrado" });
    }
});


app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor node iniciado em: "+ data);

    //const conexao = await pool.getConnection();
    //console.log(conexao.threadId);
    //conexao.release();

})
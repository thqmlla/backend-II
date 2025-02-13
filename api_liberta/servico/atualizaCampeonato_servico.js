import pool from "./conexao.js";

export async function atualizaCampeonato(id, campeao, vice, ano) {
    const conexao = await pool.getConnection();
    const query = 'UPDATE campeonatos SET campeao = ?, vice = ?, ano = ? Where id = ?';
    const [resposta] = await conexao.execute(query, [campeao, vice, ano, id]);
    console.log(resposta);
    conexao.release();
    return resposta;
}

export async function atualizaCampeonatoParcial(id, campos) {
    const conexao = await pool.getConnection();

    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", "); // campeao = ?, vice = ?,
    const valores = Object.values(campos);

    const query = `UPDATE campeonatos SET ${colunas} WHERE id = ?`;
    valores.push(id);
    const [resposta] = await conexao.execute(query, valores)
    console.log(resposta);
    conexao.release();
    return resposta;
}
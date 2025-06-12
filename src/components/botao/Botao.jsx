import "./Botao.css";

const Botao = (props) => {
    return(
        <button type="submit" className="botao">{props.nomeBotao}</button>
    )
}

export default Botao;
import { Link } from "react-router-dom";

// import ImgError from "../../assets/img/404-error-page-not-found-260nw-603062750 1.svg"
import ImgError from "../../assets/img/undraw_page-eaten_b2rt 1.png"

import "./NotFound.css"

const NotFound = () => {
    return (
        <>
            <main className="main_notfound">
                <div className="esquerda">
                    <h1>404</h1>
                    <h2>Ops! Não encontramos a página</h2>


                    <Link className="botao botao_para_login"to="/">Ir para login</Link>
                </div>
                <img src={ImgError} alt="" />
            </main>
        </>
    )
}

export default NotFound;
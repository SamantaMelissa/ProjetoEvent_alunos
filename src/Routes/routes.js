import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import EventoAluno from "../pages/eventoAluno/EventoAluno";
import Login from "../pages/login/Login";
import { useAuth } from "../contexts/AuthContext";
import CadastroEvento from "../pages/cadastroEvento/CadastroEvento";
import NotFound from "../pages/notFound/NotFound";


const Privado = (props) => {
    const { usuario } = useAuth();
    //toke, idUsuario, tipoUsuario

    // Se não estiver autenticado, manda para login
    if (!usuario) {
        return <Navigate to="/NotFound" />;
    }
    // Se o tipo do usuário não for o permitido, bloqueia
    if (usuario.tipoUsuario !== props.tipoPermitido) {
        //ir para a tela de nao encontrado!
        return <Navigate to="/NotFound" />;
    }

    // Senão, renderiza o componente passado
    return <props.Item />;
};

const Rotas = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route element = {<Login/>}  path="/" exact />
                <Route element = {<NotFound/>}  path="/NotFound" />
                <Route element = {<Privado tipoPermitido="admin" Item={CadastroEvento} />}  path="/CadastroEvento" />
                {/* <Route element = {<Privado tipoPermitido="admin" Item={CadastroEvento} />}  path="/CadastroEvento" /> */}
                {/* <Route element = {<Privado tipoPermitido="admin" Item={CadastroTipoUsuario} />}  path="/CadastroTipoUsuario" /> */}
                <Route element = {<Privado tipoPermitido="aluno" Item={EventoAluno} />}  path="/Eventos" />
            </Routes>
       </BrowserRouter>
    )
}

export default Rotas;
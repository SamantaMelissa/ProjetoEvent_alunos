import { Route, BrowserRouter, Routes } from "react-router-dom";
import EventoAluno from "../pages/eventoAluno/EventoAluno";

const Rotas = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route element = { <EventoAluno/> }  path="/Eventos" />
            </Routes>
       </BrowserRouter>
    )
}

export default Rotas;
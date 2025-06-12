//Importar as imagens:
import Comentario from "../../assets/img/comentario.png"
import Descricao from "../../assets/img/informacoes.png"

//import css:
import "./EventoAluno.css"

//importando hooks:
import { useEffect, useState } from "react"

//importando o services:
import api from "../../Services/services"

import { format } from "date-fns";
import Modal from "../../components/modal/Modal"

import Swal from 'sweetalert2'
import { useAuth } from "../../contexts/AuthContext"

const EventoAluno = () => {

    const [listaEventos, setListaEventos] = useState([]);

    //Modal:
    const [tipoModal, setTipoModal] = useState("");  // "descricaoEvento" ou "comentario"
    const [dadosModal, setDadosModal] = useState({}); // descrição, idEvento, etc.
    const [modalAberto, setModalAberto] = useState(false);

    //filtro
    const [filtroData, setFiltroData] = useState(["todos"]);

    const {usuario} = useAuth();
    // const [usuarioId, setUsuarioId] = useState("817B69EB-ECFE-4E39-B872-F2871AF79756")

    async function listarEventos() {
        try {
            //pego os eventos em geral
            const resposta = await api.get("Eventos");
            const todosOsEventos = resposta.data;

            const respostaPresenca = await api.get("PresencasEventos/ListarMinhas/" + usuario.idUsuario)
            const minhasPresencas = respostaPresenca.data;

            const eventosComPresencas = todosOsEventos.map((atualEvento) => {
                const presenca = minhasPresencas.find(p => p.idEvento === atualEvento.idEvento);

                return {
                    //AS INFORMACOES TANTO DE EVENTOS QUANTO DE EVENTOS QUE POSSUEM PRESENCA
                    ...atualEvento,// Mantém os dados originais do evento atual
                    possuiPresenca: presenca?.situacao === true,
                    idPresenca: presenca?.idPresencaEvento || null
                }
            })

            setListaEventos(eventosComPresencas);

            console.log(`Informacoes de todos os eventos:`);
            console.log(todosOsEventos);

            console.log(`Informacoes de eventos com presenca:`);
            console.log(minhasPresencas);

            console.log(`Informacoes de todos os eventos com presenca:`);
            console.log(eventosComPresencas);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarEventos();
        console.log(usuario);
    }, [])

    function abrirModal(tipo, dados) {
        //tipo de modal
        //dados
        setModalAberto(true)
        setTipoModal(tipo)
        setDadosModal(dados)
    }

    function fecharModal() {
        setModalAberto(false);
        setDadosModal({});
        setTipoModal("");
    }

    async function manipularPresenca(idEvento, presenca, idPresenca) {
        try {
            if (presenca && idPresenca != "") {
                //atualizacao: situacao para FALSE
                await api.put(`PresencasEventos/${idPresenca}`, { situacao: false });
                Swal.fire('Removido!', 'Sua presença foi removida.', 'success');
            } else if (idPresenca != "") {
                //atualizacao: situacao para TRUE
                await api.put(`PresencasEventos/${idPresenca}`, { situacao: true });
                Swal.fire('Confirmado!', 'Sua presença foi confirmada.', 'success');
            } else {
                //cadastrar uma nova presenca
                await api.post("PresencasEventos", { situacao: true, idUsuario: usuario.idUsuario, idEvento: idEvento });
                Swal.fire('Confirmado!', 'Sua presença foi confirmada.', 'success');
            }
            listarEventos()
        } catch (error) {
            console.log(error)
        }
    }

    function filtrarEventos() {
        const hoje = new Date();

        return listaEventos.filter(evento => {
            const dataEvento = new Date(evento.dataEvento);

            if (filtroData.includes("todos")) return true;
            if (filtroData.includes("futuros") && dataEvento > hoje) return true;
            if (filtroData.includes("passados") && dataEvento < hoje) return true;

            return false;
        });
    }


    return (
        <>
            {/* Aqui vc vai chamar o header */}
            {/* Começando a listagem: */}
            <main className="main_lista_eventos layout-grid">
                <div className="titulo">
                    <h1>Eventos</h1>
                    <hr />
                </div>

                <select onChange={(e) => setFiltroData([e.target.value])}>
                    <option value="todos" selected>Todos os eventos</option>
                    <option value="futuros">Somente futuros</option>
                    <option value="passados">Somente passados</option>
                </select>

                <table className="tabela_lista_eventos">
                    <thead>
                        <tr className="th_lista_eventos">
                            <th>Título</th>
                            <th>Data do Evento</th>
                            <th>Tipo Evento</th>
                            <th>Descrição</th>
                            <th>Comentários</th>
                            <th>Participar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaEventos.length > 0 ? (
                             filtrarEventos() && filtrarEventos().map((item) => (
                                <tr>
                                    <td>{item.nomeEvento}</td>
                                    <td>{format(item.dataEvento, "dd/MM/yy")}</td>
                                    <td>{item.tiposEvento.tituloTipoEvento}</td>
                                    <td>
                                        <button className="icon" onClick={() => abrirModal("descricaoEvento", { descricao: item.descricao })}>
                                            <img src={Descricao} alt="" />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="icon" onClick={() => abrirModal("comentarios", { idEvento: item.idEvento })}>
                                            <img src={Comentario} alt="" />
                                        </button>
                                    </td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={item.possuiPresenca}
                                                onChange={() =>
                                                    manipularPresenca(item.idEvento, item.possuiPresenca, item.idPresenca)
                                                } />
                                            <span className="slider"></span>
                                        </label>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <p>Não existe eventos cadastrados</p>
                        )}
                    </tbody>
                </table>
            </main>
            {/* Aqui vc vai chamar o footer */}

            {modalAberto && (
                <Modal
                    titulo={tipoModal === "descricaoEvento" ? "Descrição do evento" : "Comentário"}
                    //estou verificando qual é o tipo de modal!
                    tipoModel={tipoModal}

                    idEvento={dadosModal.idEvento}

                    descricao={dadosModal.descricao}

                    fecharModal={fecharModal}
                />
            )}
        </>
    )
}

export default EventoAluno;

//Atalho para criar o componente-> rafce
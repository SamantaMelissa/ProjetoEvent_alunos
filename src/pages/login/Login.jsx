import React, { useState } from 'react'
import "./Login.css"
import FundoLogin from "../../assets/img/fundoLogin.png"
import Logo from "../../assets/img/logo.svg"
import Botao from "../../components/botao/Botao"
import api from "../../Services/services"

import { userDecodeToken } from '../../auth/Auth'
import secureLocalStorage from 'react-secure-storage'

import { useNavigate } from 'react-router-dom';

import {useAuth} from "../../contexts/AuthContext";

const Login = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const {setUsuario} = useAuth();

    async function realizarAutenticacao(e){

        e.preventDefault();
        // console.log(email, senha);
        const usuario = {
            email: email,
            senha: senha
        }

        if(senha.trim() != "" || email.trim() != ""){
            try{
                const resposta = await api.post("Login", usuario);

                const token = resposta.data.token;

                if(token){
                    //token sera decodificado:
                    const tokenDecodificado = userDecodeToken(token);
                    // console.log("Token decodificado:");
                    // console.log(tokenDecodificado.tipoUsuario);

                    setUsuario(tokenDecodificado);

                    secureLocalStorage.setItem("tokenLogin", JSON.stringify(tokenDecodificado));

                    // console.log("O tipo de usuario é:");
                    // console.log(tokenDecodificado.tipoUsuario);

                    if(tokenDecodificado.tipoUsuario === "aluno"){
                        //redirecionar a tela de lista de eventos(branca)
                        navigate("/Eventos")
                    }else{
                        //ele vai me encaminhar pra tela cadastro de eventos(vermelha)
                        navigate("/CadastroEvento")
                    }

                }
                
            }catch(error){
                console.log(error);   
                alert("Email ou senha inválidos! Para dúvidas, entre em contato com o suporte.");
            }
        }else{
            alert("Preencha os campos vazios para realizar o login!")
        }

    }

    return (
        <>
        <main className="mainLogin">
            <div className="banner">
                    <img src={FundoLogin} alt="Imagem de fundo" />
                </div>

                <form action="" className="formularioLogin" onSubmit={realizarAutenticacao}>
                    <img src={Logo} alt="" className="logo_img" />

                    <div className="campos_input">
                        <div className="campo_input">
                            {/* <label htmlFor="email">E-mail</label> */}
                            <input type="email" name="email" placeholder="E-mail"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        <div className="campo_input">
                            {/* <label htmlFor="senha">Senha</label> */}
                            <input type="password" name="senha" placeholder="Senha"
                            value={senha}
                            onChange={(e)=>setSenha(e.target.value)}
                            />
                        </div>
                    </div>
                    <a href="">Esqueceu a senha?</a>

                    <Botao nomeBotao="Login" />
                </form>


            </main>
        </>
    )
}

export default Login
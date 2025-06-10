// Importa a biblioteca 'axios', que é usada para fazer requisições HTTP de forma mais simples
import axios from "axios";

// Define a porta onde a API local está rodando
const apiPort = "5289";

// Monta a URL base para a API local, usando a porta definida
const localApi = `http://localhost:${apiPort}/api/`;

//create => cria uma instancia do axios que está configurada com a porta da minha API
const api = axios.create({
    baseURL : localApi
});

// Exporta a instância do axios para ser usada em outros arquivos do projeto
export default api;

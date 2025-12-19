import axios from 'axios';

const api = axios.create({
    // OJO: Este puerto 7141 es el que vimos en tus capturas del Swagger
    baseURL: 'https://localhost:7141/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
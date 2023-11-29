# Tu vai usar o json-server para simular uma api nesse curso

- cmd para começar a usar o json-server => json-server --watch db.json

### Sobre o json-server

Em alguns cenários, precisamos desenvolver o front-end em paralelo com o back-end, daí se faz necessário “dublar” as interfaces que serão disponibilizadas. E essa é exatamente a premissa do json-server, ele consegue emular, e muito bem, o funcionamento de APIs REST.

- Artigo => https://www.alura.com.br/artigos/mockando-apis-rest-com-json-server?_gl=1*1f5m7vi*_ga*MTU4MzM1OTIxLjE2OTc0NDY3MTQ.*_ga_1EPWSW3PCS*MTcwMTI5MTcwNS42Mi4xLjE3MDEyOTE5NzEuMC4wLjA.*_fplc*WmdmVHlKdVRCR1hleTB5M01FJTJGZjZPeDYxUVpVVUJQdW9jMTZHT1JTSkEwSCUyQmZEVENFWHZIejBjNzNEQnZDVVptSUNNR1NHVmlhdTlwdHZFT1BabEZoRnJnUzRKOU5JSyUyQk03RmdtOFJnMDFQaXFWUEFXd2FBdXVzckYyUjZnJTNEJTNE

- Tu também vai utilizar o axios

## Criando instancia do axios com o ts
http/index.ts
```ts
import axios, {AxiosInstance} from "axios"

const clienteHttp: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/"
})

export default clienteHttp
```
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

# Importante

- Mutations não podem receber funções assíncronas, para isso tu deve usar as ACTIONS
- Tu tem que saber diferenciar, actions tu vai usar para fazer os get, post, etc, mas para alterar o ESTADO tu vai usar as mutations, então é na action q vai ter a lógica do http e a mutation q vai usar o resultado dessa lógica para adicionar no estado.

## Criando action
store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR } from './tipo-mutations'
import {INotificao} from '@/interfaces/INotificacao'
import http from '@/http' // aqui
import { OBTER_PROJETOS } from './tipo-acoes' // aqui

interface Estado {
  projetos: IProjeto[],
  notificacoes: INotificao[],
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: [],
    notificacoes: [],
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    },
    [NOTIFICAR](state, novaNotificacao: INotificao) {
      novaNotificacao.id = new Date().getTime()
      state.notificacoes.push(novaNotificacao)

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(notificao => notificao.id !== novaNotificacao.id)
      }, 3000)
    }
  },
  actions: { // aqui
    [OBTER_PROJETOS]({commit}) {
      http.get('projetos').then(resposta => console.log(resposta.data))
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

## Consumindo Action
views/projetos/Lista.vue
```vue
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';
import { EXCLUIR_PROJETO } from '@/store/tipo-mutations';
import { OBTER_PROJETOS } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'ListaView',
    methods: {
        excluir(id: string) {
            this.store.commit(EXCLUIR_PROJETO, id)
        }
    },
    setup() {
        const store = useStore();
        store.dispatch(OBTER_PROJETOS) // Aqui
        return {
            projetos: computed(() => store.state.projetos),
            store
        }
    }
})
</script>
```

- Note que para mutations tu usa o commit e para actions tu usa o DISPATCH

## Usando mutation para adicionar valor da action no estado
store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR, DEFINIR_PROJETOS } from './tipo-mutations'
import {INotificao} from '@/interfaces/INotificacao'
import http from '@/http'
import { OBTER_PROJETOS } from './tipo-acoes'


interface Estado {
  projetos: IProjeto[],
  notificacoes: INotificao[],
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: [],
    notificacoes: [],
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) { // Essa mutation está adicionando o valor no estado
      state.projetos = projetos
    },
    [NOTIFICAR](state, novaNotificacao: INotificao) {
      novaNotificacao.id = new Date().getTime()
      state.notificacoes.push(novaNotificacao)

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(notificao => notificao.id !== novaNotificacao.id)
      }, 3000)
    }
  },
  actions: {
    [OBTER_PROJETOS]({commit}) {
      http.get('projetos').then(resposta => commit(DEFINIR_PROJETOS, resposta.data)) // adicionando valor da action na mutation
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

- Note que a tua action OBTER_PROJETOS tá fazendo um get pra api, pegando o valor dela e passando como parametro para a mutation DEFINIR_PROJETOS(Usando o commit para isso)
- Depois a tua mutation DEFINIR_PROJETOS está pegando esse valor vindo da api e adicionando ao estado dentro dela, assim concluindo a lógica.
- Novamente lembrar de não confundir as açÕes de cada uma, mutation não pode ser assincrona e é ela quem é responsável por mudar o estado, já as actions podem ser assíncronas e elas que vão ser as responsáveis por utilizar os protocolos http 
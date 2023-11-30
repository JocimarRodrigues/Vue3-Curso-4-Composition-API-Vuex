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

# Criando Método POST

## Passo 1 cria a action
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR, DEFINIR_PROJETOS } from './tipo-mutations'
import {INotificao} from '@/interfaces/INotificacao'
import http from '@/http'
import { OBTER_PROJETOS, CADASTRAR_PROJETO } from './tipo-acoes'


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
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
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
      http.get('projetos').then(resposta => commit(DEFINIR_PROJETOS, resposta.data))
    },
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) { // PASSO 1 AQUI
      http.post('/projetos', {
        nome: nomeDoProjeto
      })
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

## Passo 2, usa essa action na mutation dentro do componente que está criando a lógica de adicionar projeto no caso o projetos/formulario.vue
```vue
<template>
    <section>
        <form @submit.prevent="salvar">
            <div class="field">
                <label for="nomeDoProjeto" class="label">
                    Nome do Projeto
                </label>
                <input type="text" class="input" v-model="nomeDoProjeto" id="nomeDoProjeto" />
            </div>
            <div class="field">
                <button class="button" type="submit">
                    Salvar
                </button>
            </div>
        </form>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ALTERA_PROJETO } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.id) {
                this.store.commit(ALTERA_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto) // PASSO 2 AQUI

            }
            this.nomeDoProjeto = '',
                this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
            this.$router.push('/projetos')
        },

    },
    setup() {
        const store = useStore();
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>


```

### Refatorando método post para lidar com possíveis erros caso a api esteja off

- Tu vai retornar o método post para poder usar ele em outra parte do código
- No método disptach tu também pode usar o then e o cath, assim tu consegue lidar com erros e essa vai ser a lógica que tu vai usar

#### Passo 1
store/index.ts
```ts
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) {
      return http.post('/projetos', {
        nome: nomeDoProjeto
      })
    }
```

#### Passo 2
projetos/formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ALTERA_PROJETO } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.id) {
                this.store.commit(ALTERA_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
              // AQUI, USANDO O THEN
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => {
                    this.nomeDoProjeto = '',
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
                    this.$router.push('/projetos')
                })
            }
        },

    },
    setup() {
        const store = useStore();
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>
```

## Criando método PUT

- Vai ser bem semelhante ao POST
- A diferença é q tu usa template string, passa o id e como segundo parametro o item com as propriedades novas q irão vir do front.
store/index.ts
```ts
    [ALTERAR_PROJETO](contexto, projeto: IProjeto) {
      return http.put(`/projetos/${projeto.id}`, projeto);
    },
```
- Depois da action basta chamar ela na mutation

projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.id) {
                this.store.dispatch(ALTERAR_PROJETO, { // AQUI
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
                //ADICIONANDO PROJETO
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => {
                    this.nomeDoProjeto = '';
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
                    this.$router.push('/projetos')
                })
            }
        },
    },
    setup() {
        const store = useStore();
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>
```

### Reaproveitando a função de notificar

- Note que a funcao notificar, vai ser usada tanto no post como no put e tu quer reaproveitar ela, para fazer isso em vez de tu criar ela denrto da lógica, cria ela como uma função dentro do methods, assim tu pode usar ela em qualquer parte do componente.


#### REFATORADO
projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.id) {
                this.store.dispatch(ALTERAR_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                }).then(() => this.lidarComSucesso()) // AQUI
            } else {
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => this.lidarComSucesso()) // AQUI
            }
        },
        lidarComSucesso() { // AQUI
            this.nomeDoProjeto = '';
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
                    this.$router.push('/projetos')
        }
    },
    setup() {
        const store = useStore();
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>

```

#### SEM REFATORAR

projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.id) {
                this.store.dispatch(ALTERAR_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
                //ADICIONANDO PROJETO
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => {
                    this.nomeDoProjeto = '';
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
                    this.$router.push('/projetos')
                })
            }
        },
    },
    setup() {
        const store = useStore();
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>

```

## Criando método DELETE

- Criando a action
store/index.ts
```ts
    [REMOVER_PROJETO](contexto, id: string) {
      return http.delete(`/projetos/${id}`);
    },
```

- Chamando a action
projetos/Lista.vue
```vue
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';
import { OBTER_PROJETOS, REMOVER_PROJETO } from '@/store/tipo-acoes';

export default defineComponent({
    name: 'ListaView',
    methods: {
        excluir(id: string) {
            this.store.dispatch(REMOVER_PROJETO, id)
        }
    },
    setup() {
        const store = useStore();
        store.dispatch(OBTER_PROJETOS)
        return {
            projetos: computed(() => store.state.projetos),
            store
        }
    }
})
</script>
```
- Note que tu vai excluir o projeto da api, mas não quer dizer que imediatamente vai ser atualizada a tela, tu pode fazer isso chamando a api novamente, ou chamar a mutation que exclui o projeto
store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR, DEFINIR_PROJETOS } from './tipo-mutations'
import {INotificao} from '@/interfaces/INotificacao'
import http from '@/http'
import { OBTER_PROJETOS, CADASTRAR_PROJETO, ALTERAR_PROJETO, REMOVER_PROJETO } from './tipo-acoes'


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
        nome: nomeDoProjeto,
      } as IProjeto;
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex((proj) => proj.id == projeto.id);
      state.projetos[index] = projeto;
    },
    [EXCLUIR_PROJETO](state, id: string) { // Você está chamando essa mutation
      state.projetos = state.projetos.filter((proj) => proj.id != id);
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos;
    },
    [NOTIFICAR](state, novaNotificacao: INotificao) {
      novaNotificacao.id = new Date().getTime();
      state.notificacoes.push(novaNotificacao);

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(
          (notificao) => notificao.id !== novaNotificacao.id
        );
      }, 3000);
    },
  },
  actions: {
    [OBTER_PROJETOS]({ commit }) {
      http
        .get("projetos")
        .then((resposta) => commit(DEFINIR_PROJETOS, resposta.data));
    },
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) {
      return http.post("/projetos", {
        nome: nomeDoProjeto,
      });
    },
    [ALTERAR_PROJETO](contexto, projeto: IProjeto) {
      return http.put(`/projetos/${projeto.id}`, projeto);
    },
    [REMOVER_PROJETO]({commit}, id: string) {
      return http.delete(`/projetos/${id}`).then(() => commit(EXCLUIR_PROJETO, id)) // Aui
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```
- Dessa forma tu não vai precisar fazer uma nova req pra api assim melhorando a perfomance
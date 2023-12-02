# Nesta aula o foco vai ser em melhorar a experiência do usuário

# Criando Modal de edicao

### Passo 1Ç criando o html e preparando o uso dos v-bind

Tarefas.vue
```vue
<template>
        <div class="modal" :class="{ 'is-active': tarefaSelecionada }" v-if="tarefaSelecionada">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Editando uma tarefa</p>
                    <button @click="fecharModal" class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label for="descricaoDaTarefa" class="label">
                            Descrição
                        </label>
                        <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
                    <button @click="fecharModal" class="button">Cancelar</button>
                </footer>
            </div>
        </div>
    </div>
</template>
```

### Passo 2: Criando as action e mutations
store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR, DEFINIR_PROJETOS, DEFINIR_TAREFAS, ADICIONA_TAREFA, ALTERA_TAREFA } from './tipo-mutations'
import { INotificao } from "@/interfaces/INotificacao";
import  ITarefa  from "@/interfaces/ITarefa";
import http from '@/http'
import { OBTER_PROJETOS, CADASTRAR_PROJETO, ALTERAR_PROJETO, REMOVER_PROJETO, OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from './tipo-acoes'


interface Estado {
  projetos: IProjeto[],
  tarefas: ITarefa[],
  notificacoes: INotificao[],
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    tarefas: [],
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
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter((proj) => proj.id != id);
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos;
    },
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },
    [ADICIONA_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa)
    },
    [ALTERA_TAREFA](state, tarefa: ITarefa) { // Aqui
      const index = state.tarefas.findIndex((resp) => resp.id == tarefa.id);
      state.tarefas[index] = tarefa;
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
      return http.delete(`/projetos/${id}`).then(() => commit(EXCLUIR_PROJETO, id))
    },
    [OBTER_TAREFAS]({ commit }) {
      http
        .get("tarefas")
        .then((resposta) => commit(DEFINIR_TAREFAS, resposta.data));
    },
    [CADASTRAR_TAREFA]({commit}, tarefa: ITarefa) {
      return http.post("/tarefas", tarefa).then(resposta => commit(ADICIONA_TAREFA, resposta.data))
    },
    [ALTERAR_TAREFA]({commit}, tarefa: ITarefa) { // Aqui
      return http.put(`/projetos/${tarefa.id}`, tarefa).then(() => commit(ALTERA_TAREFA, tarefa))
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

## Passo 3: Chamando as actions e mutations no componente que usa o modal
Tarefas.vue
```vue
<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <Box v-if="listaEstaVazia">
            Ainda não foram adicionada tarefas.
        </Box>
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
        <div class="modal" :class="{ 'is-active': tarefaSelecionada }" v-if="tarefaSelecionada">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Editando uma tarefa</p>
                    <button @click="fecharModal" class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label for="descricaoDaTarefa" class="label">
                            Descrição
                        </label>
                        <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
                    <button @click="fecharModal" class="button">Cancelar</button>
                </footer>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent } from 'vue';
import Formulario from '../components/Formulario.vue';
import Tarefa from '../components/Tarefa.vue';
import type ITarefa from '../interfaces/ITarefa'
import Box from '../components/Box.vue';
import { useStore } from '@/store';
import { OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from '@/store/tipo-acoes';


export default defineComponent({
    name: 'TarefasView',
    components: {
        Formulario,
        Tarefa,
        Box
    },
    data() {
        return {
            tarefaSelecionada: null as ITarefa | null
        }
    },
    computed: {
        listaEstaVazia(): boolean {
            return this.tarefas.length === 0
        }
    },
    methods: {
        salvarTarefa(tarefa: ITarefa) {
            this.store.dispatch(CADASTRAR_TAREFA, tarefa)
        },
        selecionarTarefa(tarefa: ITarefa) { // Aqui
            this.tarefaSelecionada = tarefa
        },
        fecharModal() {
            this.tarefaSelecionada = null
        },
        alterarTarefa() { // Aqui
            this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada).then(() => this.fecharModal)
        }
    },
    setup() {
        const store = useStore()
        store.dispatch(OBTER_TAREFAS)
        return {
            tarefas: computed(() => store.state.tarefas),
            store
        }
    }
})
</script>
```

- Note a lógica aqui, ao tu clicar em uma div de tarefa, tu vai pegar aquela tarefa, assim podendo pegar o id dela.
- Aí tu vai chamar a action ALTERAR_TAREFA e vai passar como parametro para ela a tarefa, contendo o id dela.
- Depois a action dentro do store vai chamar a mutation ALTERA_TAREFA que vai fazer a lógica para de fato alterar o valor da tarefa, assim concluindo a lógica.
- Link da aula -> https://cursos.alura.com.br/course/vue3-composition-api-vuex/task/100129
# Filtrando Tarefas
views/Tarefas.vue
```vue
<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <Box v-if="listaEstaVazia">
            Ainda não foram adicionada tarefas.
        </Box>
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="Digite para filtrar" v-model="filtro"> <!--Aqui-->
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
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
import { computed, defineComponent, ref } from 'vue';
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
        selecionarTarefa(tarefa: ITarefa) {
            this.tarefaSelecionada = tarefa
        },
        fecharModal() {
            this.tarefaSelecionada = null
        },
        alterarTarefa() {
            this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada).then(() => this.fecharModal)
        }
    },
    setup() {
        const store = useStore()
        store.dispatch(OBTER_TAREFAS)

        const filtro = ref('') // Aqui

        const tarefas = computed(() => store.state.tarefa.tarefas.filter(tarefa => !filtro.value || tarefa.descricao.includes(filtro.value))) // Aqui

        return {
            tarefas,
            store,
            filtro
        }
    }
})
</script>
  

```

- Note que você está usando composition api, então seguindo as regras:
- Você criou a variável e usou o ref para fazer a refencia(variável reativa, q muda valor)
- Depois você usou o método computed para fazer uma filtragem e retornar um valor
- Importante destacar que na lógica atual que está aí a filtragem está sendo feita nos dados Locais, isso é nos dados que já vieram da API, na próx aula esse método vai ser aplicado para fazer a filtragem direto na API.


# Watch Effect

- Esse hook é responsável por ficar analisando uma dependencia e executando o código dentro dele toda vez q houver uma mudança nessa dependencia

Dê uma olhada no código abaixo
views/Tarefas.vue
```ts
        watchEffect(() => {
            store.dispatch(OBTER_TAREFAS, filtro.value)
        })
```
- Note que toda vez que a dependencia filtro.value mudar o watchEffect vai disprar o dispatch q vai chamar a Action OBTER_TAREFAS

- Bom com isso, tu vai poder usar a Action, passando para ela como parametro o resultado do filtro.value, assim podendo utilizar ele na sua lógica de filtro, dessa vez na api.
store/modulos/tarefas/index.ts
```ts 
  actions: {
    [OBTER_TAREFAS]({ commit }, filtro: string) {
      let url = 'tarefas'
      if(filtro) {
        url += '?descricao=' + filtro
      }

      http.get(url)
        .then(response => commit(DEFINIR_TAREFAS, response.data))
    },
  }
```

- Importante destacar que nessa lógica que você criou, o resultado da busca só vai ser possível se o valor do input for exatamente igual ao valor da tarefa que está na api, o nome precisa ser exato.

# Para saber mais Watch vs WatchEffect

- https://cursos.alura.com.br/course/vue3-composition-api-vuex/task/100156

### Documentação Oficial

- https://vuejs.org/api/reactivity-core.html#watch
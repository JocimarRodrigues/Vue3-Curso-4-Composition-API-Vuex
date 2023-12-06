<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <Box v-if="listaEstaVazia">
            Ainda não foram adicionada tarefas.
        </Box>
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="Digite para filtrar" v-model="filtro">
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
        <Modal :mostrar="tarefaSelecionada != null">
            <header class="modal-card-head">
                <p class="modal-card-title">Editando uma tarefa</p>
                <button @click="fecharModal" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label for="descricaoDaTarefa" class="label">
                        Descrição
                    </label>
                    <input type="text" class="input" v-if="tarefaSelecionada" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
                </div>
            </section>
            <footer class="modal-card-foot">
                <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
                <button @click="fecharModal" class="button">Cancelar</button>
            </footer>
        </Modal>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import Formulario from '../components/Formulario.vue';
import Tarefa from '../components/Tarefa.vue';
import Modal from '@/components/Modal.vue';
import type ITarefa from '../interfaces/ITarefa'
import Box from '../components/Box.vue';
import { useStore } from '@/store';
import { OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from '@/store/tipo-acoes';


export default defineComponent({
    name: 'TarefasView',
    components: {
        Formulario,
        Tarefa,
        Modal,
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

        // const tarefas = computed(() => store.state.tarefa.tarefas.filter(tarefa => !filtro.value || tarefa.descricao.includes(filtro.value)))

        const filtro = ref('')

        watchEffect(() => {
            store.dispatch(OBTER_TAREFAS, filtro.value)
        })
        return {
            tarefas: computed(() => store.state.tarefa.tarefas),
            store,
            filtro
        }
    }
})
</script>
  

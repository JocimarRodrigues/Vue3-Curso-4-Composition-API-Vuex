<template>
    <Box>
        <div class="columns">
            <div class="column is-4">
                {{ tarefa.descricao }}
            </div>
            <div class="column is-3">
                {{ tarefa.projeto?.nome || 'N/D' }}
            </div>
            <div class="column">
                <Cronometro :tempoEmSegundos="tarefa.duracaoEmSegundos" />
            </div>
        </div>
    </Box>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue'
import Cronometro from './Cronometro.vue';
import type ITarefa from '../interfaces/ITarefa'
import Box from './Box.vue'

export default defineComponent({
    name: 'TarefaComponent',
    components: {
        Cronometro,
        Box
    },
    props: {
        tarefa: {
            type: Object as PropType<ITarefa>,
            required: true
        }
    }
})
</script>


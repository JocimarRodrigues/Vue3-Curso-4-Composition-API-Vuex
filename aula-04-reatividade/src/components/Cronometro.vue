<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <section>
        <strong class="display">{{ tempoDecorrido }}</strong>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CronometroComponent',
    props: {
        tempoEmSegundos: {
            type: Number,
            default: 0 // Valor padrao
        }
    },
    computed: {
        tempoDecorrido(): string {
            // return new Date(this.tempoEmSegundos * 1000).toISOString().substr(11, 8)
            // Como o método str, foi descontinuado, alterei a lógica do contador, pode causar futuros bugs nas próx aula do curso, mas aí eu resolvo. kk

            const tempoTotal = new Date(this.tempoEmSegundos * 1000);
            const horas = ('0' + tempoTotal.getUTCHours()).slice(-2);
            const minutos = ('0' + tempoTotal.getUTCMinutes()).slice(-2);
            const segundos = ('0' + tempoTotal.getUTCSeconds()).slice(-2);

            return `${horas}:${minutos}:${segundos}`;


        }
    },
})
</script>

<style scoped>
.display {
    color: var(--texto-primario);
}
</style>
# Slot

- O slot permite que você utilize html, dentro do template do seu componente, quando você chama ele(Bem semelhante ao Children)

### Exemplo de uso

Criando o componente que vai usar o slot
components/Modal.vue
```vue
<template>
    <div class="modal" :class="{ 'is-active': mostrar }" v-if="mostrar">
        <div class="modal-background"></div>
        <div class="modal-card">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ModalComponent',
    props: {
        mostrar: {
            type: Boolean,
            required: true
        }
    }
})
</script>
```

- Chamando o componente e usando o slot de fato
views/Tarefas.vue
```vue
<template>
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
</template>
```

- Note que você chamou o componente e tudo que está dentro do componente, onde ficaria o "children" vai ser utilizado pelo slot

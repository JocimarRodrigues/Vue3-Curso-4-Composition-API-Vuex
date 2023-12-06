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

# Refatorando as classes do bulma com o store

- Note que quando você chama o modal, você utiliz dentro do slot várias classes do bulma, isso poderia ficar difícil para fazer manuntenção por outras pessoas que não conhecem o framework.
- Uma forma de resolver isso é: Usar o slot para criar classes de cabecalho, corpo e rodape, dessa forma o desenvolvedor vai conseguir ter um controle melhor sobre o código

### Exemplo

components/Modal.vue
```vue
<template>
    <div class="modal" :class="{ 'is-active': mostrar }" v-if="mostrar">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <slot name="cabecalho" />
            </header>
            <section class="modal-card-body">
                <slot name="corpo" />
            </section>
            <footer class="modal-card-foot">
                <slot name="rodape" />
            </footer>
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
- Note que você está criando as tags e usando nela as classes do bulma e dentro delas, usando o slot você vai poder usar o slot com um nome definido, então mesmo que o dev não conheça o css do bulma ele vai saber q quando chamar a classe cabecalho, ela vai ser refente ao cabecalho.

### Chamando as novas tags

- Note que diferente do exemplo anterior em que você só chamava o componente e Colocava o html, dessa vez tu vai precisar chamar o Componente e dentro dele criar vários templates
- Nesses templates é que você vai colocar os nome da classe que você definiu para eles no componente Pai:Modal

views/Tarefas.vue
```vue
<template> 
        <Modal :mostrar="tarefaSelecionada != null">
            <template v-slot:cabecalho> <!--Aqui-->
                <p class="modal-card-title">Editando uma tarefa</p>
                <button @click="fecharModal" class="delete" aria-label="close"></button>
            </template>
            <template v-slot:corpo> <!--Aqui-->
                <div class="field">
                    <label for="descricaoDaTarefa" class="label">
                        Descrição
                    </label>
                    <input type="text" class="input" v-if="tarefaSelecionada" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
                </div>
            </template>
            <template v-slot:rodape> <!--Aqui-->
                <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
                <button @click="fecharModal" class="button">Cancelar</button>
            </template>
        </Modal>
</template>
```

#### Não confundir os v-bind, no v-slot você utiliza os : para atribuir o nome da classe q voce definiu no slot e nao o =
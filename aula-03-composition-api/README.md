# Composition Api

- Doc oficial => https://vuejs.org/guide/extras/composition-api-faq.html#why-composition-api
- O foco dessa aula vai ser migrar o options api para o composition api

### Exemplo de componente com Options API
views/projetos/Formulario.vue
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
            const projeto = this.store.state.projeto.projetos.find(proj => proj.id == this.id)
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
                    nome: this.nomeDoProjeto,
                }).then(() => this.lidarComSucesso());
            } else {
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => this.lidarComSucesso());
            }
        },
        lidarComSucesso() {
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

# Usando Composition API

views/projetos/Formulario.vue
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
import { defineComponent, ref } from 'vue';
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
    // mounted() {
    //     if (this.id) {
    //         const projeto = this.store.state.projeto.projetos.find(proj => proj.id == this.id)
    //         this.nomeDoProjeto = projeto?.nome || ''
    //     }
    // },
    // data() {
    //     return {
    //         nomeDoProjeto: '',
    //     }
    // },
    methods: {
        salvar() {
            if (this.id) {
                this.store.dispatch(ALTERAR_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto,
                }).then(() => this.lidarComSucesso());
            } else {
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => this.lidarComSucesso());
            }
        },
        lidarComSucesso() {
            this.nomeDoProjeto = '';
            this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
            this.$router.push('/projetos')
        }
    },
    setup(props) { // AQUI
        const store = useStore();
        const { notificar } = useNotificador()

        const nomeDoProjeto = ref("")

        if (props.id) {
            const projeto = store.state.projeto.projetos.find(proj => proj.id == props.id)
            nomeDoProjeto.value = projeto?.nome || ''
        }

        return {
            store,
            notificar,
            nomeDoProjeto,
        }
    }
})
</script>


```

### Diferenças

- Note que usando Composition API tu não precisa mais do data() nem do mounted(), tu pode fazer isso direto dentro do setup, com uma sintaxe mais parecida com ts padrao
- Note que agora o setup está recebendo props, que são as props que você cria ao criar o componente
- Note também que dentro do setup o THIS não é possível por isso caso tu precise usar uma variável reativa(que vai mudar ao decorrer do projeto), você precisa utilizar a funcao ref, do vue
- Essa funcao é responsável por ficar analisando a variável e caso ela tenha alguma mudança, renderizar novamente o dom
- Note também que por não poder usar o this, dentro do setup, tu não vai mais fazer this.nomeDoProjeto para pegar o valor da variável, tu vai usar o .value para isso
- Essa mesma regra se aplica ao template, mas lá não precisa usar o .value, pq o vue vai fazer isso automaticamente.
- Note também que você mudou a store e o useNotificador de posição para respeitar o cliclo de vida do componente, porque caso eles ficassem em baixo do teu if, eles só seriam renderizados depois do if e seu if precisa do valor da store para funcionar.


# Migrando o methods para o composition API

#### Vai ser bem semelhante como tu fez com o exemplo acima, basta chamar as funções para dentro do setup, lembrando de respeitar o hoisting.

## Com Options API
projetos/Formulario.vue
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
import { defineComponent, ref } from 'vue';
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
    // mounted() {
    //     if (this.id) {
    //         const projeto = this.store.state.projeto.projetos.find(proj => proj.id == this.id)
    //         this.nomeDoProjeto = projeto?.nome || ''
    //     }
    // },
    // data() {
    //     return {
    //         nomeDoProjeto: '',
    //     }
    // },
    methods: {
        salvar() {
            if (this.id) {
                this.store.dispatch(ALTERAR_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto,
                }).then(() => this.lidarComSucesso());
            } else {
                this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto).then(() => this.lidarComSucesso());
            }
        },
        lidarComSucesso() {
            this.nomeDoProjeto = '';
            this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
            this.$router.push('/projetos')
        }
    },
    setup(props) { // AQUI
        const store = useStore();
        const { notificar } = useNotificador()

        const nomeDoProjeto = ref("")

        if (props.id) {
            const projeto = store.state.projeto.projetos.find(proj => proj.id == props.id);
            nomeDoProjeto.value = projeto?.nome || ''
        }

        return {
            store,
            notificar,
            nomeDoProjeto,
        }
    }
})
</script>


```
## Com Composition API
projetos/Formulario.vue
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
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from '@/store/tipo-acoes';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    setup(props) { // AQUI
        const store = useStore();
        const { notificar } = useNotificador()
        const nomeDoProjeto = ref("")
        const router = useRouter() // Para você usar o router, o próprio Vue tem um hook para isso que é o useRouter, não confundir com o useRoute q é para pegar uma rota!

        if (props.id) {
            const projeto = store.state.projeto.projetos.find(proj => proj.id == props.id);
            nomeDoProjeto.value = projeto?.nome || ''
        }

        const lidarComSucesso = () => {
            nomeDoProjeto.value = '';
            notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso')
            router.push('/projetos')
        }

        const salvar = () => {
            if (props.id) {
                store.dispatch(ALTERAR_PROJETO, {
                    id: props.id,
                    nome: nomeDoProjeto.value,
                }).then(() => lidarComSucesso());
            } else {
                store.dispatch(CADASTRAR_PROJETO, nomeDoProjeto.value).then(() => lidarComSucesso());
            }
        }

        return {
            nomeDoProjeto,
            salvar,
        }
    }
})
</script>
```
- Note que oq tu fez basicamente foi descer as funçÕes de dentro do methods para o setup, transformando elas em uma arrow function
- Note também que para usar o router, precisa usar o hook useRouter do VUE
- Importante lembrar que quando você trabalha com uma variável reativa(que muda ao longo do projeto, usando o REF) você precisa usar o .value depois de chamar a variável
- Note também que como você não está mais usando a store e o notificar fora do setup, porque toda a lógica que utiliza ele, fica dentro do setup e oq você quer é o resultado, não precisa mais exportar os dois
- Basta exportar a variável reativa e a funcão que vai fazer a lógica de salvar os projetos, dessa forma fica bem mais legível o código.

# Emitindo eventos

- Quando tu usa o setup, ele tem dois parametros q é a proprs e o contexto, o responsável por transmitir os emit é o contexto
- O contexto é responsável por várias coisas do vue, e um delas é o emit, caso tu queria melhorar mais ainda o código você pode desestrutura o contexto e pegar apenas o emit, o que funciona também.

### Usando OPTIONS API
components/Formulario.vue
```vue
<script lang="ts">
import { computed, defineComponent } from 'vue';
import Temporizador from './Temporizador.vue'
import { useStore } from 'vuex';

import {key} from '@/store'
import { NOTIFICAR } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';

export default defineComponent({
    name: "FormulárioComponent",
    emits: ['aoSalvarTarefa'],
    components: {
        Temporizador
    },
    data() {
        return {
            descricao: '',
            idProjeto: '',
        }
    },
    methods: {
        salvarTarefa(tempoDecorrido: number): void {
            const projeto = this.projetos.find(proj => proj.id == this.idProjeto)
            if(!projeto) {
                this.store.commit(NOTIFICAR, {
                    titulo: 'Ops!',
                    texto: 'Selecione um projeto antes de finalizar a tarefa!',
                    tipo: TipoNotificacao.FALHA,
                })
                return;
            }
            this.$emit('aoSalvarTarefa', {
                duracaoEmSegundos: tempoDecorrido,
                descricao: this.descricao,
                projeto: projeto
            })
            this.descricao = ''
        }
    },
    setup() {
        const store = useStore(key)
        return {
            projetos: computed(() => store.state.projeto.projetos),
            store
        }
    }
})
</script>
```

## Usando Composition API

### Usando o contexto

components/Formulario.vue
```vue
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Temporizador from './Temporizador.vue'
import { useStore } from 'vuex';

import {key} from '@/store'
import { NOTIFICAR } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';

export default defineComponent({
    name: "FormulárioComponent",
    emits: ['aoSalvarTarefa'],
    components: {
        Temporizador
    },
    setup(props, contexto) {
        const store = useStore(key)

        const descricao = ref("")
        const idProjeto = ref("")

        const projetos = computed(() => store.state.projeto.projetos)

        const salvarTarefa = (tempoDecorrido: number): void => {
            const projeto = projetos.value.find(proj => proj.id == idProjeto.value)
            if(!projeto) {
                store.commit(NOTIFICAR, {
                    titulo: 'Ops!',
                    texto: 'Selecione um projeto antes de finalizar a tarefa!',
                    tipo: TipoNotificacao.FALHA,
                })
                return;
            }
            contexto.emit('aoSalvarTarefa', { // Aqui
                duracaoEmSegundos: tempoDecorrido,
                descricao: descricao.value,
                projeto: projeto
            })
            descricao.value = ''
        }

        return {
            descricao,
            idProjeto,
            projetos,
            salvarTarefa
        }
    }
})
</script>

<style>
.formulario {
    color: var(--texto-primario);
    background-color: var(--bg-primario);
}
</style>
```

### Desestruturando o contexto

components/Formulario.vue
```vue
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Temporizador from './Temporizador.vue'
import { useStore } from 'vuex';

import {key} from '@/store'
import { NOTIFICAR } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';

export default defineComponent({
    name: "FormulárioComponent",
    emits: ['aoSalvarTarefa'],
    components: {
        Temporizador
    },
    setup(props, {emit}) { // Aqui
        const store = useStore(key)

        const descricao = ref("")
        const idProjeto = ref("")

        const projetos = computed(() => store.state.projeto.projetos)

        const salvarTarefa = (tempoDecorrido: number): void => {
            const projeto = projetos.value.find(proj => proj.id == idProjeto.value)
            if(!projeto) {
                store.commit(NOTIFICAR, {
                    titulo: 'Ops!',
                    texto: 'Selecione um projeto antes de finalizar a tarefa!',
                    tipo: TipoNotificacao.FALHA,
                })
                return;
            }
            emit('aoSalvarTarefa', {
                duracaoEmSegundos: tempoDecorrido,
                descricao: descricao.value,
                projeto: projeto
            })
            descricao.value = ''
        }

        return {
            descricao,
            idProjeto,
            projetos,
            salvarTarefa
        }
    }
})
</script>
```
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
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) {
      http.post('/projetos', {
        nome: nomeDoProjeto
      })
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
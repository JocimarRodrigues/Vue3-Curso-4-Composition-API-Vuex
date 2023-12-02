import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { NOTIFICAR, DEFINIR_TAREFAS, ADICIONA_TAREFA, ALTERA_TAREFA } from './tipo-mutations'
import { INotificao } from "@/interfaces/INotificacao";
import  ITarefa  from "@/interfaces/ITarefa";
import http from '@/http'
import { OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from './tipo-acoes'
import { EstadoProjeto, projeto } from './modulos/projeto';
import { EstadoTarefa, tarefa } from './modulos/tarefas';


export interface Estado {
  notificacoes: INotificao[],
  projeto: EstadoProjeto,
  tarefa: EstadoTarefa
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    notificacoes: [],
    projeto: {
      projetos: []
    },
    tarefa: {
      tarefas: []
    }
  },
  mutations: {
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
    [OBTER_TAREFAS]({ commit }) {
      http
        .get("tarefas")
        .then((resposta) => commit(DEFINIR_TAREFAS, resposta.data));
    },
    [CADASTRAR_TAREFA]({commit}, tarefa: ITarefa) {
      return http.post("/tarefas", tarefa).then(resposta => commit(ADICIONA_TAREFA, resposta.data))
    },
    [ALTERAR_TAREFA]({commit}, tarefa: ITarefa) {
      return http.put(`/projetos/${tarefa.id}`, tarefa).then(() => commit(ALTERA_TAREFA, tarefa))
    },
  },
  modules: {
    projeto,
    tarefa
  }
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
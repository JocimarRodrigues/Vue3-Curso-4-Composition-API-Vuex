export enum TipoNotificacao {
    SUCESSO,
    FALHA,
    ATENCAO
}


export interface INotificao {
    titulo: string,
    texto: string,
    tipo: TipoNotificacao,
    id: number
}
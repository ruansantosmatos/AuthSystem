import { AxiosError } from "axios";
import { api } from "../config";

export const update = async (info: { id_usuario: number, senha: string }, token: string): Promise<object | Error> => {
    try {
        console.log('senhas ?', info.senha)
        const request = (await api.patch('/password/reset', info, { headers: { Authorization: `Bearer ${token}` } })).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
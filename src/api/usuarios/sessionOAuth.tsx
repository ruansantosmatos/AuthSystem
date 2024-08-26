import { AxiosError } from "axios";
import { api } from "../config";

export const sessionOAuth = async (info: { 'id_conta': string, 'nome': string, 'email': string }): Promise<object | Error> => {
    try {
        const request = (await api.post('/session/oauth', info)).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
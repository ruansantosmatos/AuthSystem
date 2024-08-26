import { AxiosError } from "axios";
import { api } from "../config";
import { IUsuarios } from "../models/usuarios";

export const session = async (info: Omit<IUsuarios, 'id' | 'nome' | 'contato'>): Promise<object | Error> => {
    try {
        const request = (await api.post('/session', info)).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
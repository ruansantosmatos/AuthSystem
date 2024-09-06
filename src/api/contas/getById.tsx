import { AxiosError } from "axios";
import { api } from "../config";

export const getById = async (id_usuario: number, token: string): Promise<object | Error> => {
    try {
        const request = (await api.get(`/contas/${id_usuario}`, { headers: { Authorization: `Bearer ${token}` } })).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
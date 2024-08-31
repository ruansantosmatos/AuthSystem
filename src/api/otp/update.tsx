import { AxiosError } from "axios";
import { api } from "../config";

export const update = async (info: { id_otp: number, id_usuario: number, codigo: string }, token: string): Promise<string | Error> => {
    try {
        const request = (await api.patch('/verification', info, { headers: { Authorization: `Bearer ${token}` } })).data as string
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        console.log('error verification', erro)
        throw erro.response?.data
    }
}
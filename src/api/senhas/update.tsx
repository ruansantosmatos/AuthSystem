import { AxiosError } from "axios";
import { api } from "../config";

export const update = async (info: { id: number }, token: string): Promise<string | Error> => {
    try {
        const request = (await api.patch('/validate/token', info, { headers: { Authorization: `Bearer ${token}` } })).data as string
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        console.log('error verification', erro)
        throw erro.response?.data
    }
}
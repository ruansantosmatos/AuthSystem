import { AxiosError } from "axios";
import { api } from "../config";

export const resend = async (info: { email: string }, token: string): Promise<object | Error> => {
    try {
        const request = (await api.post('/resend', info, { headers: { Authorization: `Bearer ${token}` } })).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        console.log('error', erro)
        throw erro.response?.data
    }
}
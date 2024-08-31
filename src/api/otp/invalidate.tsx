import { AxiosError } from "axios";
import { api } from "../config";

export const invalidate = async (info: { id_otp: number }, token: string): Promise<string | Error> => {
    try {
        console.log('invalidado ID:', info, token)
        const request = (await api.patch('/invalidate', info, { headers: { Authorization: `Bearer ${token}` } })).data as string
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        console.log('error', erro)
        throw erro.response?.data
    }
}
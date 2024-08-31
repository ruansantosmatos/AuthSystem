import { AxiosError } from "axios";
import { api } from "../config";

export const encrypt = async (info: { data: { } }, token: string): Promise<object | Error> => {
    try {
        const request = (await api.post('/encrypt', info, { headers: { Authorization: `Bearer ${token}` } })).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
import { AxiosError } from "axios";
import { api } from "../config";

export const create = async (info: { email: string }): Promise<string | Error> => {
    try {
        const request = (await api.post('/forgot', info)).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
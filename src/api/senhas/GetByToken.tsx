import { AxiosError } from "axios";
import { api } from "../config";

export const getByToken = async (validationToken: string ): Promise<object | Error> => {
    try {
        const request = (await api.get(`/verify/token/${validationToken}`)).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
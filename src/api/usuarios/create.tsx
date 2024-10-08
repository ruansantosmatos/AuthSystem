import { AxiosError } from "axios";
import { api } from "../config";
import { IUsuarios } from "../models/usuarios";

export const create = async (info: Omit<IUsuarios, 'id'>): Promise<object | Error> => {
    try {
        const request = (await api.post('/user', info)).data
        return request
    }
    catch (error) {
        const erro = error as AxiosError
        throw erro.response?.data
    }
}
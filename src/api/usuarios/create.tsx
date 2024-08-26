import { api } from "../config";
import { IUsuarios } from "../models/usuarios";

export const create = async (info: Omit<IUsuarios, 'id'>): Promise<number | Error> => {
    try {
        const request = (await api.post('/user', info)).data as number
        return request
    }
    catch (error) {
        const logger = {'function': 'Create', 'endpoint': '/user', 'error': error}
        throw logger
    }
}
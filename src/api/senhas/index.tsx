import * as create from './Create'
import * as update from './update'
import * as getByToken from './GetByToken'

export const ServicesSenhas = {
    ...create,
    ...update,
    ...getByToken
}
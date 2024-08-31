import * as create from './create'
import * as session from './session'
import * as sessionOAuth from './sessionOAuth'
import * as encrypt from './encrypt'
import * as decrypt from './decrypt'

export const ServicesUsuarios = {
    ...session,
    ...encrypt,
    ...decrypt,
    ...sessionOAuth,
    ...create,
}

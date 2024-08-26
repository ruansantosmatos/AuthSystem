import * as create from '@/api/usuarios/create'
import * as session from '@/api/usuarios/session'
import * as sessionOAuth from '@/api/usuarios/sessionOAuth'

export const ServicesUsuarios = {
    ...session,
    ...sessionOAuth,
    ...create,
}

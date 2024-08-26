import * as create from '@/api/usuarios/create'
import * as session from '@/api/usuarios/session'

export const ServicesUsuarios = {
    ...session,
    ...create
}

import * as update from './update'
import * as resend from './resend'
import * as invalidate from './invalidate'

export const ServicesOtp = {
    ...update,
    ...resend,
    ...invalidate
}
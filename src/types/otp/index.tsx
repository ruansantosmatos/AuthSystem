import { IContas } from "@/api/models/contas"

export interface IPropsOtp {
    id: number,
    id_otp: number
    email: string,
}

export interface IOtpFields {
    code: string
}

export interface IDataContasOTP {
    data: IContas[]
}
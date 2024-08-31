export enum fieldSingUp {
    firstName = "firstName",
    lastName = "lastName",
    email = "email",
    password = "password"
}

export interface ISingUp {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface IResponseCreateUser {
    id: number,
    id_otp: number,
    email: string,
    token: string
}

export interface IResponseUser {
    data: {
        id: number,
        id_otp: number,
        email: string,
        token: string
    }
}
export enum fieldsLogin {
    email = "email",
    password = "password"
}

export interface ILogin {
    email: string,
    password: string
}

export interface ISessionData {
    session: {
        id: number,
        token: string
    }
}

export interface IOAuthGoogle {
    sub: string
    name: string
    email: string,
}

export interface ISession {
    id: number,
    token: string
}

export interface IUser {
    id: number,
    nome: string,
    email: string,
    senha: string
}

export interface IUserData {
    data: IUser[]
}
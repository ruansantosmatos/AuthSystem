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


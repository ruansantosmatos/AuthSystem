'use client'
import '../../services/TranslationYup'
import * as yup from 'yup'
import Link from "next/link"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fieldSingUp, IResponseCreateUser, ISingUp } from '@/types/sing-up'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServicesUsuarios } from '@/api/usuarios'
import { IUsuarios } from '@/api/models/usuarios'
import { CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'
import { IOAuthGoogle } from '@/types/login'
import { useRouter } from 'next/navigation'

export default function SingUp() {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [alertMessageName, setAlertMessageName] = useState<string>('')
    const [alertMessageEmail, setAlertMessageEmail] = useState<string>('')
    const [alertMessagePassword, setAlertMessagePassword] = useState<string>('')
    const router = useRouter()
    const CLIENT_ID_GOOGLE = process.env.NEXT_PUBLIC_CLIENTID as string

    function onChangeFirstName(first: string) {
        setFirstName(first)
    }

    function onChangeLastName(last: string) {
        setLastName(last)
    }

    function onChangeEmail(email: string) {
        setEmail(email)
    }

    function onChangePassword(password: string) {
        setPassword(password)
    }

    function alertInvalidFields(message: string, display: string, type: 'name' | 'password' | 'email') {
        const alert = document.getElementById(`alert-${type}`)
        if (alert == undefined) { return }

        switch (type) {
            case 'name':
                setAlertMessageName(message)
                alert.style.display = display
                break;

            case 'email':
                setAlertMessageEmail(message)
                alert.style.display = display
                break;

            case 'password':
                setAlertMessagePassword(message)
                alert.style.display = display
                break;
        }
    }

    function disableEnableBtns(active: boolean) {
        const btnCreate = document.getElementById('btn-create')
        const btnOauth = document.getElementById('btn-oauth')
        if (btnCreate == undefined || btnOauth == undefined) { return }

        if (active) {
            btnCreate.setAttribute('disabled', '')
            btnOauth.setAttribute('disabled', '')
        }
        else {
            btnCreate.removeAttribute('disabled')
            btnOauth.removeAttribute('disabled')
        }
    }

    function validationFilds() {
        try {
            const schema: yup.ObjectSchema<ISingUp> = yup.object().shape(
                {
                    firstName: yup.string().required().min(3),
                    lastName: yup.string().required().min(5),
                    email: yup.string().required().min(6),
                    password: yup.string().required().min(4)
                }
            )

            schema.validateSync({ firstName, lastName, email, password }, { abortEarly: false })
            schema.type == 'object' && createAccount()
        }
        catch (error) {
            const yupErro = error as yup.ValidationError
            const erroValidation: Record<string, string> = {}

            yupErro.inner.forEach(erro => {
                if (erro.path == undefined) { return }
                erroValidation[erro.path] = erro.message

                switch (erro.path) {
                    case fieldSingUp.firstName:
                        alertInvalidFields(erro.message, 'block', 'name')
                        break;

                    case fieldSingUp.lastName:
                        alertInvalidFields(erro.message, 'block', 'name')
                        break;

                    case fieldSingUp.email:
                        alertInvalidFields(erro.message, 'block', 'email')
                        break;

                    case fieldSingUp.password:
                        alertInvalidFields(erro.message, 'block', 'password')
                        break;
                }
            })
        }
    }

    async function createAccount() {
        try {
            disableEnableBtns(true)
            const name = `${firstName} ${lastName}`
            const emailUser = email
            const passwordUser = password

            const data: Omit<IUsuarios, 'id'> = { 'nome': name, 'email': emailUser, 'senha': passwordUser }
            const info = await ServicesUsuarios.create(data) as IResponseCreateUser
            
            const props = { 'id': info.id, 'id_otp': info.id_otp, 'email': email, 'token': info.token }
            const crypt = await ServicesUsuarios.encrypt({ 'data': props }, info.token) as { data: string }

            sessionStorage.setItem('data_user', JSON.stringify(crypt.data))
            sessionStorage.setItem('token', JSON.stringify(info.token))

            setTimeout(() => { disableEnableBtns(false) }, 1200)
            router.push(`/otp`)
        }
        catch (error) {
            const message = error as { response: string }
            Swal.fire({ icon: 'warning', title: 'Atenção', text: `${message.response}` })
            setTimeout(() => { disableEnableBtns(false) }, 1200)
        }
    }

    async function oAuthLogin(credentialGoogle: CredentialResponse) {
        try {
            disableEnableBtns(true)
            const details = jwtDecode(credentialGoogle.credential as string) as IOAuthGoogle
            const data: Omit<IUsuarios, 'id'> = { 'nome': details.name, 'email': details.email, 'senha': details.sub }

            const info = await ServicesUsuarios.create(data) as IResponseCreateUser
            const props = { 'id': info.id, 'id_otp': info.id_otp, 'email': info.email, 'token': info.token }
            const crypt = await ServicesUsuarios.encrypt({ 'data': props }, info.token) as { data: string }

            sessionStorage.setItem('data_user', JSON.stringify(crypt.data))
            sessionStorage.setItem('token', JSON.stringify(info.token))
            
            setTimeout(() => { disableEnableBtns(false) }, 1200)
            router.push(`/otp`)
        }
        catch (error) {
            const message = error as { response: string }
            setTimeout(() => { disableEnableBtns(false) }, 1500)
            Swal.fire({ icon: 'warning', title: 'Atenção', text: `${message.response}` })
        }
    }

    function failedOauth() {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'falha no processo de autenticação..'
        })
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center">
            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Cadastre-se</CardTitle>
                    <CardDescription>
                        Insira suas informações para criar uma conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">Nome</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    pattern=''
                                    required
                                    onChange={(e) => onChangeFirstName(e.target.value)}
                                    onFocus={() => alertInvalidFields('', 'hidden', 'name')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Sobrenome</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    required
                                    onChange={(e) => onChangeLastName(e.target.value)}
                                    onFocus={() => alertInvalidFields('', 'hidden', 'name')}
                                />
                            </div>
                        </div>
                        <p id="alert-name" className="hidden text-red-600 text-sm">
                            {alertMessageName}
                        </p>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => onChangeEmail(e.target.value)}
                                onFocus={() => alertInvalidFields('', 'hidden', 'email')}
                            />
                            <p id="alert-email" className="hidden text-red-600 text-sm">
                                {alertMessageEmail}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                onChange={(e) => onChangePassword(e.target.value)}
                                onFocus={() => alertInvalidFields('', 'hidden', 'password')}
                            />
                            <p id="alert-password" className="hidden text-red-600 text-sm">
                                {alertMessagePassword}
                            </p>
                        </div>
                        <Button
                            type='submit'
                            id='btn-create'
                            className="w-full"
                            onClick={() => validationFilds()}
                        >
                            Criar conta
                        </Button>
                        <GoogleOAuthProvider clientId={CLIENT_ID_GOOGLE}>
                            <GoogleLogin
                                width={330}
                                text='signup_with'
                                onSuccess={credentialResponse => oAuthLogin(credentialResponse)}
                                onError={() => failedOauth()}
                            />
                        </GoogleOAuthProvider>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Já possui uma conta?{" "}
                        <Link href="/" className="underline">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
'use client'
import * as yup from 'yup'
import Link from "next/link"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useState } from "react"
import { fieldsLogin, ILogin, ISessionData } from "@/types/login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServicesUsuarios } from "@/api/usuarios"

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [alertMessageEmail, setAlertMessageEmail] = useState<string>('')
    const [alertMessagePassword, setAlertMessagePassword] = useState<string>('')

    function onChangeEmail(email: string) {
        setEmail(email)
    }

    function onChangePassword(password: string) {
        setPassword(password)
    }

    function alertInvalidEmail(message: string, display: string) {
        const alert = document.getElementById('alert-email')
        if (alert == undefined) { return }

        setAlertMessageEmail(message)
        alert.style.display = display
    }

    function alertInvalidPassword(message: string, display: string) {
        const alert = document.getElementById('alert-password')
        if (alert == undefined) { return }

        setAlertMessagePassword(message)
        alert.style.display = display
    }

    function validationFilds() {
        try {
            const schema: yup.ObjectSchema<ILogin> = yup.object().shape(
                {
                    email: yup.string().required().min(6),
                    password: yup.string().required().min(4)
                }
            )

            schema.validateSync({ email, password }, { abortEarly: false })
            schema.type == 'object' && signIn()
        }
        catch (error) {
            const yupErro = error as yup.ValidationError
            const erroValidation: Record<string, string> = {}

            yupErro.inner.forEach(erro => {
                if (erro.path == undefined) { return }
                erroValidation[erro.path] = erro.message

                switch (erro.path) {
                    case fieldsLogin.email:
                        alertInvalidEmail(erro.message, 'block')
                        break;

                    case fieldsLogin.password:
                        alertInvalidPassword(erro.message, 'block')
                        break;
                }
            })
        }
    }

    function disableBtnLogin() {
        const btnLogin = document.getElementById('btn-login')
        if (btnLogin == undefined) { return }

        btnLogin.setAttribute('disabled', '')
        setTimeout(() => { btnLogin.removeAttribute('disabled') }, 1000)
    }

    function enableBtnLogin() {
        const btnLogin = document.getElementById('btn-login')
        if (btnLogin == undefined) { return }
        btnLogin.removeAttribute('disabled')
    }

    async function signIn() {
        try {
            disableBtnLogin()
            const request = await ServicesUsuarios.session({ 'email': email, 'senha': password }) as ISessionData
            const token = request.session.token
            console.log('Token', token)
        }
        catch (error) {
            setTimeout(() => { enableBtnLogin() }, 1500)
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Oops...', text: `${message.response}` })
        }
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => onChangeEmail(e.target.value)}
                                onFocus={() => alertInvalidEmail('', 'hidden')}
                            />
                            <p id="alert-email" className="hidden text-red-600 text-sm">
                                {alertMessageEmail}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                onChange={(e) => onChangePassword(e.target.value)}
                                onFocus={() => alertInvalidPassword('', 'hidden')}
                            />
                            <p id="alert-password" className="hidden text-red-600 text-sm">
                                {alertMessagePassword}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <Link href="#" target='_blank' className="inline-block text-sm underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            id='btn-login'
                            type="submit"
                            className="w-full disabled:opacity-50"
                            onClick={() => validationFilds()}
                        >
                            Login
                        </Button>
                        <Button 
                            id='btn-oauth'
                            variant="outline" 
                            className="w-full disabled:opacity-50"
                        >
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sing-up" target='_self' className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
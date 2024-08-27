'use client'
import * as yup from 'yup'
import Link from "next/link"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useState } from "react"
import { CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { fieldsLogin, ILogin, IOAuthGoogle, ISessionData } from "@/types/login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ServicesUsuarios } from "@/api/usuarios"
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [alertMessageEmail, setAlertMessageEmail] = useState<string>('')
  const [alertMessagePassword, setAlertMessagePassword] = useState<string>('')
  const router = useRouter()
  const CLIENT_ID_GOOGLE = process.env.NEXT_PUBLIC_CLIENTID as string

  function onChangeEmail(email: string) {
    setEmail(email)
  }

  function onChangePassword(password: string) {
    setPassword(password)
  }

  function alertInvalidFields(message: string, display: string, type: 'email' | 'password') {
    const alert = document.getElementById(`alert-${type}`)
    if (alert == undefined) { return }

    switch (type) {
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
            alertInvalidFields(erro.message, 'block', 'email')
            break;

          case fieldsLogin.password:
            alertInvalidFields(erro.message, 'block', 'password')
            break;
        }
      })
    }
  }

  function disableEnableBtns(active: boolean) {
    const btnLogin = document.getElementById('btn-login')
    if (btnLogin == undefined) { return }
    active ? btnLogin.setAttribute('disabled', '') : btnLogin.removeAttribute('disabled')
  }

  async function signIn() {
    try {
      disableEnableBtns(true)
      const request = await ServicesUsuarios.session({ 'email': email, 'senha': password }) as ISessionData
      const token = request.session.token

      localStorage.setItem('token', token)
      setTimeout(() => { disableEnableBtns(false) }, 1500)
      router.push('/')

    }
    catch (error) {
      setTimeout(() => { disableEnableBtns(false) }, 1500)
      const message = error as { response: string }
      Swal.fire({ icon: 'error', title: 'Oops...', text: `${message.response}` })
    }
  }

  async function oAuthLogin(credentialGoogle: CredentialResponse) {
    try {
      disableEnableBtns(true)
      const details = jwtDecode(credentialGoogle.credential as string) as IOAuthGoogle
      const data = { 'id_conta': details.sub, 'nome': details.name, 'email': details.email }

      const request = await ServicesUsuarios.sessionOAuth(data) as ISessionData
      const token = request.session.token

      localStorage.setItem('token', token)
      setTimeout(() => { disableEnableBtns(false) }, 1000)
      router.push('/')
    }
    catch (error) {
      setTimeout(() => { disableEnableBtns(false) }, 1500)
      Swal.fire({ icon: 'error', title: 'Oops, houve um erro..' })
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
    <main>
      <section className="w-svw h-svh flex justify-center items-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Insira seu e-mail e senha abaixo para fazer login em sua conta
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
                  required
                  onChange={(e) => onChangePassword(e.target.value)}
                  onFocus={() => alertInvalidFields('', 'hidden', 'password')}
                />
                <p id="alert-password" className="hidden text-red-600 text-sm">
                  {alertMessagePassword}
                </p>
              </div>
              <div className="flex justify-end">
                <Link href="#" target='_blank' className="inline-block text-sm underline">
                  Esqueceu a senha?
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
              <GoogleOAuthProvider clientId={CLIENT_ID_GOOGLE}>
                <GoogleLogin
                  width={330}
                  onSuccess={credentialResponse => oAuthLogin(credentialResponse)}
                  onError={() => failedOauth()}
                />
              </GoogleOAuthProvider>
            </div>
            <div className="mt-4 text-center text-sm">
              Não possui conta?{" "}
              <Link href="/sing-up" target='_self' className="underline">
                criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

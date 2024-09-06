'use client'
import * as yup from 'yup'
import '../../services/TranslationYup'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { IResponseUser } from "@/types/sing-up"
import { IContasAutenticada, IDataContasOTP, IOtpFields } from '@/types/otp'
import { ServicesOtp } from '@/api/otp'
import { useRouter } from 'next/navigation'
import { ServicesUsuarios } from '@/api/usuarios'
import { ServicesContas } from '@/api/contas'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function Otp() {
    const [id, setId] = useState<number>(0)
    const [idOtp, setIdOtp] = useState<number>(0)
    const [email, setEmail] = useState<string>('')
    const [token, setToken] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const route = useRouter()

    let id_otp = 0
    let acessToken = ''

    useEffect(() => {
        AuthScreen()

        const btn_resend = document.getElementById('btn-resend')
        if (btn_resend == undefined) { return }
        btn_resend.setAttribute('disabled', '')
    }, [])


    async function AuthScreen() {
        try {
            const message = 'O processo de validação de código OTP foi encerrado.'
            const data_user = JSON.parse(sessionStorage.getItem('data_user') as string)

            const token = sessionStorage.getItem('token') as string
            const decriptData = await ServicesUsuarios.decrypt({ 'data': data_user }, token.replace(/"/g, '')) as IResponseUser
            const id_user = decriptData.data.id

            if (data_user == undefined || data_user == null) {
                Swal.fire({ icon: 'warning', text: `${message}`, didClose: () => { route.push('/') } })
            }
            else {
                const messageWarning = 'Sua conta já foi autenticada! Você sera redirecionado para efetuar login.'
                const request = await ServicesContas.getById(id_user, token.replace(/"/g, '')) as IDataContasOTP
                console.log('Request', request)

                if (request.data.length == 0) { load() }
                else { Swal.fire({ icon: 'warning', text: `${messageWarning}`, didClose: () => { route.push('/') } }) }
            }
        }
        catch (error) {
            const message = 'Houve uma falha no carregamento das informações.'
            Swal.fire({ icon: 'error', title: 'Atenção!', text: message, didClose: () => redirectScreen() })
        }
    }

    async function load() {
        try {
            const data_user = JSON.parse(sessionStorage.getItem('data_user') as string)
            const token = sessionStorage.getItem('token') as string
            const decriptData = await ServicesUsuarios.decrypt({ 'data': data_user }, token.replace(/"/g, '')) as IResponseUser

            startTimer(1)
            setId(decriptData.data.id)
            setIdOtp(decriptData.data.id_otp)
            setEmail(decriptData.data.email)
            setToken(decriptData.data.token)

            id_otp = decriptData.data.id_otp
            acessToken = decriptData.data.token
        }
        catch (error) {
            const message = 'Houve uma falha no carregamento das informações.'
            Swal.fire({ icon: 'error', title: 'Atenção!', text: message, didClose: () => redirectScreen() })
        }
    }

    function alertInvalidFields() {
        Swal.fire({
            icon: 'error',
            title: 'Atenção',
            text: 'Todos os campos devem ser preenchidos!'
        })
    }

    function disableEnableBtn(active: boolean) {
        const btnLogin = document.getElementById('btn-auth')
        if (btnLogin == undefined) { return }
        active ? btnLogin.setAttribute('disabled', '') : btnLogin.removeAttribute('disabled')
    }

    function validationFilds() {
        try {
            const schema: yup.ObjectSchema<IOtpFields> = yup.object().shape(
                { code: yup.string().required().min(4).max(4) }
            )

            schema.validateSync({ code }, { abortEarly: false })
            schema.type == 'object' && authAccount()
        }
        catch (error) {
            const yupErro = error as yup.ValidationError
            const erroValidation: Record<string, string> = {}

            yupErro.inner.forEach(erro => {
                if (erro.path == undefined) { return }
                erroValidation[erro.path] = erro.message
                erro.path == 'code' && alertInvalidFields()
            })
        }
    }

    async function authAccount() {
        try {
            disableEnableBtn(true)
            const data = { 'id_usuario': id, 'id_otp': idOtp, 'codigo': code }
            const message = 'Verificação de conta realizada com sucesso!'

            await ServicesOtp.update(data, token)
            Swal.fire({ icon: 'success', text: message, didClose: () => redirectScreen() })
        }
        catch (error) {
            const message = error as { response: string }
            disableEnableBtn(false)
            Swal.fire({ icon: 'error', title: 'Atenção', text: `${message.response}` })
        }
    }

    function redirectScreen() {
        route.push('/')
    }

    function startTimer(inputMinutes: number) {
        let time = inputMinutes * 60
        const timerElement = document.getElementById('timer');
        if (timerElement == undefined) { return }

        const countdown = setInterval(() => {
            const minutes = Math.floor(time / 60)
            const seconds = time % 60
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (time <= 0) {
                clearInterval(countdown)
                invalidateCode()
            } else {
                time--
            }
        }, 1000)
    }

    async function invalidateCode() {
        try {
            const btn_resend = document.getElementById('btn-resend')
            if (btn_resend == undefined) { return }

            await ServicesOtp.invalidate({ 'id_otp': id_otp }, acessToken)
            Swal.fire({ icon: 'warning', title: 'Código Expirado', text: 'O tempo limite para o código de validação foi atingido!' })

            btn_resend.style.color = '#0284c7'
            btn_resend.style.textDecoration = 'underline'
            btn_resend.removeAttribute("disabled")
        } catch (error) {
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Atenção', text: `${message.response}` })
        }
    }

    async function resendCode() {
        try {
            const btn_resend = document.getElementById('btn-resend')
            if (btn_resend == undefined) { return }

            const response = await ServicesOtp.resend({ 'email': email }, token) as { id: number }
            const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true })
            Toast.fire({ icon: 'success', title: 'Código reenviado com sucesso!' })

            startTimer(1)
            setIdOtp(response.id)
            id_otp = response.id
            acessToken = token

            btn_resend.style.cursor = 'none'
            btn_resend.style.color = '#71717A'
            btn_resend.style.textDecoration = 'none'
            btn_resend.setAttribute('disabled', '')
        }
        catch (error) {
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Atenção', text: `${message.response}` })
        }
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center bg-white p-5">
            <article className="w-svw h-3/5 border-solid border-zinc-300 border-[1.5px] rounded-xl shadow-xl shadow-slate-200 md:w-[450px] md:h-96">
                <div className="w-full h-1/3 flex flex-col justify-end items-center gap-2">
                    <p className="text-[#09090B] font-bold uppercase block">
                        Verificação OTP
                    </p>
                    <div>
                        <p className="text-center text-sm text-[#71717A] block">
                            Enviamos o código para o endereço
                        </p>
                        <p className="text-center text-sm text-sky-600 italic">
                            {email}
                        </p>
                    </div>
                </div>
                <div className="w-full h-40 flex flex-col justify-center items-center">
                    <div className='w-full h-32 flex justify-center items-center'>
                        <InputOTP
                            maxLength={6}
                            onChange={(value) => setCode(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="w-12 h-12 rounded-md border-solid border-[#71717A] border-[0.5px] m-2 text-xl text-[#09090B]" />
                                <InputOTPSlot index={1} className="w-12 h-12 rounded-md border-solid border-[#71717A] border-[0.5px] m-2 text-xl text-[#09090B]" />
                                <InputOTPSlot index={2} className="w-12 h-12 rounded-md border-solid border-[#71717A] border-[0.5px] m-2 text-xl text-[#09090B]" />
                                <InputOTPSlot index={3} className="w-12 h-12 rounded-md border-solid border-[#71717A] border-[0.5px] m-2 text-xl text-[#09090B]" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className='w-full h-20 flex flex-col justify-center items-center'>
                        <div className='w-full flex justify-center items-center'>
                            <p id='timer' className="text-center text-md text-[#71717A] block"></p>
                        </div>
                        <div className='w-full flex justify-center items-center'>
                            <p className="text-sm" onClick={() => console.log('pega tua pisa')}>
                                Não recebeu o código?
                            </p>
                            <button id='btn-resend' onClick={() => resendCode()} className="text-[#71717A] text-sm ml-1">
                                Reenviar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-start items-center py-4">
                    <Button id='btn-auth' onClick={() => validationFilds()} className="w-3/4 text-white">
                        Validar
                    </Button>
                </div>
            </article>
        </section>
    )
}
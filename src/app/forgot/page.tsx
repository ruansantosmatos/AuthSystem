'use client'
import * as yup from 'yup'
import Link from "next/link"
import Swal from 'sweetalert2'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IFieldForgot } from '@/types/forgot';
import { ServicesSenhas } from '@/api/senhas';

export default function Forgot() {
    const [email, setEmail] = useState<string>('')
    const [alertMessageEmail, setAlertMessageEmail] = useState<string>('')

    function onChangeEmail(email: string) {
        setEmail(email)
    }

    function validationFilds() {
        try {
            const schema: yup.ObjectSchema<IFieldForgot> = yup.object().shape(
                { email: yup.string().required().min(6) }
            )

            schema.validateSync({ email }, { abortEarly: false })
            schema.type == 'object' && updatePassword()
        }
        catch (error) {
            const yupErro = error as yup.ValidationError
            const erroValidation: Record<string, string> = {}

            yupErro.inner.forEach(erro => {
                if (erro.path == undefined) { return }
                erroValidation[erro.path] = erro.message
                erro.path == 'email' && alertInvalidFields(erro.message, 'block', 'email')
            })
        }
    }

    function alertInvalidFields(message: string, display: string, type: 'email') {
        const alert = document.getElementById(`alert-${type}`)
        if (alert == undefined) { return }

        switch (type) {
            case 'email':
                setAlertMessageEmail(message)
                alert.style.display = display
                break;
        }
    }

    function disableEnableBtn(active: boolean) {
        const btnLogin = document.getElementById('btn-send')
        if (btnLogin == undefined) { return }
        active ? btnLogin.setAttribute('disabled', '') : btnLogin.removeAttribute('disabled')
    }

    async function updatePassword() {
        try {
            disableEnableBtn(true)
            await ServicesSenhas.create({ 'email': email })
            const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true })
            Toast.fire({ icon: 'success', title: 'Código enviado com sucesso!' })
        }
        catch (error) {
            disableEnableBtn(false)
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Atenção', text: `${message.response}` })
        }
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center bg-white p-5">
            <article className="w-svw h-2/5 border-solid border-zinc-300 border-[1.5px] rounded-xl shadow-xl shadow-slate-200 md:w-[450px] md:h-80">
                <div className="w-full h-1/3 flex flex-col justify-end items-center gap-2">
                    <p className="text-[#09090B] font-bold uppercase block">
                        Esqueceu a senha
                    </p>
                    <div className="w-full px-2">
                        <p className="text-center text-sm text-[#71717A] block text-wrap">
                            Digite o endereço de email para enviarmos o código de redefinição de senha
                        </p>
                    </div>
                </div>
                <div className="w-full h-28 flex flex-col justify-center items-center px-8">
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="w-full"
                        onChange={(e) => onChangeEmail(e.target.value)}
                        onFocus={() => alertInvalidFields('', 'none', 'email')}
                    />
                    <div className='w-full px-2'>
                        <p id="alert-email" className="hidden text-red-600 text-sm">
                            {alertMessageEmail}
                        </p>
                    </div>
                </div>
                <div className="w-full h-20 flex flex-col justify-start items-center">
                    <Button id='btn-send' onClick={() => validationFilds()} className="w-3/4 text-white">
                        Enviar
                    </Button>
                </div>
            </article>
        </section>
    )
}
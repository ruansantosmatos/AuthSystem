'use client'
import Swal from 'sweetalert2'
import { ServicesSenhas } from "@/api/senhas"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import imgSecury from '../../../../public/security.png'

export default function StepOne() {
    const route = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => { AuthScreen() }, [])

    function redirectScreen(path: string) {
        route.push(path)
    }

    function alert(message: string, cb: () => void) {
        Swal.fire({ icon: 'error', title: 'Oops', text: `${message}`, didClose: () => { cb() } })
    }

    async function authToken() {
        try {
            const id = parseInt(searchParams.get('id') as string)

            const token = searchParams.get('token') as string
            await ServicesSenhas.update({ 'id': id }, token)
        }
        catch (error) {
            const message = 'Houve uma falha no processo de autenticação'
            alert(message, () => redirectScreen('/'))
        }
    }

    function AuthScreen() {
        const id = parseInt(searchParams.get('id') as string)
        const token = searchParams.get('token') as string
        const message = 'Por questões de segurança da informação, estamos redirecionando você!'

        if (id == undefined || token == undefined) { alert(message, () => redirectScreen('/')) }
        else { authToken() }
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center bg-white p-5">
            <article className="w-svw h-3/5 border-solid border-zinc-300 border-[1.5px] rounded-xl shadow-xl shadow-slate-200 md:w-[450px] md:h-96">
                <div className="w-full h-[40%] flex flex-col justify-end items-center ">
                    <Image src={imgSecury} alt='logo' className='object-contain w-20' />
                    <p className='text-xl text-green-500'>Sucesso!</p>
                </div>
                <div className="w-full h-24 flex flex-col justify-center items-center px-8 text-md text-center">
                    <p>
                        Autenticação realizada com sucesso.
                        Clique em continuar para redefinir sua senha
                    </p>
                </div>
                <div className="w-full h-20 flex flex-col justify-center items-center">
                    <Button id='btn-redirect' onClick={() => console.log('aaaa')} className="w-3/4 text-white">
                        Continuar
                    </Button>
                </div>
            </article>
        </section>
    )
}
'use client'
import Image from "next/image"
import userIcon from '../../../public/user.png'
import iconLogo from '../../../public/tick-mark.png'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ISession, IUserData } from "@/types/login"
import { ServicesUsuarios } from "@/api/usuarios"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {

    const [user, setUser] = useState<string>('')
    const route = useRouter()
    const data = JSON.parse(localStorage.getItem('session') as string) as ISession

    useEffect(() => { AuthScreen() }, [])

    function AuthScreen() {
        if (data == null || data == undefined) {
            const message = 'É necessário efetuar login para continuar'
            Swal.fire({ icon: 'warning', title: 'Atenção', text: `${message}`, didClose: () => { route.push('/') } })
        }
        else {
            getUser()
        }
    }

    async function getUser() {
        try {
            const id = data.id
            const token = data.token
            const request = await ServicesUsuarios.getById(id, token) as IUserData
            const name = request.data[0].nome.split(' ')[0]
            setUser(name)
        }
        catch (error) {
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Atenção', text: `${message.response}`, didClose: () => route.push('/') })
        }
    }

    function logOut(){
        localStorage.removeItem('session')
        route.push('/')
    }

    return (
        <section className="w-svw h-svh">
            <header className="w-full h-16 flex justify-end items-center pr-8 bg-white">
                <article>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="overflow-hidden rounded-full border-2 border-black"
                            >
                                <Image
                                    src={userIcon}
                                    alt="Avatar"
                                    className="w-7 h-7 overflow-hidden rounded-full"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Configurações</DropdownMenuItem>
                            <DropdownMenuItem>Suporte</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logOut()}>Sair</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </article>
            </header>
            <article className="w-svw h-svh flex justify-center items-center bg-white">
                <section className="w-svw h-svh flex justify-center items-center bg-white p-5">
                    <article className="w-svw h-[450px] border-solid border-zinc-300 border-[1.5px] rounded-xl shadow-xl shadow-slate-200 md:w-[450px] md:h-96">
                        <div className="w-full h-[40%] flex flex-col items-center gap-3 py-6">
                            <Image src={iconLogo} alt='logo' className='object-contain w-20' />
                            <p className='text-xl text-black'>Muito Obrigado {user}!</p>
                        </div>
                        <div className="w-full h-24 flex flex-col justify-center items-center px-8 text-sm text-center">
                            <p>
                                Agradeço por analisar o projeto, conto com seu feedback para criar
                                soluções ainda mais perfomáticas, seguras, intuitivas e dinâmicas.
                            </p>
                        </div>
                        <div className="w-full h-20 flex flex-col justify-end items-center">
                            <Button id='btn-redirect' onClick={() => console.log('teste')} className="w-3/4 text-white">
                                Acessar Github
                            </Button>
                        </div>
                    </article>
                </section>
            </article>
        </section >
    )
}
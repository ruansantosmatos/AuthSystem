'use client'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ServicesUsuarios } from "@/api/usuarios"
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StepTwo() {
    let newPassword = ''
    const route = useRouter()

    const searchParams = useSearchParams()

    const id_user = parseInt(searchParams.get('user') as string)
    const token = searchParams.get('token') as string

    const requirements = [
        { regex: /.{8,}/, index: 0 },
        { regex: /[0-9]/, index: 1 },
        { regex: /[a-z]/, index: 2 },
        { regex: /[^A-Za-z0-9]/, index: 3 },
        { regex: /[A-Z]/, index: 4 }
    ]

    useEffect(() => { AuthScreen() }, [])

    function AuthScreen() {
        const message = 'O processo de redefinição de senha foi encerrado por questões de segurança, estamos redirecionando você!'
        if (token == undefined || id_user == undefined) {
            alert(message, () => redirectScreen('/'))
        }
    }

    function redirectScreen(path: string) {
        route.push(path)
    }

    function alert(message: string, cb: () => void) {
        Swal.fire({ icon: 'error', title: 'Oops', text: `${message}`, didClose: () => { cb() } })
    }

    function onChangePassword(password: string) {
        const requirementList = document.querySelectorAll("li")
        const btnUpdate = document.getElementById('btn-update')

        if (btnUpdate == undefined) { return }

        newPassword = password
        requirements.forEach(item => {
            const isValid = item.regex.test(password)
            const requirementItem = requirementList[item.index]

            if (requirementItem.firstElementChild == null || requirementItem.lastElementChild == null) { return }

            if (isValid) {
                requirementItem.firstElementChild.className = 'fa-solid fa-check text-green-500'
                requirementItem.lastElementChild.className = 'ml-3 text-[#71717A]'
                newPassword = password
            }
            else {
                requirementItem.firstElementChild.className = 'fa-solid fa-circle text-[8px]'
                requirementItem.lastElementChild.className = 'ml-3'
            }
        })
        enableDisableBtn()
        console.log('senha', newPassword)
    }

    function enableDisableBtn() {
        const btnUpdate = document.getElementById('btn-update')
        const iconsChek = document.getElementsByClassName('fa-solid fa-check')

        if (btnUpdate == undefined) { return }

        if (iconsChek.length == requirements.length) {
            btnUpdate.removeAttribute('disabled')
            btnUpdate.style.opacity = '1'
            btnUpdate.addEventListener('click', updatePassword)
        }
        else {
            btnUpdate.setAttribute('disabled', '')
            btnUpdate.style.opacity = '0.5'
        }
    }

    async function updatePassword() {
        try {
            const data = { 'id_usuario': id_user, 'senha': newPassword }
            const request = await ServicesUsuarios.update(data, token) as { response: string }
            Swal.fire({ icon: 'success', text: `${request.response}`, didClose: () => { redirectScreen('/') } })
        }
        catch (error) {
            const message = error as { response: string }
            Swal.fire({ icon: 'error', title: 'Oops...', text: `${message.response}` })
        }
    }


    return (
        <section className="w-svw h-svh flex justify-center items-center px-6">
            <Card className="max-w-sm h-[480px] shadow-md md:h-[440px]">
                <CardHeader>
                    <CardTitle className="text-xl">Nova Senha</CardTitle>
                    <CardDescription>
                        Insira sua nova senha para concluir o processo de redefinição
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="passwordOne" type="password" onChange={(e) => onChangePassword(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <div className="w-full text-sm px-3 md:text-[16px]">
                                <p>A senha deve conter</p>
                                <ul className="mt-1">
                                    <li className='flex items-center align-middle'>
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span className="ml-3">Pelo menos 6 caracteres</span>
                                    </li>
                                    <li className='flex items-center align-middle'>
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span className="ml-3">Pelo menos 1 número (0...9)</span>
                                    </li>
                                    <li className='flex items-center align-middle'>
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span className="ml-3">Pelo menos 1 letra minúscula (a...z)</span>
                                    </li>
                                    <li className='flex items-center align-middle'>
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span className="ml-3">Pelo menos 1 símbolo especial (!...$)</span>
                                    </li>
                                    <li className='flex items-center align-middle'>
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span className="ml-3">Pelo menos 1 letra maiúscula (A...Z)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Button type='submit' id='btn-update' className="w-full mt-2" disabled>
                            Atualizar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
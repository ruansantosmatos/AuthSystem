'use client'
import * as yup from 'yup'
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fieldSingUp, ISingUp } from '@/types/sing-up'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SingUp() {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [alertMessageName, setAlertMessageName] = useState<string>('')
    const [alertMessageEmail, setAlertMessageEmail] = useState<string>('')
    const [alertMessagePassword, setAlertMessagePassword] = useState<string>('')

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

    function alertInvalidName(message: string, display: string) {
        const alert = document.getElementById('alert-name')
        if (alert == undefined) { return }

        setAlertMessageName(message)
        alert.style.display = display
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
            const schema: yup.ObjectSchema<ISingUp> = yup.object().shape(
                {
                    firstName: yup.string().required().min(3),
                    lastName: yup.string().required().min(5),
                    email: yup.string().required().min(6),
                    password: yup.string().required().min(4)
                }
            )

            schema.validateSync({ firstName, lastName, email, password }, { abortEarly: false })
            schema.type == 'object' && console.log('AIII NOBRU APELÃO')
        }
        catch (error) {
            const yupErro = error as yup.ValidationError
            const erroValidation: Record<string, string> = {}

            yupErro.inner.forEach(erro => {
                if (erro.path == undefined) { return }
                erroValidation[erro.path] = erro.message

                switch (erro.path) {
                    case fieldSingUp.firstName:
                        alertInvalidName(`first name too short`, 'block')
                        break;

                    case fieldSingUp.lastName:
                        alertInvalidName('last name too short', 'block')
                        break;

                    case fieldSingUp.email:
                        alertInvalidEmail(erro.message, 'block')
                        break;

                    case fieldSingUp.password:
                        alertInvalidPassword(erro.message, 'block')
                        break;
                }
            })
        }
    }

    return (
        <section className="w-svw h-svh flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    pattern=''
                                    required
                                    onChange={(e) => onChangeFirstName(e.target.value)}
                                    onFocus={() => alertInvalidName('', 'hidden')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    required
                                    onChange={(e) => onChangeLastName(e.target.value)}
                                    onFocus={() => alertInvalidName('', 'hidden')}
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
                                onChange={(e) => onChangePassword(e.target.value)}
                                onFocus={() => alertInvalidPassword('', 'hidden')}
                            />
                            <p id="alert-password" className="hidden text-red-600 text-sm">
                                {alertMessagePassword}
                            </p>
                        </div>
                        <Button onClick={() => validationFilds()} type="submit" className="w-full">
                            Create an account
                        </Button>
                        <Button variant="outline" className="w-full">
                            Sign up with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
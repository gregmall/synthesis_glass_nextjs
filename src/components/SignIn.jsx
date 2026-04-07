'use client'
import React, { useState } from 'react'
import { auth } from '../config/Config';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Vortex } from 'react-loader-spinner';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Input } from "@material-tailwind/react"

const SignIn = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState('');

    const handlePasswordShow = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const handleLogin = (e) => {
        setLoading(true);
        e.preventDefault();

        auth.signInWithEmailAndPassword(email, password).then(() => {
            setTimeout(() => {
                setLoading(false)
                setEmail('');
                setPassword('');
                router.push('/')
            }, 1000)
        }).catch(error => {
            setErrorMsg(error.message)
            setLoading(false)
        });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            {loading ?
                <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                /> :
                <div className='p-4 w-full max-w-xs bg-white rounded-md'>
                    <h2>Sign In</h2>
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleLogin}>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} icon={showPassword ? <GoEye onClick={handlePasswordShow} /> : <GoEyeClosed onClick={handlePasswordShow} />} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button className='my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type="submit">Sign In</button>
                            <span className='text-xs'>Don't have an account? Sign up <Link href="/signup" className='text-[#00df9a] font-extrabold'>here</Link></span>
                        </div>
                        {errorMsg && <span>{errorMsg.slice(10)}</span>}
                    </form>
                </div>}
        </div>
    )
}

export default SignIn

'use client'
import React, { useState } from 'react'
import { db, auth } from '../config/Config';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Vortex } from 'react-loader-spinner';
import { Input, Checkbox } from "@material-tailwind/react";
import ReCAPTCHA from 'react-google-recaptcha';

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [captchaValue, setCaptchaValue] = useState(null);

    const router = useRouter();

    const handlePasswordShow = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const Signup = (e) => {
        e.preventDefault();
        setLoading(true)
        auth.createUserWithEmailAndPassword(email, password).then((cred) => {
            db.collection('users').doc(cred.user.uid).set({
                name: name,
                email: email,
                userRole: 'USER',
                id: cred.user.uid,
                ageVerified: true,
                cart: [],
                history: [],
                orders: [],
            }).then(() => {
                setLoading(false);
                setName('');
                setEmail('');
                setPassword('');
                router.push('/')
            }).catch(err => {
                setErrorMsg(err.message);
                setLoading(false)
            })
        }).catch(err => {
            setErrorMsg(err.message);
            setLoading(false)
        })
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
                <div className='p-4 w-full max-w-sm bg-white rounded-md content-center'>
                    <h2 className='flex justify-center font-bold'>Sign Up</h2>
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={Signup}>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>Name</label>
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={(e) => setName(e.target.value)} value={name} required/>
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} icon={showPassword ? <GoEye onClick={handlePasswordShow} required/> : <GoEyeClosed onClick={handlePasswordShow} />} />
                        </div>
                        <div>
                            <Checkbox label="I am at least 21 years old" required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button className='my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type="submit" disabled={!captchaValue}>Register!</button>
                            <span className='text-xs'>Already have an account? Sign in <Link href="/signin" className='text-[#00df9a] font-extrabold'>here</Link></span>
                        </div>
                        <ReCAPTCHA
                            className='flex justify-center mt-4'
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={(value) => setCaptchaValue(value)}
                        />  
                        {errorMsg && <span>{errorMsg.slice(10)}</span>}
                    </form>
                </div>}
        </div>
    )
}

export default SignUp;

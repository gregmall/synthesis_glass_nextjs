'use client'
import React, { useState } from 'react'
import { db } from '../config/Config';
import { useRouter } from 'next/navigation';
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
    Spinner
} from "@material-tailwind/react";

const QuestionForm = () => {
    const router = useRouter();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [content, setContent] = useState();
    const [loading, setLoading] = useState(false)

    const getQuestion = () => {
        // Use a stable index instead of random to avoid hydration mismatch
        const array = ['Do you make bubblers?', 'Can I customize colors?', 'Do you ship to Canada?', 'Do you make 19mm bowls?', 'Do you do repair work?']
        return array[0]
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const today = Date.now();

        try {
            await db.collection('formSubmission').add({
                name: name,
                content: content,
                email: email,
                date: today
            })
                .then(setLoading(false))
                .finally(() => {
                    alert('Form Submitted! We will get back to you ASAP')
                    router.push('/')
                })
        }
        catch (error) {
            console.log(error.message)
            alert(`Error submitting form: ${error.message}`)
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center mt-4'>
            {loading ?
                <Spinner /> :
                <Card color="white" shadow={false} className='min-w-fit p-11'>
                    <Typography variant="h4" color="blue-gray">
                        Have a Question?
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Enter any question or comment below. <br /> Please include your email so that we can respond ASAP
                    </Typography>

                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Your Name
                            </Typography>
                            <Input
                                size="lg"
                                type='text'
                                placeholder="Ronnie James Dio"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setName(e.target.value)} value={name}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Your Email
                            </Typography>
                            <Input
                                size="lg"
                                type="email"
                                placeholder="LemmieIsGod@rock.com"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setEmail(e.target.value)} value={email}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Question/Comment/Inquiry
                            </Typography>
                            <Textarea
                                type='text'
                                size="lg"
                                placeholder={getQuestion()}
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setContent(e.target.value)} value={content}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />

                            <Button className="mt-6" fullWidth type='submit'>
                                Submit
                            </Button>
                        </div>
                        <Typography color="gray" className="mt-4 text-center font-normal">
                            Prefer to email?{" "}
                            <a href="mailto:greg@synthesisglass.com?subject=Hi! I have an inquiry regarding your glass work..." className='text-blue-500 font-bold'>Click Here</a>
                        </Typography>
                    </form>
                </Card>
            }
        </div>
    )
}

export default QuestionForm;

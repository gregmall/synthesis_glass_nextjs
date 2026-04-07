'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { db } from '../../config/Config'

export default function FormSubmissions() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getQuestions();
    }, []);

    const getQuestions = async () => {
        let array = [];

        const feedback = await db.collection('formSubmission').get();

        for (const snap of feedback.docs) {
            const data = snap.data();
            data.ID = snap.id;
            array.push({ ...data });
            array.sort((a, b) => b.date - a.date);
        }

        setQuestions(array);
    };

    return (
        <div className='flex justify-center mt-10'>
            <div className='p-4 w-full max-w-lg bg-white rounded-md'>
                <h1 className='border-b-2 mt-4 text-4xl text-center'>Form Submissions</h1>

                {questions.map(item => {
                    let mail = "mailto:" + item.email;
                    return (
                        <React.Fragment key={item.ID}>
                            <div>Name: {item.name}</div>
                            <div>Email: <a href={mail} className='text-blue-500 font-bold'>{item.email}</a></div>
                            <div>Date: {new Date(item?.date).toLocaleDateString()}</div>
                            <div className='border-b-4'>Message: {item.content}</div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}

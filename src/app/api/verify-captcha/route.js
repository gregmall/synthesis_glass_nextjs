import { NextResponse } from 'next/server';

export async function POST(request) {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ success: false, error: 'Missing captcha token' }, { status: 400 });
    }

    const params = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
    });

    const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await verifyRes.json();

    if (!data.success) {
        return NextResponse.json({ success: false, error: 'Captcha verification failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}

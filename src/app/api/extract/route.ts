import { NextResponse } from 'next/server';
import process from 'process';

export async function POST() {
    return NextResponse.json({
        key: process.env.APP_KEY!
    });
}
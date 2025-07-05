// File: app/api/generate-report/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Replace with your actual Flask backend URL
    const flaskBackendUrl = "http://localhost:7000/generate-report";
    
    const response = await fetch(flaskBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate tax report');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating tax report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

// In production, store in database (Postgres, Supabase, etc.)
// For now, store in memory and expose via admin endpoint
let waitlist: { email: string; joinedAt: string }[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Check if already on list
    const existing = waitlist.find(w => w.email === email);
    if (existing) {
      return NextResponse.json({ message: 'Already on waitlist!' }, { status: 200 });
    }

    // Add to waitlist
    waitlist.push({
      email,
      joinedAt: new Date().toISOString()
    });
    
    console.log('📧 New waitlist signup:', email);
    console.log('📊 Total waitlist:', waitlist.length);

    return NextResponse.json({ 
      success: true, 
      message: 'Added to waitlist!',
      position: waitlist.length
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    emails: waitlist.map(w => w.email),
    count: waitlist.length
  });
}
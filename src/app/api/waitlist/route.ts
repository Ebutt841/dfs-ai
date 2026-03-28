import { NextResponse } from 'next/server';

// In production, store in database (Postgres, Supabase, etc.)
// For now, we'll log to console and return success
let waitlist: string[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Check if already on list
    if (waitlist.includes(email)) {
      return NextResponse.json({ message: 'Already on waitlist!' }, { status: 200 });
    }

    // Add to waitlist
    waitlist.push(email);
    
    // Log for now (replace with database in production)
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
    count: waitlist.length,
    message: 'Use POST to add email to waitlist'
  });
}
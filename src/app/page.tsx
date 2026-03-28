'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl">🏈</div>
            <span className="text-xl font-bold">DFS-AI</span>
          </div>
          <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
          <a href="/draft" className="text-zinc-400 hover:text-white transition-colors">Draft Room</a>
          <a href="/assistant" className="text-zinc-400 hover:text-white transition-colors">AI Assistant</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            The future of DFS is personal
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Own <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI DFS Assistant</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Wake up every morning with a personalized NFL DFS briefing. 
            Injury alerts, value plays, bankroll tracking — all自动.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {submitted ? (
              <div className="bg-green-900/30 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl text-lg">
                ✓ You're on the list! We'll be in touch.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </div>
          
          <p className="text-zinc-500 text-sm mt-4">
            Free 7-day trial when we launch • No spam, ever
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything your DFS life — <span className="text-zinc-500">automated</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-green-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">💰</div>
              <h3 className="text-xl font-bold mb-3">Bankroll Manager</h3>
              <p className="text-zinc-400">
                Track deposits, spending, and winnings. Get alerts when you're approaching your weekly budget limit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
              <h3 className="text-xl font-bold mb-3">Contest Scout</h3>
              <p className="text-zinc-400">
                Each morning, your bot reviews available contests matching your prefs — GPPs, cash games, entry limits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
              <h3 className="text-xl font-bold mb-3">Morning Briefing</h3>
              <p className="text-zinc-400">
                Wake up to injury reports, weather forecasts, Vegas lines, snap counts, and top plays for the slate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-red-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">🚨</div>
              <h3 className="text-xl font-bold mb-3">Breaking News Alerts</h3>
              <p className="text-zinc-400">
                Instant alerts when injury news breaks. Your bot monitors beat reporters and NFL injury reports 24/7.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-yellow-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">👀</div>
              <h3 className="text-xl font-bold mb-3">Player Pool</h3>
              <p className="text-zinc-400">
                Your bot builds and updates a watchlist based on your style — value plays, fades, and targets.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-orange-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">⚙️</div>
              <h3 className="text-xl font-bold mb-3">Fully Customizable</h3>
              <p className="text-zinc-400">
                Set your budget, favorite teams, preferred contest types, and delivery time. Your bot, your rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create Your Bot</h3>
                <p className="text-zinc-400">Sign up and configure your AI assistant — set your weekly budget, favorite teams, and contest preferences.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Set Your Preferences</h3>
                <p className="text-zinc-400">Choose when to receive your daily briefing, which notifications you want, and how aggressive your play style is.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Wake Up to Winning</h3>
                <p className="text-zinc-400">Every morning at your chosen time, your bot sends a personalized digest with everything you need to dominate that day's slates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-zinc-400 mb-10">Start free, upgrade when you're ready</p>
          
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-blue-500/50 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              MOST POPULAR
            </div>
            
            <div className="text-5xl font-bold mb-2">$29<span className="text-xl text-zinc-500">/mo</span></div>
            <p className="text-zinc-400 mb-8">Full AI DFS Assistant</p>
            
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                Daily morning briefing
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                Bankroll tracking & alerts
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                Contest recommendations
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                Player pool management
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                Breaking news alerts
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                7-day free trial
              </li>
            </ul>

            {submitted ? (
              <div className="bg-green-900/30 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl">
                ✓ You're on the list!
              </div>
            ) : (
              <button
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition-all"
              >
                Get Early Access
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">🏈</div>
            <span className="font-bold">DFS-AI</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 DFS-AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
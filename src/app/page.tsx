// app/page.tsx (App Router)
'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('backend');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sendingJobs, setSendingJobs] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !phoneNumber) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phoneNumber: '+91' + phoneNumber.trim(),
          categories: [category],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUserId(data.userId);
        setStep('otp');
      } else {
        alert('Failed to register user');
      }
    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('success');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-black bg-gray-100 p-4">
      {step === 'form' && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Register</h1>
          <input
            className="w-full border p-2 mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="w-full border p-2 mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </select>
          <div className="flex mb-3">
            <span className="inline-flex items-center px-3 border border-r-0 bg-gray-200">+91</span>
            <input
              type="tel"
              className="w-full border p-2"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Enter OTP</h1>
          <input
            className="w-full border p-2 mb-3"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-green-100 p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <h1 className="text-xl font-bold mb-4 text-green-700">User Verified ✅</h1>
          <button
            onClick={async () => {
              setSendingJobs(true);
              setMessage('');
              try {
                const res = await fetch('/api/user/send-jobs', { method: 'POST' });
                const data = await res.json();

                if (res.ok) {
                  setMessage('✅ Jobs sent via WhatsApp!');
                } else {
                  setMessage(`❌ ${data.error}`);
                }
              } catch (err: any) {
                setMessage(`❌ Unexpected error: ${err.message}`);
              } finally {
                setSendingJobs(false);
              }
            }}
            disabled={sendingJobs}
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {sendingJobs ? 'Sending...' : 'Send Jobs'}
          </button>
          {message && <p className="mt-4 text-sm text-gray-800">{message}</p>}
        </div>
      )}
    </main>
  );
}




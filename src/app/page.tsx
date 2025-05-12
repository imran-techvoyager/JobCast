// app/page.tsx (App Router)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const isValidIndianNumber = (num: string) => /^[6-9]\d{9}$/.test(num);

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'backend',
    phoneNumber: '',
    otp: '',
  });
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [loading, setLoading] = useState({
    submit: false,
    verify: false,
    jobs: false,
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!formData.name || !formData.phoneNumber) {
      setMessage('❌ Please fill all fields');
      return;
    }

    if (!isValidIndianNumber(formData.phoneNumber)) {
      setMessage('❌ Invalid Indian phone number');
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));
    setMessage('');

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: `+91${formData.phoneNumber}`,
          category: formData.category,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUserId(data.userId);
      setStep('otp');
      setMessage('✅ OTP sent successfully!');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleVerify = async () => {
    if (!formData.otp) {
      setMessage('❌ Please enter the OTP');
      return;
    }

    setLoading(prev => ({ ...prev, verify: true }));
    setMessage('');

    try {
      const res = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          otp: formData.otp 
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setStep('success');
        setMessage('✅ Verification successful!');
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, verify: false }));
    }
  };

  const handleResendOtp = async () => {
    setLoading(prev => ({ ...prev, submit: true }));
    setMessage('');
    
    try {
      const res = await fetch('/api/user/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error('Failed to resend OTP');
      
      setMessage('✅ New OTP sent successfully');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleSendJobs = async () => {
    setLoading(prev => ({ ...prev, jobs: true }));
    setMessage('');

    try {
      const res = await fetch('/api/send-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ Jobs sent via WhatsApp!');
      } else {
        throw new Error(data.error || 'Failed to send jobs');
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-black bg-gray-100 p-4">
      {step === 'form' && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Register</h1>
          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <select
            className="w-full border p-2 mb-3 rounded"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </select>
          <div className="flex mb-3">
            <span className="inline-flex items-center px-3 border border-r-0 bg-gray-200 rounded-l">
              +91
            </span>
            <input
              type="tel"
              className="w-full border p-2 rounded-r"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                phoneNumber: e.target.value.replace(/\D/g, '')
              }))}
              maxLength={10}
            />
          </div>
          {message && <p className="mb-3 text-sm text-red-600">{message}</p>}
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading.submit}
          >
            {loading.submit ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Enter OTP</h1>
          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="OTP"
            value={formData.otp}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              otp: e.target.value.replace(/\D/g, '')
            }))}
            maxLength={6}
          />
          {message && <p className="mb-3 text-sm text-red-600">{message}</p>}
          <div className="flex gap-2">
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
              onClick={handleVerify}
              disabled={loading.verify}
            >
              {loading.verify ? 'Verifying...' : 'Verify'}
            </button>
            <button
              className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={handleResendOtp}
              disabled={loading.submit}
            >
              Resend
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-green-100 p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <h1 className="text-xl font-bold mb-4 text-green-700">User Verified ✅</h1>
          <button
            onClick={handleSendJobs}
            disabled={loading.jobs}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading.jobs ? 'Sending...' : 'Send Jobs'}
          </button>
          {message && <p className="mt-4 text-sm text-gray-800">{message}</p>}
        </div>
      )}
    </main>
  );
}




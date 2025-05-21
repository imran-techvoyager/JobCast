'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const isValidIndianNumber = (num: string) => /^[6-9]\d{9}$/.test(num);

export default function Register() {
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
      setMessage('Please fill all fields');
      return;
    }

    if (!isValidIndianNumber(formData.phoneNumber)) {
      setMessage('Invalid Indian phone number');
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
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUserId(data.userId);
      setStep('otp');
      setMessage('OTP sent successfully!');
    } catch (err: any) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleVerify = async () => {
    if (!formData.otp) {
      setMessage('Please enter the OTP');
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
        setMessage('');
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
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
      
      setMessage('New OTP sent successfully');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
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
        body: JSON.stringify({
           userId,
           category: formData.category,
          }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('Jobs sent via WhatsApp!');
      } else {
        throw new Error(data.error || 'Failed to send jobs');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] p-4">
      <div className="w-full max-w-md">
        {step === 'form' && (
          <>
            <div className="w-full mb-6 flex items-center">
              <button 
                onClick={goBack} 
                className="text-gray-600 flex items-center hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </div>
            
            <Card className="shadow-md border-none">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h1 className="text-5xl font-bold mb-4 z-10 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">Get Registered</h1>
                  <p className="text-gray-600">Join JobCast and revolutionize your hiring process.</p>
                </div>
                
                <div className="space-y-6 mt-0">
                  <div>
                    <p className="font-medium mb-2">Name</p>
                    <Input
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="rounded-full"
                    />
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Phone Number</p>
                    <div className="flex">
                      <div className="inline-flex items-center px-6 py-2 bg-gray-100 border border-r-0 rounded-l-full">
                        +91
                      </div>
                      <Input
                        type="tel"
                        className="rounded-r-full"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          phoneNumber: e.target.value.replace(/\D/g, '')
                        }))}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {message && <p className="text-sm text-red-600">{message}</p>}
                  
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 h-12 rounded-full text-base"
                    onClick={handleSubmit}
                    disabled={loading.submit}
                  >
                    {loading.submit ? 'Submitting...' : 'Get Verification Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 'otp' && (
          <Card className="shadow-md border-none">
            <CardContent className="p-6">
              <h1 className="text-xl font-bold mb-4">Enter OTP</h1>
              <Input
                className="w-full mb-3"
                placeholder="OTP"
                value={formData.otp}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  otp: e.target.value.replace(/\D/g, '')
                }))}
                maxLength={6}
              />
              {message && <p className="mb-3 text-sm text-red-600">{message}</p>}
              <div className="flex flex-col justify-center items-center gap-2">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleVerify}
                  disabled={loading.verify}
                >
                  {loading.verify ? 'Verifying...' : 'Verify'}
                </Button>
                <Button
                  variant="outline"
                  className="w-1/3"
                  onClick={handleResendOtp}
                  disabled={loading.submit}
                >
                  Resend
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="shadow-md border-none">
            <CardContent className="p-6">
                <div className="w-full mb-6 flex items-center">
              <button 
                onClick={goBack} 
                className="text-gray-600 flex items-center hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </div>
            <div className='text-center mb-5'>
              <h1 className="text-xl font-bold mb-4 text-green-700">Verification Successful ✅</h1>
              <p className="text-gray-600">Select a category to start receiving job updates.</p>
              </div>
              <div className='flex flex-col justify-start'>
                    <p className="font-medium mb-2 ml-2">Category</p>
                    <select
                      className="w-full border p-2 mb-3 rounded-full"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="backend">Backend</option>
                      <option value="frontend">Frontend</option>
                    </select>
                  </div>
            <div className='flex justify-center items-center mt-2'>
              <Button
                onClick={handleSendJobs}
                disabled={loading.jobs}
                className="bg-purple-600 hover:bg-purple-700 text-center"
              >
                {loading.jobs ? 'Sending...' : 'Send Jobs'}
              </Button>
            </div>
              <div className='flex justify-center items-center mt-2'>
                {message && <p className="text-xl font-bold mt-4 text-green-700">{message}</p>}
              </div>
              
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
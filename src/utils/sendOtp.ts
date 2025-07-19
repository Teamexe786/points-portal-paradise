import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztkmtezlkjqpijfruumt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0a210ZXpsa2pxcGlqZnJ1dW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDk5NTIsImV4cCI6MjA2ODQ4NTk1Mn0.kbsIZZbpSj_DSynPFwDGj4kygkzS-QRvSBDxBowZMhM';

const supabase = createClient(supabaseUrl, supabaseKey);

export const sendOtp = async (email: string, name: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any existing OTPs for this email
  await supabase.from('otps').delete().eq('email', email);

  // Save new OTP to database
  const { error } = await supabase.from('otps').insert([{ email, otp }]);
  if (error) throw new Error('Failed to save OTP');

  // Send email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer re_dXdu11Ex_PzRzTLSyCdj2U5Gc8PLKkxyd`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'noreply@rewixcash.com',
      to: email,
      subject: 'Your OTP Code for RewixCash',
      html: `<p>Hi ${name},</p><p>Your OTP code is <strong>${otp}</strong></p><p>Please use this OTP to complete your registration.</p><p>Thanks, <br>RewixCash Team</p>`
    })
  });

  if (!res.ok) throw new Error('Failed to send OTP');
  
  return { success: true };
};

export const verifyOtp = async (email: string, otp: string) => {
  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .single();

  if (error || !data) {
    return { success: false, message: 'Invalid OTP' };
  }

  // Check if OTP is not older than 10 minutes
  const otpTime = new Date(data.created_at).getTime();
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - otpTime;
  
  if (timeDiff > 10 * 60 * 1000) { // 10 minutes
    return { success: false, message: 'OTP expired' };
  }

  // Delete the used OTP
  await supabase.from('otps').delete().eq('email', email);

  return { success: true };
};
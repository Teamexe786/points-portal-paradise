import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { email, otp } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer re_dXdu11Ex_PzRzTLSyCdj2U5Gc8PLKkxyd",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rewix OTP <noreply@rewixcash.com>",
        to: email,
        subject: "Your OTP for RewixCash",
        html: `<p>Hi there,</p><p>Your OTP code is: <strong>${otp}</strong></p><p>Use it to verify your account.</p><p>Thanks, RewixCash Team</p>`,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ success: false, error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
});
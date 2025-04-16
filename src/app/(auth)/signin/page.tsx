'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Box } from '@mui/material';
import bg from "@/assets/logingBg.png";


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      console.error('Login error:', error.message);
    } else {
      console.log("login successfull");

      router.push('/admin/dashboard');
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh", backgroundImage: `url(${bg.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", }}>
      <Box sx={{ width: "30%", height: "500px", display: "flex", flexDirection: "column", backgroundColor: "white", padding: "40px", }}>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "60px" }}>
          <p className='special-gothic' style={{ fontSize: "40px", marginBottom: "20px" }}>
            Sign In
          </p>
          <p className='kanit'>Don't have and account? <span onClick={() => router.push("/signup")} style={{ textDecoration: "underline", cursor: "pointer" }}>Sign up</span></p>
        </Box>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", outline: "none", backgroundColor: "black", color: "white" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", outline: "none", backgroundColor: "black", color: "white" }}
          />
          
          <button type="submit" className='login-btn kanit'>Login</button>
          
        </form>
      </Box>
    </Box>


  );
}

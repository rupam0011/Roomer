'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Box,  } from '@mui/material';
import bg from "@/assets/logingBg.png";

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();


    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    console.log("signupdata", signUpData); //data of signup
    console.log("signuperror", signUpError); //data of signup



    if (signUpError) {
      console.error('Signup error:', signUpError.message);
      return;
    }

    const { user } = signUpData;

    if (user) {
      const { error: insertError } = await supabase.from('admins').insert([
        {
          name: form.name,
          email: form.email, // ✅ fixed this
          uid: user.id,
        },
      ]);

      if (insertError) {
        console.error('Insert admin error:', insertError.message);
      } else {
        console.log("registered");

        router.push('/signin');
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh",  backgroundImage: `url(${bg.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", }}>
      <Box sx={{ width: "30%",height:"500px", display: "flex", flexDirection: "column", backgroundColor: "white", padding: "40px",}}>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "60px" }}>
          <p className='special-gothic' style={{fontSize:"40px",marginBottom:"20px"}}>
            Sign Up
          </p>
          <p className='kanit'>Already registered? <span onClick={()=>router.push("/signin")} style={{textDecoration:"underline", cursor:"pointer"}}>Sign in</span></p>
        </Box>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", outline: "none", backgroundColor: "black", color: "white" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", outline: "none", backgroundColor: "black", color: "white" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", outline: "none", backgroundColor: "black", color: "white" }}
          />
          <button type="submit" className='register-btn kanit'>
            Register
          </button>
        </form>
      </Box>
    </Box>

  );
}

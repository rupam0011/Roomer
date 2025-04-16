/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/signin'); // redirect to login if not logged in
      } else {
        setSession(session);
      }

      setLoading(false);
    };

    getSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}

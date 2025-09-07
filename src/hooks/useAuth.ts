import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  phone?: string;
  setor: 'varejo' | 'revenda';
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        console.log('🚀 Starting auth initialization...');
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('👤 Current session:', session?.user?.email || 'No user');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Get profile if user exists
          if (session?.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            console.log('👤 Profile found:', profileData ? 'Yes' : 'No');
            setProfile(profileData as Profile);
          }
          
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
        if (mounted) setLoading(false);
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth event:', event);
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setProfile(null); // Reset profile, will be loaded separately
          setLoading(false);
        }
      }
    );

    // Initialize
    initAuth();

    // Backup timeout
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Backup timeout - forcing load');
        setLoading(false);
      }
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, setor: string = 'varejo', phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { setor, phone }
      }
    });
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
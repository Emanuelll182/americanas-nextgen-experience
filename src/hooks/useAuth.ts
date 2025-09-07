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
    
    // Get current session immediately
    const getCurrentSession = async () => {
      try {
        console.log('🔍 Checking current session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📱 Session result:', { session: !!session, user: session?.user?.email });
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // If user exists, try to get profile
          if (session?.user) {
            try {
              console.log('👤 Fetching profile for user:', session.user.id);
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              console.log('👤 Profile result:', { profileData, profileError });
              
              if (mounted && profileData) {
                setProfile(profileData as Profile);
                console.log('✅ Profile loaded successfully');
              } else {
                console.log('⚠️ No profile found for user');
                setProfile(null);
              }
            } catch (err) {
              console.warn('❌ Profile fetch failed:', err);
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
          
          // Always set loading to false
          console.log('🏁 Setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Session check failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email);
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (profileData) {
                setProfile(profileData as Profile);
              } else {
                setProfile(null);
              }
            } catch (err) {
              console.warn('Profile fetch in auth change failed:', err);
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      }
    );

    // Initial session check
    getCurrentSession();

    // Emergency timeout - simplified
    const emergency = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Emergency timeout - forcing app to load');
        setLoading(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(emergency);
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
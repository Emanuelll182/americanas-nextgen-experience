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

    const initializeAuth = async () => {
      try {
        // Clear any invalid tokens first
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session error, clearing storage:', error);
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          if (mounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

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
              
              if (mounted) {
                setProfile(profileData as Profile);
              }
            } catch (profileError) {
              console.warn('Profile fetch error:', profileError);
            }
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Token refresh failed, clear everything
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (mounted) {
              setProfile(profileData as Profile);
            }
          } catch (profileError) {
            console.warn('Profile fetch error:', profileError);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, setor: 'varejo' | 'revenda', phone?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          setor,
          phone
        }
      }
    });
    
    // If no error but user needs confirmation, provide feedback
    if (!error && data.user && !data.session) {
      console.log('User created but needs email confirmation');
    }
    
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
    signOut,
  };
};
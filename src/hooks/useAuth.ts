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
    let timeoutId: NodeJS.Timeout;

    // Fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...');
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

        console.log('Session retrieved:', !!session);

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Fetching profile for user:', session.user.id);
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              console.log('Profile data:', profileData, 'Profile error:', profileError);
              
              if (mounted) {
                setProfile(profileData as Profile);
              }
            } catch (profileError) {
              console.warn('Profile fetch error:', profileError);
            }
          } else {
            console.log('No user session found');
            setProfile(null);
          }
          console.log('Setting loading to false');
          clearTimeout(timeoutId);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session);
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
            console.log('Fetching profile in auth change for user:', session.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            console.log('Profile data from auth change:', profileData, 'Error:', profileError);
            
            if (mounted) {
              setProfile(profileData as Profile);
            }
          } catch (profileError) {
            console.error('Profile fetch error in auth change:', profileError);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          setProfile(null);
        }
        
        if (mounted) {
          console.log('Setting loading to false in auth change');
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, setor: string = 'varejo', phone?: string) => {
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
    const { data, error } = await supabase.auth.signInWithOAuth({
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
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Member } from '@/lib/types';

interface AuthContextType {
  member: Member | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  member: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider: Component rendering');

  useEffect(() => {
    async function loadMember() {
      try {
        console.log('AuthProvider: Loading member...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Session:', session);
        
        if (session?.user) {
          console.log('AuthProvider: User found, loading member data...');
          const { data: memberData, error } = await supabase
            .from('members')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          console.log('AuthProvider: Member data:', memberData, 'Error:', error);
          
          if (error && error.code === 'PGRST116') {
            // Member record doesn't exist, create it
            console.log('AuthProvider: Member record not found, creating...');
            const { data: newMember, error: createError } = await supabase
              .from('members')
              .insert({
                user_id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || null,
                subscription_tier: 'basic',
                is_admin: false
              })
              .select()
              .single();
            
            if (createError) {
              console.error('AuthProvider: Error creating member:', createError);
            } else {
              console.log('AuthProvider: Member created:', newMember);
              setMember(newMember);
            }
          } else if (memberData) {
            setMember(memberData);
          }
        } else {
          console.log('AuthProvider: No session found');
        }
      } catch (error) {
        console.error('Error loading member:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMember();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: memberData } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setMember(memberData);
      } else {
        setMember(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ member, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

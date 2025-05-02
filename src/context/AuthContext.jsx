import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inizializza il client Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Crea il contesto di autenticazione
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla la sessione corrente
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
        await fetchSubscription(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    // Listener per i cambiamenti di autenticazione
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
          await fetchSubscription(session.user.id);
        } else {
          setUserRole(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Recupera il ruolo dell'utente dal database
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Errore nel recupero del ruolo:', error);
        return;
      }
      
      setUserRole(data?.role);
      console.log("User role:", data?.role);
    } catch (error) {
      console.error('Errore nel recupero del ruolo:', error);
    }
  };

  // Recupera i dati dell'abbonamento dell'utente
  const fetchSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore nel recupero dell\'abbonamento:', error);
        return;
      }

      setSubscription(data || null);
      console.log("Subscription data:", data);
    } catch (error) {
      console.error('Errore nel recupero dell\'abbonamento:', error);
    }
  };

  // Funzione per il login
  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Login successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Funzione per la registrazione
  const signup = async (email, password, fullName) => {
    try {
      // Registra l'utente in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Inserisci i dati dell'utente nella tabella users
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              role: 'therapist', // Ruolo predefinito per i nuovi utenti
            },
          ]);

        if (profileError) throw profileError;
      }

      return { success: true, data: authData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Funzione per il logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verifica se l'utente ha un abbonamento attivo o è admin
  const hasActiveSubscription = () => {
    if (!user) return false;
    if (userRole === 'admin') return true; // L'admin ha sempre accesso
    return subscription !== null;
  };

  const value = {
    user,
    userRole,
    subscription,
    login,
    signup,
    logout,
    hasActiveSubscription,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
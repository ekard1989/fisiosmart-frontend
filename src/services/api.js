import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Servizio Pazienti
export const patientService = {
  // Ottieni tutti i pazienti
  getAll: async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni un paziente specifico
  getById: async (id) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Crea un nuovo paziente
  create: async (patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Aggiorna un paziente
  update: async (id, patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Elimina un paziente
  delete: async (id) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Servizio Appuntamenti
export const appointmentService = {
  // Ottieni tutti gli appuntamenti
  getAll: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni appuntamenti per una data specifica
  getByDate: async (date) => {
    // Converti la data in formato ISO e crea limiti per il giorno
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni un appuntamento specifico
  getById: async (id) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Crea un nuovo appuntamento
  create: async (appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Aggiorna un appuntamento
  update: async (id, appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Elimina un appuntamento
  delete: async (id) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Servizio Esercizi
export const exerciseService = {
  // Ottieni tutti gli esercizi
  getAll: async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni un esercizio specifico
  getById: async (id) => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Crea un nuovo esercizio
  create: async (exerciseData) => {
    const { data, error } = await supabase
      .from('exercises')
      .insert([exerciseData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Aggiorna un esercizio
  update: async (id, exerciseData) => {
    const { data, error } = await supabase
      .from('exercises')
      .update(exerciseData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Elimina un esercizio
  delete: async (id) => {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Servizio Fatturazione
export const invoiceService = {
  // Ottieni tutte le fatture
  getAll: async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni le fatture per stato
  getByStatus: async (status) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .eq('status', status)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Ottieni una fattura specifica
  getById: async (id) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Crea una nuova fattura
  create: async (invoiceData) => {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Aggiorna una fattura
  update: async (id, invoiceData) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoiceData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Elimina una fattura
  delete: async (id) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Esporta un oggetto con tutti i servizi
export default {
  patient: patientService,
  appointment: appointmentService,
  exercise: exerciseService,
  invoice: invoiceService
};
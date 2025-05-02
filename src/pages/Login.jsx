const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log("Tentativo di login con:", email);
    const { success, error } = await login(email, password);
    console.log("Risultato login:", { success, error });
    
    if (success) {
      // Reindirizza direttamente senza aspettare altri controlli
      navigate('/dashboard');
    } else {
      setError(error || 'Si è verificato un errore durante il login');
    }
  } catch (err) {
    console.error("Errore durante il login:", err);
    setError('Si è verificato un errore durante il login');
  }

  setLoading(false);
};
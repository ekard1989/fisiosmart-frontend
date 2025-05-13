import { useState, useCallback } from 'react';

export function useApi(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...params);
      setData(result);
      return { success: true, data: result };
    } catch (error) {
      setError(error.message || 'Si è verificato un errore');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
}
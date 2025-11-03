import { useState, useCallback } from 'react';
import { apiClient, getErrorMessage } from '../utils/apiClient';
import { useToast } from '../components/Toast';

export const useApi = (apiFunc, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunc(...args);
        
        setData(result);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        
        if (onError) {
          onError(err);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, showSuccessToast, showErrorToast, successMessage, onSuccess, onError, toast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export const useFetch = (endpoint, options = {}) => {
  const { showErrorToast = true, transform } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.get(endpoint);
      const finalData = transform ? transform(result) : result;
      
      setData(finalData);
      return finalData;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, showErrorToast, transform, toast]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export const useApiCall = () => {
  const toast = useToast();

  const apiCall = useCallback(
    async (apiFunc, options = {}) => {
      const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = 'Operation completed successfully',
        loadingMessage,
        onSuccess,
        onError,
      } = options;

      let loadingToastId = null;

      try {
        if (loadingMessage) {
          loadingToastId = toast.info(loadingMessage, 0);
        }

        const result = await apiFunc();

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      }
    },
    [toast]
  );

  return apiCall;
};

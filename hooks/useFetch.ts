import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const useFetch = <T, P = any>(fetchFunction: (params?: P) => Promise<T>, autoFetch = true, fetchOnFocus = true) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (params?: P) => {
    try {
      setIsLoading(true)
      const result = await fetchFunction(params)
      setData(result)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Error occour during fetching movies.'))
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (fetchOnFocus) fetchData();
    }, [])
  );

  return {
    data,
    isLoading,
    error,
    reset,
    refetch: fetchData
  }
}

export default useFetch
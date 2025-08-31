import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true, fetchOnFocus = true) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await fetchFunction()
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
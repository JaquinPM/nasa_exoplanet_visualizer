// CUnstom hook
import { useEffect, useState } from "react";

type Data<T> = T;
type ErrorType = Error | null;
interface Params<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T>(url: string, initialValue: T): Params<T> => {
  const [data, setData] = useState<Data<T>>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error en la peticion");
        }

        const jsonData: T = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      }
      finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url])

  return { data, loading, error };
}

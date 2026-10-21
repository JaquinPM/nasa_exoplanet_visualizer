// CUnstom hook
import { useEffect, useState } from "react";

type Data<T> = T ;
type ErrorType = Error | null;
interface Params<T>{
    data: T ;
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
            try{
                const response =  await fetch(url);
                if(!response.ok){
                    throw new Error("Error en la peticion");
                }

                const jsonData: T = await response.json();
                setData(jsonData);
                setError(null);
            }catch( err){
                setError(err as Error);
            }
            finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [url])

    return {data, loading, error};
}


  //Comunicarnos con un endpont - entidad externa del componente  siempre que tenga "use" es un hook
  // operaciones asincornas
  // parametros de entrada
  // context
  //
  //sync con entidades externas
  //useEffect(() => {
  //  // logica? que logica? cuando se ejecuta ?
  //  // 1.- Se ejecuta cuando se monta el copmponente
  //  // 2.- cada vez que se modifique uno de los valores del state, unicamente cuando es uno de los valores de dependencia
  //  // Se ejecutas cada vez qwue el componente muera, es decir, cyuando se destruya
  //  return () => {
  //    //manejar el estadio de la memoria
  //  };
  //}, [
  //  // Valores de depndencia (arreglo)
  //]);


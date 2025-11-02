/**
 * Hook personalizado para estado persistente
 * Implementa Single Source of Truth para lógica de persistencia
 */

import { useState, useEffect } from "react";
import { getData, saveData } from "../shared/storage";

/**
 * Hook que mantiene el estado sincronizado con el almacenamiento persistente
 * 
 * @param key - Clave única para el almacenamiento
 * @param initialValue - Valor inicial si no existe en storage
 * @returns [value, setValue] - Estado y función para actualizarlo
 * 
 * @example
 * const [filter, setFilter] = usePersistedState('myFilter', 'all');
 */
export const usePersistedState = <T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] => {
    const [value, setValue] = useState<T>(initialValue);

    // Cargar valor del storage al montar
    useEffect(() => {
        const loadValue = async () => {
            const saved = await getData<T>(key);
            if (saved !== null) {
                setValue(saved);
            }
        };
        loadValue();
    }, [key]);

    // Función que actualiza estado y persiste
    const updateValue = (newValue: T) => {
        setValue(newValue);
        // Fire and forget - no bloqueamos el UI
        saveData(key, newValue);
    };

    return [value, updateValue];
};

/**
 * Hook para múltiples estados persistentes
 * Útil cuando necesitas varios valores relacionados
 * 
 * @example
 * const [state, updateState] = usePersistedStates('myScreen', {
 *   filter: 'all',
 *   search: '',
 * });
 */
export const usePersistedStates = <T extends Record<string, any>>(
    baseKey: string,
    initialState: T
): [T, (updates: Partial<T>) => void] => {
    const [state, setState] = useState<T>(initialState);

    useEffect(() => {
        const loadState = async () => {
            const saved = await getData<T>(baseKey);
            if (saved !== null) {
                setState(saved);
            }
        };
        loadState();
    }, [baseKey]);

    const updateState = (updates: Partial<T>) => {
        setState((prev) => {
            const next = { ...prev, ...updates };
            saveData(baseKey, next);
            return next;
        });
    };

    return [state, updateState];
};
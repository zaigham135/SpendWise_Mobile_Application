import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // Framework is ready when this hook runs
    console.log('Framework is ready');
  }, []);
}
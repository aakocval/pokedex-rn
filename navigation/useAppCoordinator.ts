import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Owns all navigation actions for the app.
 * Screens never import useRouter directly — they call this instead,
 * which makes them trivially testable (swap out the coordinator mock).
 */
export function useAppCoordinator() {
  const router = useRouter();

  const openPokemonDetail = useCallback(
    (id: number) => router.push(`/pokemon/${id}`),
    [router],
  );

  const goBack = useCallback(() => router.back(), [router]);

  return { openPokemonDetail, goBack };
}

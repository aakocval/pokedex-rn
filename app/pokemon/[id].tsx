import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { fetchPokemonDetailFull } from '@/services/pokeapi';
import { TYPE_DETAIL_COLORS } from '@/constants/typeColors';
import type { PokemonDetailFull } from '@/types/pokemon';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<PokemonDetailFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchPokemonDetailFull(Number(id))
      .then(setDetail)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const bgColor = TYPE_DETAIL_COLORS[detail?.primaryType ?? ''] ?? '#3D5060';

  return (
    <View style={[styles.root, { backgroundColor: bgColor }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

        {detail && (
          <View style={styles.regionWrapper} pointerEvents="none">
            <View style={styles.regionRotator}>
              <Text style={styles.regionText}>Región: {detail.region}</Text>
            </View>
          </View>
        )}

        {isLoading || !detail ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="rgba(255,255,255,0.7)" />
          </View>
        ) : (
          <Animated.View style={styles.content} entering={FadeIn.duration(300)}>
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.85)" />
            </Pressable>

            <Text style={styles.number}>#{String(detail.id).padStart(3, '0')}</Text>
            <Text style={styles.name}>{capitalize(detail.name)}</Text>

            <View style={styles.stats}>
              <Text style={styles.statRow}>
                Height:{' '}
                <Text style={styles.statValue}>{(detail.height / 10).toFixed(2)}m</Text>
              </Text>
              <Text style={styles.statRow}>
                Weight:{' '}
                <Text style={styles.statValue}>{(detail.weight / 10).toFixed(2)}kg</Text>
              </Text>
            </View>

            <Image
              source={{ uri: detail.imageUrl }}
              style={styles.image}
              contentFit="contain"
              transition={300}
            />

            <Text style={styles.japaneseName} numberOfLines={1} adjustsFontSizeToFit>
              {detail.japaneseName}
            </Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    marginTop: 8,
  },
  regionWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  regionRotator: {
    width: 120,
    transform: [{ rotate: '-90deg' }],
  },
  regionText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: 44,
    paddingRight: 24,
    paddingTop: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 16,
  },
  name: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  stats: {
    marginTop: 24,
    gap: 4,
  },
  statRow: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
  statValue: {
    fontWeight: '700',
    color: '#fff',
  },
  image: {
    flex: 1,
    width: '100%',
    minHeight: 200,
    marginTop: 8,
  },
  japaneseName: {
    fontSize: 72,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.12)',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 8,
  },
});

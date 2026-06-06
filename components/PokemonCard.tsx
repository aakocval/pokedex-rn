import { TYPE_DETAIL_COLORS } from '@/constants/typeColors';
import type { Pokemon } from '@/types/pokemon';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  pokemon: Pokemon;
  onPress?: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function PokemonCard({ pokemon, onPress }: Props) {
  const bgColor = TYPE_DETAIL_COLORS[pokemon.primaryType] ?? TYPE_DETAIL_COLORS.normal;
  const numberStr = String(pokemon.id).padStart(3, '0');

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        style={[styles.card, { backgroundColor: bgColor }]}
        onPressIn={() => { scale.value = withSpring(0.93, { damping: 10, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
        onPress={onPress}
      >
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <Text style={styles.number}>{numberStr}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  number: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});

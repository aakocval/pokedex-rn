import { TYPE_COLORS } from '@/constants/typeColors';
import type { Pokemon } from '@/types/pokemon';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  pokemon: Pokemon;
  onPress?: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function PokemonCard({ pokemon, onPress }: Props) {
  const bgColor = TYPE_COLORS[pokemon.primaryType] ?? TYPE_COLORS.normal;
  const numberStr = String(pokemon.id).padStart(3, '0');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgColor, opacity: pressed ? 0.9 : 1 },
      ]}
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
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
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
    color: '#1A1A2E',
    marginTop: 8,
    textAlign: 'center',
  },
  number: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});

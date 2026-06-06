import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TYPE_COLORS, POKEMON_TYPES, type PokemonTypeName } from '@/constants/typeColors';

interface Props {
  visible: boolean;
  selectedType: PokemonTypeName | null;
  onSelect: (type: PokemonTypeName | null) => void;
  onClose: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function FilterSheet({ visible, selectedType, onSelect, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>Filter by Type</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#666" />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {POKEMON_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <Pressable
                  key={type}
                  style={[
                    styles.chip,
                    { backgroundColor: TYPE_COLORS[type] },
                    isSelected && styles.chipSelected,
                  ]}
                  onPress={() => onSelect(isSelected ? null : type)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {capitalize(type)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedType && (
            <Pressable style={styles.clearBtn} onPress={() => onSelect(null)}>
              <Text style={styles.clearBtnText}>Clear Filter</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8DEE9',
    alignSelf: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  chip: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: '#1A1A2E',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  chipTextSelected: {
    fontWeight: '800',
  },
  clearBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c0392b',
  },
});

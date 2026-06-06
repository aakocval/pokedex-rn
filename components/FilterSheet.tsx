import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TYPE_COLORS, TYPE_DETAIL_COLORS, POKEMON_TYPES, type PokemonTypeName } from '@/constants/typeColors';
import type { AppColors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  visible: boolean;
  selectedType: PokemonTypeName | null;
  onSelect: (type: PokemonTypeName | null) => void;
  onClose: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface TypeChipProps {
  type: PokemonTypeName;
  isSelected: boolean;
  onPress: () => void;
  styles: ReturnType<typeof makeStyles>;
  colors: AppColors;
}

function TypeChip({ type, isSelected, onPress, styles, colors }: TypeChipProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.chipWrapper, animatedStyle]}>
      <Pressable
        style={[
          styles.chip,
          { backgroundColor: TYPE_DETAIL_COLORS[type] },
          isSelected && styles.chipSelected,
        ]}
        onPressIn={() => { scale.value = withSpring(0.9, { damping: 10, stiffness: 350 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
        onPress={onPress}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {capitalize(type)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function FilterSheet({ visible, selectedType, onSelect, onClose }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
              <Ionicons name="close" size={22} color={colors.closeIcon} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {POKEMON_TYPES.map((type) => (
              <TypeChip
                key={type}
                type={type}
                isSelected={selectedType === type}
                onPress={() => onSelect(selectedType === type ? null : type)}
                styles={styles}
                colors={colors}
              />
            ))}
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

function makeStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surface,
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
      backgroundColor: colors.sheetHandle,
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
      color: colors.text,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    chipWrapper: {
      width: '31%',
    },
    chip: {
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    chipSelected: {
      borderColor: 'rgba(255,255,255,0.85)',
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
    },
    chipTextSelected: {
      fontWeight: '800',
    },
    clearBtn: {
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: colors.clearBtnBg,
      alignItems: 'center',
    },
    clearBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.clearBtnText,
    },
  });
}

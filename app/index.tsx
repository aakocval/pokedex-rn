import { FilterSheet } from '@/components/FilterSheet';
import { PokemonCard } from '@/components/PokemonCard';
import type { AppColors } from '@/constants/colors';
import { TYPE_COLORS, TYPE_DETAIL_COLORS } from '@/constants/typeColors';
import { useTheme } from '@/context/ThemeContext';
import { useFilter } from '@/hooks/useFilter';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useSearch } from '@/hooks/useSearch';
import type { Pokemon } from '@/types/pokemon';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { pokemon, isLoading, isFetchingMore, error, refresh, fetchNextPage } =
    usePokemonList();
  const { query, setQuery, results, isSearching, notFound, isActive: isSearchActive } =
    useSearch();
  const {
    selectedType,
    filteredPokemon,
    isFiltering,
    isSheetOpen,
    isActive: isFilterActive,
    applyFilter,
    clearFilter,
    openSheet,
    closeSheet,
  } = useFilter();

  // Priority: search > filter > paginated list
  // When both active, narrow search results by selected type
  let listData: Pokemon[];
  if (isSearchActive) {
    listData = isFilterActive
      ? results.filter((p) => p.primaryType === selectedType)
      : results;
  } else if (isFilterActive) {
    listData = filteredPokemon;
  } else {
    listData = pokemon;
  }

  const isPaginatedMode = !isSearchActive && !isFilterActive;
  const isBusy = isSearching || isFiltering;

  if (isLoading && isPaginatedMode) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Header
          query={query}
          onQueryChange={setQuery}
          isFilterActive={isFilterActive}
          selectedType={selectedType}
          onFilterPress={openSheet}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.filterBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header
        query={query}
        onQueryChange={setQuery}
        isFilterActive={isFilterActive}
        selectedType={selectedType}
        onFilterPress={openSheet}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      {isFilterActive && !isSearchActive && (
        <Animated.View entering={FadeInDown.duration(250).springify()} exiting={FadeOutUp.duration(180)}>
          <ActiveFilterBadge type={selectedType!} onClear={clearFilter} />
        </Animated.View>
      )}

      {isBusy ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.filterBtn} />
        </View>
      ) : notFound && isSearchActive ? (
        <View style={styles.center}>
          <Text style={styles.notFoundText}>No Pokémon found for "{query}"</Text>
          <Text style={styles.notFoundHint}>Try a partial name or Pokédex number</Text>
        </View>
      ) : error && isPaginatedMode ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList<Pokemon>
          key={isSearchActive ? 'search' : isFilterActive ? 'filter' : 'list'}
          data={listData}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => router.push(`/pokemon/${item.id}`)}
            />
          )}
          keyboardDismissMode="on-drag"
          onEndReached={isPaginatedMode ? fetchNextPage : undefined}
          onEndReachedThreshold={0.5}
          onRefresh={isPaginatedMode ? refresh : undefined}
          refreshing={isPaginatedMode && isLoading}
          ListFooterComponent={
            isPaginatedMode && isFetchingMore ? (
              <ActivityIndicator style={styles.footer} color={colors.filterBtn} />
            ) : null
          }
        />
      )}

      <FilterSheet
        visible={isSheetOpen}
        selectedType={selectedType}
        onSelect={applyFilter}
        onClose={closeSheet}
      />
    </SafeAreaView>
  );
}

interface HeaderProps {
  query: string;
  onQueryChange: (text: string) => void;
  isFilterActive: boolean;
  selectedType: string | null;
  onFilterPress: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

function Header({ query, onQueryChange, isFilterActive, selectedType, onFilterPress, isDark, onThemeToggle }: HeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const toggleScale = useSharedValue(1);
  const animatedToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: toggleScale.value }],
  }));

  const handleToggle = () => {
    toggleScale.value = withSequence(
      withSpring(0.7, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );
    onThemeToggle();
  };

  const filterBtnBg = isFilterActive && selectedType
    ? (TYPE_DETAIL_COLORS[selectedType] ?? colors.filterBtnActive)
    : colors.surface;
  const filterBtnBorder = isFilterActive ? 'transparent' : colors.border;
  const filterIconColor = isFilterActive ? '#fff' : colors.textSecondary;

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Pokédex</Text>
        <Pressable onPress={handleToggle} hitSlop={12} style={styles.themeBtn}>
          <Animated.View style={animatedToggleStyle}>
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Animated.View>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>
        Search for a Pokémon by name.
      </Text>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textHint} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search..."
            placeholderTextColor={colors.textHint}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable
          style={[styles.filterBtn, { backgroundColor: filterBtnBg, borderColor: filterBtnBorder }]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={22} color={filterIconColor} />
          {isFilterActive && <View style={styles.filterDot} />}
        </Pressable>
      </View>
    </View>
  );
}

interface ActiveFilterBadgeProps {
  type: string;
  onClear: () => void;
}

function ActiveFilterBadge({ type, onClear }: ActiveFilterBadgeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.normal;

  return (
    <View style={styles.badgeRow}>
      <View style={[styles.badge, { backgroundColor: color + '50' }]}>
        <Text style={styles.badgeText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={16} color={colors.badgeText} />
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      paddingHorizontal: 8,
      paddingBottom: 24,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
    },
    themeBtn: {
      padding: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 16,
      lineHeight: 20,
    },
    searchRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    searchBar: {
      flex: 1,
      height: 46,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 14,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    filterBtn: {
      width: 46,
      height: 46,
      borderRadius: 14,
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterDot: {
      position: 'absolute',
      top: 9,
      right: 9,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFD700',
      borderWidth: 1.5,
      borderColor: '#fff',
    },
    badgeRow: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      flexDirection: 'row',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.badgeText,
    },
    errorText: {
      color: '#c0392b',
      fontSize: 14,
    },
    notFoundText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    notFoundHint: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 6,
    },
    footer: {
      paddingVertical: 24,
    },
  });
}

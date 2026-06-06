import { FilterSheet } from '@/components/FilterSheet';
import { PokemonCard } from '@/components/PokemonCard';
import { TYPE_COLORS } from '@/constants/typeColors';
import { useFilter } from '@/hooks/useFilter';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useSearch } from '@/hooks/useSearch';
import type { Pokemon } from '@/types/pokemon';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
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
        <Header
          query={query}
          onQueryChange={setQuery}
          isFilterActive={isFilterActive}
          onFilterPress={openSheet}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3D3D6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        query={query}
        onQueryChange={setQuery}
        isFilterActive={isFilterActive}
        onFilterPress={openSheet}
      />

      {isFilterActive && !isSearchActive && (
        <ActiveFilterBadge type={selectedType!} onClear={clearFilter} />
      )}

      {isBusy ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3D3D6B" />
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
              <ActivityIndicator style={styles.footer} color="#3D3D6B" />
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
  onFilterPress: () => void;
}

function Header({ query, onQueryChange, isFilterActive, onFilterPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Pokédex</Text>
      <Text style={styles.subtitle}>
        Search for a Pokémon by name or using its National Pokédex number.
      </Text>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Name or number"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable
          style={[styles.filterBtn, isFilterActive && styles.filterBtnActive]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={22} color="#fff" />
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
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
  return (
    <View style={styles.badgeRow}>
      <View style={[styles.badge, { backgroundColor: color + 50 }]}>
        <Text style={styles.badgeText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={16} color="#1A1A2E" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F7',
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8DEE9',
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A2E',
  },
  filterBtn: {
    width: 46,
    height: 46,
    backgroundColor: '#3D3D6B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#5A4FCF',
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
    color: '#1A1A2E',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 14,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  notFoundHint: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
  },
  footer: {
    paddingVertical: 24,
  },
});

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "./SearchBar.vue";
import { computed } from 'vue';

type SortOptionType = 'popularity' | 'price-asc' | 'price-desc' | 'title';

const sortOptions: Record<SortOptionType, string> = {
  popularity: "Les plus populaires",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  title: "Ordre alphabétique",
};

const props = defineProps<{
  searchQuery: string;
  sortOption: SortOptionType;
  viewMode: "grid" | "list";
  totalResults: number;
}>();

const currentSortLabel = computed(() => sortOptions[props.sortOption]);

const emit = defineEmits<{
  (e: "search", query: string): void;
  (e: "clear"): void;
  (e: "sort", option: SortOptionType): void;
  (e: "update:viewMode", mode: "grid" | "list"): void;
  (e: "update:sortOption", value: SortOptionType): void;
}>();

const onSortChange = (value: unknown) => {
  if (typeof value === 'string' && value in sortOptions) {
    const sortValue = value as SortOptionType;
    emit("update:sortOption", sortValue);
    emit("sort", sortValue);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Barre de recherche -->
    <SearchBar
      :modelValue="searchQuery"
      placeholder="Rechercher un manga, un auteur..."
      @search="emit('search', $event)"
      @clear="emit('clear')"
      class="w-full"
    />

    <!-- En-tête avec options d'affichage -->
    <div class="flex items-center justify-between">
      <div>
        <p v-if="searchQuery" class="text-sm text-muted-foreground mt-1">
          Résultats pour "{{ searchQuery }}" : {{ totalResults }} manga(s)
          trouvé(s)
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Sélecteur de tri -->
        <Select 
          :value="sortOption"
          @update:modelValue="onSortChange"
        >
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Trier par...">
              {{ currentSortLabel }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(label, key) in sortOptions"
              :key="key"
              :value="key"
            >
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- Boutons de vue -->
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            :class="{ 'bg-gray-100': viewMode === 'grid' }"
            @click="emit('update:viewMode', 'grid')"
          >
            <Icon name="lucide:grid" class="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :class="{ 'bg-gray-100': viewMode === 'list' }"
            @click="emit('update:viewMode', 'list')"
          >
            <Icon name="lucide:list" class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

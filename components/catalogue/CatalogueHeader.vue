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
  <div class="space-y-4">
    <SearchBar
      :modelValue="searchQuery"
      placeholder="Rechercher un manga, un auteur..."
      @search="emit('search', $event)"
      @clear="emit('clear')"
      class="w-full max-w-md"
    />

   
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="min-w-0">
        <p v-if="totalResults > 0" class="text-sm text-gray-600 font-medium">
          {{ totalResults }} manga{{ totalResults > 1 ? 's' : '' }} trouvé{{ totalResults > 1 ? 's' : '' }}
          <span v-if="searchQuery" class="text-red-600">pour "{{ searchQuery }}"</span>
        </p>
        <p v-else-if="searchQuery" class="text-sm text-gray-500">
          Aucun résultat pour "{{ searchQuery }}"
        </p>
      </div>

      
      <div class="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
        
        <Select 
          :value="sortOption"
          @update:modelValue="onSortChange"
        >
          <SelectTrigger class="w-full xs:w-44 sm:w-48">
            <SelectValue placeholder="Trier par...">
              {{ currentSortLabel }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem
              v-for="(label, key) in sortOptions"
              :key="key"
              :value="key"
            >
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>

        
        <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-white shadow-sm': viewMode === 'grid' }"
            @click="emit('update:viewMode', 'grid')"
            class="px-3"
          >
            <Icon name="lucide:grid-3x3" class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Grille</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-white shadow-sm': viewMode === 'list' }"
            @click="emit('update:viewMode', 'list')"
            class="px-3"
          >
            <Icon name="lucide:list" class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Liste</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

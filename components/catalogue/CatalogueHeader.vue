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

const sortOptions = {
  popularity: "Les plus populaires",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  title: "Ordre alphabétique",
};

defineProps<{
  searchQuery: string;
  sortOption: keyof typeof sortOptions;
  viewMode: "grid" | "list";
  totalResults: number;
}>();

defineEmits<{
  (e: "search", query: string): void;
  (e: "clear"): void;
  (e: "sort", option: string): void;
  (e: "update:viewMode", mode: "grid" | "list"): void;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- Barre de recherche -->
    <SearchBar
      :modelValue="searchQuery"
      placeholder="Rechercher un manga, un auteur..."
      @search="$emit('search', $event)"
      @clear="$emit('clear')"
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
        <Select :value="sortOption" @change="$emit('sort', $event)">
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Trier par...">
              {{ sortOptions[sortOption] }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(label, value) in sortOptions"
              :key="value"
              :value="value"
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
            @click="$emit('update:viewMode', 'grid')"
          >
            <Icon name="lucide:grid" class="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :class="{ 'bg-gray-100': viewMode === 'list' }"
            @click="$emit('update:viewMode', 'list')"
          >
            <Icon name="lucide:list" class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

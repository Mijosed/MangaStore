<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestion des mangas</h1>
      <Button @click="showAddDialog = true">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Ajouter un manga
      </Button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Chargement des mangas...</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="manga in mangas" :key="manga.id" class="flex flex-col">
        <CardHeader>
          <div class="aspect-[2/3] relative mb-4">
            <img 
              :src="manga.cover_url || '/placeholder-manga.jpg'" 
              :alt="manga.title"
              class="absolute inset-0 object-cover w-full h-full rounded-lg"
            />
          </div>
          <CardTitle>{{ manga.title }}</CardTitle>
          <CardDescription class="line-clamp-2">{{ manga.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Prix</span>
              <span class="font-medium">{{ manga.price.toFixed(2) }}€</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Stock</span>
              <span class="font-medium">{{ manga.stock }}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter class="mt-auto flex gap-2">
          <Button variant="outline" class="flex-1" @click="editManga(manga)">
            <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" size="icon" @click="deleteManga(manga.id)">
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Dialog d'ajout/modification -->
    <Sheet v-model:open="showAddDialog">
      <SheetContent :side="'right'" class="w-full sm:max-w-[425px] overflow-y-auto">
        <div class="space-y-6 px-1">
          <SheetHeader class="space-y-2 px-3">
            <SheetTitle class="text-xl">{{ editingManga ? 'Modifier le manga' : 'Ajouter un manga' }}</SheetTitle>
            <SheetDescription>
              {{ editingManga ? 'Modifiez les informations du manga' : 'Remplissez les informations du nouveau manga' }}
            </SheetDescription>
          </SheetHeader>

          <form @submit.prevent="saveManga" class="space-y-6 px-3">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="title" class="text-sm font-medium">Titre</Label>
                <Input 
                  id="title" 
                  v-model="mangaForm.title" 
                  placeholder="One Piece Tome 1"
                  required
                  class="w-full"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="description" class="text-sm font-medium">Description</Label>
                <textarea
                  id="description"
                  v-model="mangaForm.description"
                  rows="3"
                  class="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Description du manga"
                  required
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="price" class="text-sm font-medium">Prix</Label>
                  <Input
                    id="price"
                    v-model="mangaForm.price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="6.99"
                    required
                    class="w-full"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="stock" class="text-sm font-medium">Stock</Label>
                  <Input
                    id="stock"
                    v-model="mangaForm.stock"
                    type="number"
                    min="0"
                    placeholder="10"
                    required
                    class="w-full"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="cover" class="text-sm font-medium">Image de couverture</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="w-full"
                />
              </div>
            </div>

            <SheetFooter class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-6 border-t">
              <Button 
                variant="outline" 
                type="button" 
                @click="closeDialog"
                class="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                :disabled="saving"
                class="w-full sm:w-auto"
              >
                <Icon 
                  v-if="saving" 
                  name="heroicons:arrow-path" 
                  class="w-4 h-4 mr-2 animate-spin" 
                />
                {{ editingManga ? 'Mettre à jour' : 'Ajouter' }}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'sonner'

definePageMeta({
  layout: 'account',
  middleware: ['auth', 'admin']
})

interface Manga {
  id: string
  title: string
  description: string
  price: number
  stock: number
  cover_url?: string
}

interface MangaForm {
  title: string
  description: string
  price: number | string
  stock: number | string
  cover_url?: string
  coverFile?: File
}

const mangas = ref<Manga[]>([])
const loading = ref(true)
const showAddDialog = ref(false)
const saving = ref(false)
const editingManga = ref<Manga | null>(null)

const mangaForm = ref<MangaForm>({
  title: '',
  description: '',
  price: '',
  stock: '',
})

// Charger la liste des mangas
const loadMangas = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('mangas')
      .select('*')
      .order('title')

    if (error) throw error
    mangas.value = data
  } catch (error) {
    console.error('Error loading mangas:', error)
    toast.error('Impossible de charger les mangas')
  } finally {
    loading.value = false
  }
}

// Gérer l'upload d'image
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    mangaForm.value.coverFile = input.files[0]
  }
}

// Upload de l'image vers le stockage Supabase
const uploadCover = async (file: File): Promise<string> => {
  const supabase = useSupabaseClient()
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase
    .storage
    .from('manga-covers')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase
    .storage
    .from('manga-covers')
    .getPublicUrl(fileName)

  return publicUrl
}

// Sauvegarder ou mettre à jour un manga
const saveManga = async () => {
  try {
    saving.value = true
    const supabase = useSupabaseClient()

    let coverUrl = editingManga.value?.cover_url

    // Upload de la nouvelle image si présente
    if (mangaForm.value.coverFile) {
      coverUrl = await uploadCover(mangaForm.value.coverFile)
    }

    const mangaData = {
      title: mangaForm.value.title,
      description: mangaForm.value.description,
      price: Number(mangaForm.value.price),
      stock: Number(mangaForm.value.stock),
      cover_url: coverUrl
    }

    if (editingManga.value) {
      // Mise à jour
      const { error } = await supabase
        .from('mangas')
        .update(mangaData)
        .eq('id', editingManga.value.id)

      if (error) throw error
      toast.success('Manga mis à jour avec succès')
    } else {
      // Création
      const { error } = await supabase
        .from('mangas')
        .insert(mangaData)

      if (error) throw error
      toast.success('Manga ajouté avec succès')
    }

    closeDialog()
    loadMangas()
  } catch (error) {
    console.error('Error saving manga:', error)
    toast.error("Impossible de sauvegarder le manga")
  } finally {
    saving.value = false
  }
}

// Supprimer un manga
const deleteManga = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce manga ?')) return

  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('mangas')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    mangas.value = mangas.value.filter(manga => manga.id !== id)
    toast.success('Manga supprimé avec succès')
  } catch (error) {
    console.error('Error deleting manga:', error)
    toast.error('Impossible de supprimer le manga')
  }
}

// Éditer un manga existant
const editManga = (manga: Manga) => {
  editingManga.value = manga
  mangaForm.value = {
    title: manga.title,
    description: manga.description,
    price: manga.price,
    stock: manga.stock,
    cover_url: manga.cover_url
  }
  showAddDialog.value = true
}

// Fermer le dialogue et réinitialiser le formulaire
const closeDialog = () => {
  showAddDialog.value = false
  editingManga.value = null
  // Attendre que l'animation de fermeture soit terminée avant de réinitialiser le formulaire
  setTimeout(() => {
    mangaForm.value = {
      title: '',
      description: '',
      price: '',
      stock: '',
    }
  }, 300)
}

onMounted(() => {
  loadMangas()
})
</script>

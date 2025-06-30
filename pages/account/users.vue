<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Gestion des utilisateurs</h1>
      
      <!-- Search and filters -->
      <div class="flex gap-4">
        <Input
          v-model="searchQuery"
          placeholder="Rechercher un utilisateur..."
          class="w-64"
        >
          <template #prefix>
            <Icon name="lucide:search" class="w-4 h-4 text-gray-400" />
          </template>
        </Input>
      </div>
    </div>
    
    <!-- Users table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-3 px-4">Utilisateur</th>
            <th class="text-left py-3 px-4">Email</th>
            <th class="text-left py-3 px-4">Rôle</th>
            <th class="text-left py-3 px-4">Inscrit le</th>
            <th class="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <Avatar>
                  <AvatarImage :src="user.avatar_url || '/default-avatar.png'" />
                  <AvatarFallback>{{ user.email[0].toUpperCase() }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="font-medium">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="py-3 px-4">{{ user.email }}</td>
            <td class="py-3 px-4">
              <Select 
                :model-value="user.role"
                @update:model-value="(role) => role && handleRoleChange(user, role as Role)"
              >
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td class="py-3 px-4">{{ formatDate(user.created_at) }}</td>
            <td class="py-3 px-4 text-right">
              <Button 
                variant="destructive" 
                size="sm"
                @click="() => handleDeleteUser(user)"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation dialog -->
    <Dialog :open="!!userToDelete" @update:open="userToDelete = null">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'utilisateur ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Toutes les données de l'utilisateur seront supprimées.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <p class="text-sm text-gray-500">
            Pour confirmer, veuillez saisir l'email de l'utilisateur : <span class="font-medium">{{ userToDelete?.email }}</span>
          </p>
          <Input
            v-model="confirmEmail"
            placeholder="Email de l'utilisateur"
            class="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="userToDelete = null">
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            :disabled="confirmEmail !== userToDelete?.email"
            @click="confirmDeleteUser"
          >
            Supprimer l'utilisateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'

interface Profile {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
  last_sign_in_at: string | null
  avatar_url: string | null
  username: string | null
}

type Role = 'admin' | 'user'

type ProfileUpdate = {
  role: Role
}

const users = ref<Profile[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const userToDelete = ref<Profile | null>(null)
const confirmEmail = ref('')

// Filtered users based on search
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.email.toLowerCase().includes(query)
  )
})

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle role change
const handleRoleChange = async (user: Profile, newRole: 'admin' | 'user') => {
  try {
    const { error } = await useSupabaseClient()
      .from('roles')
      .update({ role: newRole } as ProfileUpdate)
      .eq('user_id', user.id)

    if (error) throw error

    // Update local state
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index] = { ...user, role: newRole }
    }
  } catch (err) {
    console.error('Error updating user role:', err)
    // TODO: Show error toast
  }
}

// Handle delete user button click
const handleDeleteUser = (user: Profile) => {
  userToDelete.value = user
  confirmEmail.value = ''
}

// Confirm user deletion
const confirmDeleteUser = async () => {
  if (!userToDelete.value || confirmEmail.value !== userToDelete.value.email) return

  try {
    const { error } = await useSupabaseClient()
      .from('profiles')
      .delete()
      .eq('id', userToDelete.value.id)

    if (error) throw error

    // Remove from local state
    users.value = users.value.filter(u => u.id !== userToDelete.value?.id)
    userToDelete.value = null
  } catch (err) {
    console.error('Error deleting user:', err)
    // TODO: Show error toast
  }
}

// Fetch users
const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await useSupabaseClient()
      .from('profiles')
      .select(`
        id,
        email:auth.users!inner(email),
        role:roles!inner(role),
        created_at:auth.users!inner(created_at)
      `)
      .order('created_at', { ascending: false })

    if (err) throw err

    users.value = data || []
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = "Erreur lors du chargement des utilisateurs"
  } finally {
    loading.value = false
  }
}

// Auth middleware with admin check
definePageMeta({
  middleware: ['auth', 'admin']
})

// Load users on mount
onMounted(() => {
  fetchUsers()
})
</script>

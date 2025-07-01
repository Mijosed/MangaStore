<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
        <CardDescription>
          Gérez les utilisateurs et leurs rôles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center py-4">
          <p class="text-gray-500">Chargement des utilisateurs...</p>
        </div>

        <div v-else class="relative overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3">Email</th>
                <th scope="col" class="px-6 py-3">Date d'inscription</th>
                <th scope="col" class="px-6 py-3">Rôle</th>
                <th scope="col" class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in users" 
                :key="user.id"
                class="border-b dark:border-gray-700"
              >
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">
                  {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
                </td>
                <td class="px-6 py-4">
                  <select
                    v-model="user.role"
                    class="bg-transparent border rounded px-2 py-1"
                    @change="updateUserRole(user.id, user.role)"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    @click="deleteUser(user.id)"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'sonner'

definePageMeta({
  layout: 'account',
  middleware: ['auth', 'admin']
})

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

const users = ref<User[]>([])
const loading = ref(true)

// Charger la liste des utilisateurs
const loadUsers = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .rpc('get_users')

    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error("Impossible de charger la liste des utilisateurs")
  } finally {
    loading.value = false
  }
}

// Mettre à jour le rôle d'un utilisateur
const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('roles')
      .upsert({
        user_id: userId,
        role: newRole
      })

    if (error) throw error

    toast.success("Le rôle de l'utilisateur a été mis à jour")
  } catch (error) {
    console.error('Error updating user role:', error)
    toast.error("Impossible de mettre à jour le rôle de l'utilisateur")
  }
}

// Supprimer un utilisateur
const deleteUser = async (userId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    users.value = users.value.filter(user => user.id !== userId)
    toast.success("L'utilisateur a été supprimé")
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error("Impossible de supprimer l'utilisateur")
  }
}

onMounted(() => {
  loadUsers()
})
</script>

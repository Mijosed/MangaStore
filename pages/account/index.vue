<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Informations générales</h1>
    
    <div v-if="profile" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" :value="profile.email" disabled />
            </div>
            
            <div class="space-y-2">
              <Label for="created">Membre depuis</Label>
              <Input 
                id="created" 
                :value="new Date(profile.created_at).toLocaleDateString('fr-FR')" 
                disabled 
              />
            </div>

            <div class="space-y-2">
              <Label for="role">Rôle</Label>
              <Input 
                id="role" 
                :value="profile.role" 
                class="capitalize"
                disabled 
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <NuxtLink 
              to="/resetpassword" 
              class="inline-flex"
            >
              <Button>
                <Icon name="lucide:key" class="w-4 h-4 mr-2" />
                Changer mon mot de passe
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Chargement...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
  middleware: 'auth'
})

const { profile } = useProfile()
</script>

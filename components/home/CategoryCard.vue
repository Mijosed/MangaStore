  
<script setup lang="ts">
  defineProps<{
      img: string
      title: string
      description: string
    }>()
    
    import { Card, CardContent } from '@/components/ui/card'
    
    
    const navigateToCatalogue = (category: string) => {
      navigateTo({
        path: '/catalogue',
        query: { category }
      })
    }
</script>
  
    <template>
        <Card class="cursor-pointer hover:shadow-lg transition-shadow duration-200" @click="navigateToCatalogue(title)">
          <CardContent class="p-4">
            <img :src="img" :alt="title" class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="text-xl font-semibold">{{ title }}</h3>
            <p class="text-sm text-muted-foreground">{{ description }}</p>
          </CardContent>
        </Card>
    </template>
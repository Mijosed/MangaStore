  
<script setup lang="ts">
  defineProps<{
      img: string
      title: string
      description: string
    }>()
    
    import { Card, CardContent } from '@/components/ui/card'
</script>
  
    <template>
        <Card>
          <CardContent class="p-4">
            <img :src="img" :alt="title" class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="text-xl font-semibold">{{ title }}</h3>
            <p class="text-sm text-muted-foreground">{{ description }}</p>
          </CardContent>
        </Card>
    </template>
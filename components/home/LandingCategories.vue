<script setup>
    import CategoryCard from './CategoryCard.vue'
</script>
<template>
    <section class="px-6 py-16 max-w-6xl mx-auto">
      <h2 class="text-3xl font-semibold mb-10 text-center">Nos catégories populaires</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryCard
          img="/images/images.jpg"
          title="Shonen"
          description="Action, aventure, dépassement de soi"
        />
        <CategoryCard
          img="/images/images.jpg"
          title="Seinen"
          description="Histoires matures et psychologiques"
        />
        <CategoryCard
          img="/images/images.jpg"
          title="Shojo"
          description="Romance, émotions et vie scolaire"
        />
      </div>
    </section>
</template>
  
  
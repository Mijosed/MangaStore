import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export const usePagination = <T>(items: Ref<T[]>, itemsPerPage = 12) => {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return items.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(items.value.length / perPage.value)
  )

  const getVisiblePages = () => {
    const pages = []
    const current = currentPage.value
    const total = totalPages.value
    
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)
    
    if (end - start < 2) {
      if (start === 2) {
        end = Math.min(total - 1, start + 2)
      } else if (end === total - 1) {
        start = Math.max(2, end - 2)
      }
    }
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
    
    return pages
  }

  return {
    currentPage,
    perPage,
    paginatedItems,
    totalPages,
    getVisiblePages
  }
}

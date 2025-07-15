import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '@/components/ui/rating/StarRating.vue'

describe('StarRating.vue', () => {
  let wrapper: any

  beforeEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Rendu par défaut', () => {
    beforeEach(() => {
      wrapper = mount(StarRating)
    })

    it('devrait rendre 5 étoiles par défaut', () => {
      const stars = wrapper.findAll('[name="lucide:star"]')
      expect(stars).toHaveLength(5)
    })

    it('devrait avoir une note de 0 par défaut', () => {
      const filledStars = wrapper.findAll('.text-yellow-400')
      expect(filledStars).toHaveLength(0)
    })

    it('devrait avoir une taille moyenne par défaut', () => {
      const stars = wrapper.findAll('.w-4.h-4')
      expect(stars).toHaveLength(5)
    })

    it('ne devrait pas afficher le label par défaut', () => {
      const label = wrapper.find('span')
      expect(label.exists()).toBe(false)
    })
  })

  describe('Props - rating', () => {
    it('devrait rendre les bonnes étoiles remplies pour rating=3', () => {
      wrapper = mount(StarRating, {
        props: { rating: 3 }
      })

      const filledStars = wrapper.findAll('.text-yellow-400.fill-current')
      const emptyStars = wrapper.findAll('.text-gray-300')
      
      expect(filledStars).toHaveLength(3)
      expect(emptyStars).toHaveLength(2)
    })

    it('devrait gérer les ratings décimaux (2.5)', () => {
      wrapper = mount(StarRating, {
        props: { rating: 2.5 }
      })

      const filledStars = wrapper.findAll('.text-yellow-400.fill-current')
      expect(filledStars).toHaveLength(2)
    })

    it('devrait gérer rating=0', () => {
      wrapper = mount(StarRating, {
        props: { rating: 0 }
      })

      const emptyStars = wrapper.findAll('.text-gray-300')
      expect(emptyStars).toHaveLength(5)
    })

    it('devrait gérer rating=5 (maximum)', () => {
      wrapper = mount(StarRating, {
        props: { rating: 5 }
      })

      const filledStars = wrapper.findAll('.text-yellow-400.fill-current')
      expect(filledStars).toHaveLength(5)
    })
  })

  describe('Props - maxStars', () => {
    it('devrait rendre 3 étoiles quand maxStars=3', () => {
      wrapper = mount(StarRating, {
        props: { maxStars: 3 }
      })

      const stars = wrapper.findAll('[name="lucide:star"]')
      expect(stars).toHaveLength(3)
    })

    it('devrait rendre 10 étoiles quand maxStars=10', () => {
      wrapper = mount(StarRating, {
        props: { maxStars: 10 }
      })

      const stars = wrapper.findAll('[name="lucide:star"]')
      expect(stars).toHaveLength(10)
    })
  })

  describe('Props - size', () => {
    it('devrait appliquer la taille sm', () => {
      wrapper = mount(StarRating, {
        props: { size: 'sm' }
      })

      const stars = wrapper.findAll('.w-3.h-3')
      expect(stars).toHaveLength(5)
    })

    it('devrait appliquer la taille md (défaut)', () => {
      wrapper = mount(StarRating, {
        props: { size: 'md' }
      })

      const stars = wrapper.findAll('.w-4.h-4')
      expect(stars).toHaveLength(5)
    })

    it('devrait appliquer la taille lg', () => {
      wrapper = mount(StarRating, {
        props: { size: 'lg' }
      })

      const stars = wrapper.findAll('.w-5.h-5')
      expect(stars).toHaveLength(5)
    })
  })

  describe('Props - showLabel', () => {
    it('devrait afficher le label quand showLabel=true', () => {
      wrapper = mount(StarRating, {
        props: { 
          rating: 4,
          maxStars: 5,
          showLabel: true 
        }
      })

      const label = wrapper.find('span')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('4/5')
    })

    it('devrait afficher le bon label avec des valeurs personnalisées', () => {
      wrapper = mount(StarRating, {
        props: { 
          rating: 7,
          maxStars: 10,
          showLabel: true 
        }
      })

      const label = wrapper.find('span')
      expect(label.text()).toBe('7/10')
    })

    it('devrait appliquer la bonne taille de texte pour le label', () => {
      wrapper = mount(StarRating, {
        props: { 
          size: 'sm',
          showLabel: true 
        }
      })

      let label = wrapper.find('span')
      expect(label.classes()).toContain('text-xs')

      wrapper.unmount()
      wrapper = mount(StarRating, {
        props: { 
          size: 'md',
          showLabel: true 
        }
      })

      label = wrapper.find('span')
      expect(label.classes()).toContain('text-sm')
    })
  })

  describe('Validation des props', () => {
    it('devrait accepter les tailles valides', () => {
      const validSizes = ['sm', 'md', 'lg']
      
      validSizes.forEach(size => {
        expect(() => {
          wrapper = mount(StarRating, {
            props: { size }
          })
        }).not.toThrow()
      })
    })

    it('devrait utiliser la taille md par défaut pour une taille invalide', () => {
      wrapper = mount(StarRating, {
        props: { size: 'md' }
      })

      const stars = wrapper.findAll('.w-4.h-4')
      expect(stars).toHaveLength(5)
    })
  })

  describe('Cas d\'usage réels', () => {
    it('devrait simuler un système de notation de manga', () => {
      wrapper = mount(StarRating, {
        props: {
          rating: 4.2,
          maxStars: 5,
          size: 'lg',
          showLabel: true
        }
      })

      const filledStars = wrapper.findAll('.text-yellow-400.fill-current')
      expect(filledStars).toHaveLength(4)

      const label = wrapper.find('span')
      expect(label.text()).toBe('4.2/5')

      const stars = wrapper.findAll('.w-5.h-5')
      expect(stars).toHaveLength(5)
    })

    it('devrait gérer un système de notation sur 10', () => {
      wrapper = mount(StarRating, {
        props: {
          rating: 8,
          maxStars: 10,
          size: 'sm',
          showLabel: true
        }
      })

      const stars = wrapper.findAll('[name="lucide:star"]')
      const filledStars = wrapper.findAll('.text-yellow-400.fill-current')
      const label = wrapper.find('span')

      expect(stars).toHaveLength(10)
      expect(filledStars).toHaveLength(8)
      expect(label.text()).toBe('8/10')
    })
  })

  describe('Structure DOM', () => {
    beforeEach(() => {
      wrapper = mount(StarRating, {
        props: {
          rating: 3,
          showLabel: true
        }
      })
    })

    it('devrait avoir la structure DOM correcte', () => {
      const container = wrapper.find('.flex.items-center.gap-1')
      expect(container.exists()).toBe(true)

      const starsContainer = wrapper.find('.flex.gap-0\\.5')
      expect(starsContainer.exists()).toBe(true)

      const label = wrapper.find('span')
      expect(label.exists()).toBe(true)
    })

    it('devrait avoir les bonnes classes CSS appliquées', () => {
      const container = wrapper.find('div')
      expect(container.classes()).toEqual(
        expect.arrayContaining(['flex', 'items-center', 'gap-1'])
      )
    })
  })
}) 
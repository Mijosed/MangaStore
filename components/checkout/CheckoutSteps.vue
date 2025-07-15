<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  }
});

const steps = [
  { number: 1, name: 'Livraison', path: '/checkout' },
  { number: 2, name: 'Paiement', path: '/checkout/payment' },
  { number: 3, name: 'Confirmation', path: '/checkout/success' }
];

const getStepStatus = (step) => {
  if (step.number < props.currentStep) {
    return 'completed'
  } else if (step.number === props.currentStep) {
    return 'current'
  } else {
    return 'upcoming'
  }
};

const getStepClasses = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-600'
    case 'current':
      return 'text-red-600'
    case 'upcoming':
    default:
      return 'text-gray-400'
  }
};

const getStepCircleClasses = (status) => {
  switch (status) {
    case 'completed':
      return 'w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium'
    case 'current':
      return 'w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium'
    case 'upcoming':
    default:
      return 'w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium'
  }
};

const getConnectorClasses = (stepIndex) => {
  const nextStatus = stepIndex < steps.length - 1 ? getStepStatus(steps[stepIndex + 1]) : 'upcoming';
  return nextStatus === 'completed' || nextStatus === 'current' ? 'w-8 h-0.5 bg-green-600' : 'w-8 h-0.5 bg-gray-300';
};
</script>

<template>
  <div class="flex items-center justify-center mb-8">
    <div class="flex items-center space-x-4">
      <template v-for="(step, index) in steps" :key="step.number">
        <div class="flex items-center" :class="getStepClasses(getStepStatus(step))">
          <div :class="getStepCircleClasses(getStepStatus(step))">
            <Icon 
              v-if="getStepStatus(step) === 'completed'" 
              name="lucide:check" 
              class="w-4 h-4" 
            />
            <span v-else>{{ step.number }}</span>
          </div>
          <span class="ml-2 text-sm font-medium">{{ step.name }}</span>
        </div>
        
        <!-- Connecteur entre les étapes -->
        <div 
          v-if="index < steps.length - 1" 
          :class="getConnectorClasses(index)"
        ></div>
      </template>
    </div>
  </div>
</template>

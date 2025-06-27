import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Stripe manquante'
      })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil'
    })

    const body = await readBody(event)
    const { amount, currency = 'eur', metadata = {} } = body

    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Montant invalide'
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    
    if (error instanceof Stripe.errors.StripeError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création du paiement'
    })
  }
}) 
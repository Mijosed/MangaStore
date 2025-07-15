import nodemailer from 'nodemailer'

interface ContactForm {
  nom: string
  email: string
  sujet: string
  message: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ContactForm>(event)
    
    if (!body.nom || !body.email || !body.sujet || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'mijosed@gmail.com',
      subject: `[MangaStore Contact] ${body.sujet}`,
      html: `
        <h2>Nouveau message de contact - MangaStore</h2>
        <p><strong>Nom:</strong> ${body.nom}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Sujet:</strong> ${body.sujet}</p>
        <h3>Message:</h3>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><em>Ce message a été envoyé depuis le formulaire de contact du site MangaStore.</em></p>
      `,
      text: `
        Nouveau message de contact - MangaStore
        
        Nom: ${body.nom}
        Email: ${body.email}
        Sujet: ${body.sujet}
        
        Message:
        ${body.message}
        
        Ce message a été envoyé depuis le formulaire de contact du site MangaStore.
      `,
    }

    await transporter.sendMail(mailOptions)

    return {
      success: true,
      message: 'Email envoyé avec succès'
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email'
    })
  }
}) 
# Mise à jour du système de commandes

## 🎯 Modifications apportées

### 1. **Insertion automatique des commandes dans Supabase**
- ✅ Lors du paiement réussi, la commande est automatiquement créée dans la base de données
- ✅ Les articles de la commande sont également enregistrés
- ✅ L'ID du PaymentIntent Stripe est sauvegardé pour traçabilité
- ✅ L'adresse de livraison est stockée au format JSON

### 2. **Correction de l'affichage des prix**
- ✅ Le bouton de paiement affiche maintenant le prix avec la TVA (20%)
- ✅ Le résumé de commande affiche correctement le sous-total, la TVA et le total

### 3. **Nouveaux champs dans la base de données**
- `payment_intent_id` : ID du PaymentIntent Stripe
- `shipping_address` : Adresse de livraison au format JSON

## 📋 Étapes de mise en place

### 1. **Mettre à jour la base de données Supabase**
Exécutez le script SQL dans l'éditeur SQL de Supabase :
```sql
-- Voir le fichier database/update_orders_table.sql
```

### 2. **Vérifier les variables d'environnement**
Assurez-vous que les clés Stripe sont configurées :
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. **Tester le processus de commande**
1. Ajoutez des articles au panier
2. Allez au checkout
3. Remplissez les informations de livraison
4. Effectuez un paiement de test
5. Vérifiez que la commande apparaît dans Supabase

## 🔧 Fonctionnalités ajoutées

### **Composable useOrders**
```typescript
const { orders, loading, error, fetchUserOrders } = useOrders()

// Charger les commandes de l'utilisateur
await fetchUserOrders()

// Obtenir des statistiques
const stats = getOrdersStats()
```

### **Fonction createOrder**
```typescript
// Créée automatiquement lors du paiement réussi
await createOrder(paymentIntentId)
```

## 📊 Structure des données

### **Table orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  payment_intent_id TEXT,
  shipping_address JSONB
);
```

### **Table order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  manga_id UUID REFERENCES manga(id),
  quantity INTEGER,
  price DECIMAL(10,2)
);
```

## 🛡️ Sécurité

- ✅ Vérification de l'authentification utilisateur
- ✅ Politiques RLS (Row Level Security) configurées
- ✅ Les utilisateurs ne peuvent voir que leurs propres commandes
- ✅ Les admins peuvent voir toutes les commandes

## 🚀 Prochaines étapes

1. **Notifications par email** : Envoyer un email de confirmation
2. **Suivi des commandes** : Permettre aux utilisateurs de suivre l'état
3. **Gestion des retours** : Système de retour/remboursement
4. **Factures** : Génération automatique de factures PDF

## 🐛 Dépannage

### **Erreur lors de la création de commande**
- Vérifiez que l'utilisateur est connecté
- Vérifiez les permissions RLS
- Consultez les logs Supabase

### **Prix incorrect affiché**
- Vérifiez que le calcul TVA est correct (20%)
- Vérifiez que `cartStore.totalPrice` est bien défini

### **Paiement Stripe échoue**
- Vérifiez les clés Stripe
- Vérifiez que le montant est en centimes
- Consultez les logs Stripe 
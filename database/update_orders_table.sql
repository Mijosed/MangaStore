-- Script pour mettre à jour la table orders avec les nouveaux champs
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les nouveaux colonnes à la table orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Ajouter des commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN orders.payment_intent_id IS 'ID du PaymentIntent Stripe associé à cette commande';
COMMENT ON COLUMN orders.shipping_address IS 'Adresse de livraison au format JSON';

-- Créer un index sur payment_intent_id pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);

-- Créer un index sur shipping_address pour les recherches JSON
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address ON orders USING GIN (shipping_address);

-- Mettre à jour les politiques RLS si nécessaire
-- Permettre aux utilisateurs de voir leurs propres commandes
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Permettre aux utilisateurs de créer leurs propres commandes
CREATE POLICY IF NOT EXISTS "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permettre aux admins de voir toutes les commandes
CREATE POLICY IF NOT EXISTS "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Permettre aux admins de mettre à jour toutes les commandes
CREATE POLICY IF NOT EXISTS "Admins can update all orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    ); 
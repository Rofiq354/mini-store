-- 1. Enable RLS pada semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;

-- 2. Policy untuk PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Policy untuk PRODUCTS
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Merchants can insert their own products" ON products FOR INSERT WITH CHECK (
  auth.uid() = merchant_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'merchant')
);
CREATE POLICY "Merchants can update their own products" ON products FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants can delete their own products" ON products FOR DELETE USING (auth.uid() = merchant_id);

-- 4. Policy untuk TRANSACTIONS
CREATE POLICY "Users can see their own transactions" ON transactions FOR SELECT USING (
  auth.uid() = merchant_id -- Penjual bisa lihat transaksi mereka
);

-- 5. Policy untuk TRANSACTION_ITEMS
CREATE POLICY "Users can see their own transaction items" ON transaction_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM transactions 
    WHERE transactions.id = transaction_items.transaction_id 
    AND transactions.merchant_id = auth.uid()
  )
);
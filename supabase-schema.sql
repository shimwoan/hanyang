-- products 테이블 생성
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  main_image TEXT NOT NULL,
  detail_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화 후 anon 허용
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);

-- Storage 버킷 (Supabase 대시보드에서 'product-images' 버킷을 public으로 생성하세요)

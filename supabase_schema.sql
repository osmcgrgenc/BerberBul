-- Tüm tabloları ve verileri temizle (dikkatli kullanın!)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS barbers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TYPE IF EXISTS barber_category;
DROP TYPE IF EXISTS subscription_status;

DROP TYPE IF EXISTS barber_category;
DROP TYPE IF EXISTS subscription_status;
DROP TYPE IF EXISTS day_of_week;

-- tenants tablosu
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- Subdomain olarak kullanılacak
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Berber kategorileri için ENUM tipi
CREATE TYPE barber_category AS ENUM ('erkek_kuaforu', 'kadin_kuaforu', 'pet_kuaforu', 'oto_kuaforu');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'unpaid');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- barbers tablosu
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth kullanıcısı
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- SEO dostu URL için
  category barber_category, -- Kategori
  bio TEXT, -- Berberin tanıtım yazısı
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  -- Abonelik bilgileri
  subscription_status subscription_status DEFAULT 'trialing',
  plan_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- working_hours tablosu (berberlerin çalışma saatleri)
CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time TIME,
  end_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (barber_id, day_of_week)
);

-- unavailable_dates tablosu (berberlerin müsait olmadığı tarihler)
CREATE TABLE unavailable_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (barber_id, unavailable_date)
);

-- customers tablosu
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth kullanıcısı
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- services tablosu (berberlerin sunduğu hizmetler)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- appointments tablosu
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- reviews tablosu
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE UNIQUE, -- Bir randevu için sadece bir yorum
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- review_responses tablosu
CREATE TABLE review_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE UNIQUE,
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- barber_gallery tablosu
CREATE TABLE barber_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- customer_favorites tablosu
CREATE TABLE customer_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (customer_id, barber_id)
);

-- RLS (Row Level Security) Politikaları
-- tenants tablosu için RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tenants" ON tenants FOR SELECT USING (true);

-- barbers tablosu için RLS (sadece kendi kiracısının berberlerini görebilir)
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to barbers" ON barbers FOR SELECT USING (true);
-- Berberler kendi bilgilerini güncelleyebilir
CREATE POLICY "Barbers can update their own profile" ON barbers FOR UPDATE USING (auth.uid() = user_id);

-- working_hours tablosu için RLS
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to working hours" ON working_hours FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own working hours" ON working_hours FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));

-- unavailable_dates tablosu için RLS
ALTER TABLE unavailable_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to unavailable dates" ON unavailable_dates FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own unavailable dates" ON unavailable_dates FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));

-- customers tablosu için RLS (sadece kendi bilgilerini görebilir ve güncelleyebilir)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view their own profile" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can update their own profile" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customers can insert their own profile" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- services tablosu için RLS (sadece kendi berberinin hizmetlerini görebilir)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (true);
-- Berberler kendi hizmetlerini yönetebilir
CREATE POLICY "Barbers can manage their own services" ON services FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));

-- appointments tablosu için RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- Müşteriler kendi randevularını görebilir
CREATE POLICY "Customers can view their own appointments" ON appointments FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
-- Berberler kendi randevularını görebilir ve güncelleyebilir
CREATE POLICY "Barbers can view and update their own appointments" ON appointments FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));
-- Müşteriler randevu oluşturabilir
CREATE POLICY "Customers can create appointments" ON appointments FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- reviews tablosu için RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can insert their own reviews" ON reviews FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Customers can update their own reviews" ON reviews FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- review_responses tablosu için RLS
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to review responses" ON review_responses FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own review responses" ON review_responses FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));

-- barber_gallery tablosu için RLS
ALTER TABLE barber_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to barber gallery" ON barber_gallery FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own gallery" ON barber_gallery FOR ALL USING (barber_id IN (SELECT id FROM barbers WHERE user_id = auth.uid()));

-- customer_favorites tablosu için RLS
ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers manage their own favorites" ON customer_favorites FOR ALL USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
) WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- Örnek kiracı ekleme
INSERT INTO tenants (slug, name) VALUES ('ahmetkuafor', 'Ahmet Kuaför');
INSERT INTO tenants (slug, name) VALUES ('mehmetberber', 'Mehmet Berber');

-- Tüm tabloları ve verileri temizle (dikkatli kullanın!)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS barbers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- tenants tablosu
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- Subdomain olarak kullanılacak
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- barbers tablosu
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth kullanıcısı
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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

-- RLS (Row Level Security) Politikaları
-- tenants tablosu için RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tenants" ON tenants FOR SELECT USING (true);

-- barbers tablosu için RLS (sadece kendi kiracısının berberlerini görebilir)
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to barbers" ON barbers FOR SELECT USING (true);
-- Berberler kendi bilgilerini güncelleyebilir
CREATE POLICY "Barbers can update their own profile" ON barbers FOR UPDATE USING (auth.uid() = user_id);

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

-- Örnek kiracı ekleme
INSERT INTO tenants (slug, name) VALUES ('ahmetkuafor', 'Ahmet Kuaför');
INSERT INTO tenants (slug, name) VALUES ('mehmetberber', 'Mehmet Berber');

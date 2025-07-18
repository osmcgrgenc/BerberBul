// Bu dosyada uygulama genelinde kullanılacak TypeScript tür tanımları yer alacaktır.

export interface Barber {
  id: number;
  name: string;
  address: string;
  slug: string;
  category: string;
  bio: string;
  tenant_id: string;
  services: Service[];
  working_hours: WorkingHour[];
  reviews: Review[];
}

export interface Service {
  id: number | string; // ID bazen string olarak da gelebilir
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export interface WorkingHour {
  day_of_week: string;
  start_time: string | null;
  end_time: string | null;
  is_closed?: boolean;
}

export interface UnavailableDate {
  unavailable_date: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  customers: {
    name: string;
  };
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: number;
  appointment_time: string;
  status: 'completed' | 'confirmed' | 'cancelled' | 'pending';
  barbers: Barber;
  services: Service;
  reviews: Review[];
  customers: Customer;
}
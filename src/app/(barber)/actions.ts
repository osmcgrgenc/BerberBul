'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ServiceFormValues } from './_components/ServiceForm';
import { StaffFormValues } from './_components/StaffForm';

export async function updateBarberProfile(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const bio = formData.get('bio') as string;
  const category = formData.get('category') as string;

  const { data: updatedBarber, error } = await supabase
    .from('barbers')
    .update({ name, address, bio, category })
    .eq('user_id', user.id)
    .select('slug')
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { message: 'Profil güncellenirken bir hata oluştu.' };
  }

  if (updatedBarber?.slug) {
    revalidatePath(`/berber/${updatedBarber.slug}`);
  }
  revalidatePath('/barber/settings');

  return { message: 'Profil başarıyla güncellendi!' };
}

export async function addService(barberId: number, serviceData: ServiceFormValues) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  // Barber'ın kendi hizmetini eklediğinden emin ol
  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { data, error } = await supabase
    .from('services')
    .insert({ 
      barber_id: barberId, 
      name: serviceData.name, 
      price: serviceData.price, 
      duration_minutes: serviceData.duration_minutes 
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding service:', error);
    return { message: 'Hizmet eklenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/settings');
  return { message: 'Hizmet başarıyla eklendi!', service: data };
}

export async function updateService(barberId: number, serviceId: string, serviceData: ServiceFormValues) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  // Barber'ın kendi hizmetini güncellediğinden emin ol
  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { data, error } = await supabase
    .from('services')
    .update({ 
      name: serviceData.name, 
      price: serviceData.price, 
      duration_minutes: serviceData.duration_minutes 
    })
    .eq('id', serviceId)
    .eq('barber_id', barberId) // Güvenlik için barber_id kontrolü
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    return { message: 'Hizmet güncellenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/settings');
  return { message: 'Hizmet başarıyla güncellendi!', service: data };
}

export async function deleteService(barberId: number, serviceId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  // Barber'ın kendi hizmetini sildiğinden emin ol
  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId)
    .eq('barber_id', barberId); // Güvenlik için barber_id kontrolü

  if (error) {
    console.error('Error deleting service:', error);
    return { message: 'Hizmet silinirken bir hata oluştu.' };
  }

  revalidatePath('/barber/settings');
  return { message: 'Hizmet başarıyla silindi!' };
}

export async function addStaff(barberId: number, staffData: StaffFormValues) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { data, error } = await supabase
    .from('staff') // 'staff' tablosuna ekleme yapıyoruz
    .insert({ 
      barber_id: barberId, 
      name: staffData.name, 
      specialty: staffData.specialty 
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding staff:', error);
    return { message: 'Personel eklenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/settings');
  return { message: 'Personel başarıyla eklendi!', staff: data };
}

export async function deleteStaff(barberId: number, staffId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', staffId)
    .eq('barber_id', barberId); // Güvenlik için barber_id kontrolü

  if (error) {
    console.error('Error deleting staff:', error);
    return { message: 'Personel silinirken bir hata oluştu.' };
  }

  revalidatePath('/barber/settings');
  return { message: 'Personel başarıyla silindi!' };
}

export async function uploadGalleryImages(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const barberId = formData.get('barberId') as string;
  const files = formData.getAll('images') as File[];

  for (const file of files) {
    const filePath = `${barberId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
    });
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { message: 'Fotoğraf yüklenirken bir hata oluştu.' };
    }

    const { error: insertError } = await supabase
      .from('barber_gallery')
      .insert({ barber_id: barberId, image_path: filePath });
    if (insertError) {
      console.error('Error inserting gallery record:', insertError);
      return { message: 'Fotoğraf kayıt edilirken bir hata oluştu.' };
    }
  }

  revalidatePath('/barber/gallery');
  return { message: 'Fotoğraflar başarıyla yüklendi!' };
}

export async function deleteGalleryImage(barberId: string, imageId: string, imagePath: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { error: storageError } = await supabase.storage.from('gallery').remove([imagePath]);
  if (storageError) {
    console.error('Error deleting from storage:', storageError);
  }

  const { error } = await supabase
    .from('barber_gallery')
    .delete()
    .eq('id', imageId)
    .eq('barber_id', barberId);

  if (error) {
    console.error('Error deleting gallery record:', error);
    return { message: 'Fotoğraf silinirken bir hata oluştu.' };
  }

  revalidatePath('/barber/gallery');
  return { message: 'Fotoğraf başarıyla silindi!' };
}
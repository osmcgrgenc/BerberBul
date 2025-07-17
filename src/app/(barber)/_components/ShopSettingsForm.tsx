
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Örnek veriler. Gerçekte bunlar veritabanından gelecek.
const mockShopData = {
  name: 'Saloon Shine',
  address: 'Barbaros Mah. Atatürk Cad. No:123, İstanbul',
  about: '2010 yılından beri en modern saç kesimleri ve bakımları ile hizmetinizdeyiz.',
  services: [
    { id: '1', name: 'Saç Kesimi', price: 250, duration: 30 },
    { id: '2', name: 'Sakal Tıraşı', price: 150, duration: 20 },
  ],
  staff: [
    { id: '1', name: 'Ali Veli' },
    { id: '2', name: 'Mehmet Çelik' },
  ]
};

function BasicInfoTab() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shopName">Dükkan Adı</Label>
        <Input id="shopName" defaultValue={mockShopData.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Input id="address" defaultValue={mockShopData.address} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="about">Hakkında</Label>
        <Textarea id="about" defaultValue={mockShopData.about} rows={5} />
      </div>
      <Button>Temel Bilgileri Kaydet</Button>
    </div>
  );
}

function ServicesTab() {
  return (
    <div className="space-y-4">
      {mockShopData.services.map(service => (
        <div key={service.id} className="flex items-center justify-between p-2 border rounded-lg">
          <span>{service.name}</span>
          <span>{service.price} TL</span>
          <span>{service.duration} dk</span>
          <Button variant="outline" size="sm">Düzenle</Button>
        </div>
      ))}
      <Button>Yeni Hizmet Ekle</Button>
    </div>
  );
}

function StaffTab() {
  return (
    <div className="space-y-4">
       {mockShopData.staff.map(person => (
        <div key={person.id} className="flex items-center justify-between p-2 border rounded-lg">
          <span>{person.name}</span>
          <Button variant="destructive" size="sm">Kaldır</Button>
        </div>
      ))}
      <Button>Yeni Personel Ekle</Button>
    </div>
  );
}

export default function ShopSettingsForm() {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
        <TabsTrigger value="services">Hizmetler</TabsTrigger>
        <TabsTrigger value="staff">Personel</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <div className="p-6 border-t-0 rounded-b-lg bg-white shadow">
          <BasicInfoTab />
        </div>
      </TabsContent>
      <TabsContent value="services">
         <div className="p-6 border-t-0 rounded-b-lg bg-white shadow">
          <ServicesTab />
        </div>
      </TabsContent>
      <TabsContent value="staff">
         <div className="p-6 border-t-0 rounded-b-lg bg-white shadow">
          <StaffTab />
        </div>
      </TabsContent>
    </Tabs>
  );
}

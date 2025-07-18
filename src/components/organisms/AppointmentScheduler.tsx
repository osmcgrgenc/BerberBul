'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, parseISO, getDay, setHours, setMinutes, isBefore, addMinutes, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';
import { WorkingHour } from '@/lib/types';

enum DayOfWeek {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

interface AppointmentSchedulerProps {
  barberId?: number | string;
  workingHours: WorkingHour[];
  selectedServiceDuration: number | null;
  onCreateAppointment: (date: Date) => void;
}

const dayMap: { [key: number]: DayOfWeek } = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

export function AppointmentScheduler({ workingHours, selectedServiceDuration, onCreateAppointment }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Çalışma günlerini memo ile hesapla
  const availableDays = useMemo(() => {
    return workingHours.map(wh => wh.day_of_week);
  }, [workingHours]);

  // Tarih seçimini devre dışı bırakma fonksiyonu
  const disableDate = useCallback((date: Date) => {
    const day = dayMap[getDay(date)];
    const isPastDate = isToday(date) ? false : date < new Date();
    return isPastDate || !availableDays.includes(day);
  }, [availableDays]);

  // Kullanılabilir zamanları hesaplama fonksiyonu
  const calculateAvailableTimes = useCallback((date: Date) => {
    if (!selectedServiceDuration) {
      setAvailableTimes([]);
      return;
    }

    setIsLoading(true);
    try {
      const dayOfWeek = dayMap[getDay(date)];
      const todayWorkingHours = workingHours.find(wh => wh.day_of_week === dayOfWeek);

      if (!todayWorkingHours) {
        setAvailableTimes([]);
        return;
      }

      const start = parseISO(`2000-01-01T${todayWorkingHours.start_time}:00`);
      const end = parseISO(`2000-01-01T${todayWorkingHours.end_time}:00`);

      const times: string[] = [];
      let currentTime = start;

      // Eğer bugün ise, geçmiş saatleri filtrele
      const now = new Date();
      const isCurrentDay = isToday(date);
      const currentHour = isCurrentDay ? now.getHours() : 0;
      const currentMinute = isCurrentDay ? now.getMinutes() : 0;

      while (isBefore(currentTime, end)) {
        const timeSlot = format(currentTime, 'HH:mm');
        const [hour, minute] = timeSlot.split(':').map(Number);
        
        // Bugün için geçmiş saatleri filtrele
        const isPastTime = isCurrentDay && (hour < currentHour || (hour === currentHour && minute <= currentMinute));
        
        if (!isPastTime) {
          // Burada mevcut randevuları kontrol etme mantığı eklenecek
          // Şimdilik sadece çalışma saatlerine göre boş slotları gösteriyoruz.
          times.push(timeSlot);
        }
        
        currentTime = addMinutes(currentTime, selectedServiceDuration || 30); // Varsayılan 30 dk
      }
      
      setAvailableTimes(times);
    } catch (error) {
      console.error('Zaman hesaplama hatası:', error);
      toast.error('Müsait zamanlar hesaplanırken bir hata oluştu.');
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedServiceDuration, workingHours]);

  // Tarih veya hizmet değiştiğinde zamanları yeniden hesapla
  useEffect(() => {
    if (selectedDate && selectedServiceDuration) {
      calculateAvailableTimes(selectedDate);
    } else {
      setAvailableTimes([]);
      setSelectedTime(null);
    }
  }, [selectedDate, selectedServiceDuration, calculateAvailableTimes]);

  // Tarih seçimi işleyicisi
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  // Zaman seçimi işleyicisi
  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  // Randevu oluşturma işleyicisi
  const handleCreateAppointment = useCallback(() => {
    if (!selectedDate || !selectedTime || !selectedServiceDuration) {
      toast.error('Lütfen bir tarih ve saat seçin.');
      return;
    }
    
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDateTime = setMinutes(setHours(selectedDate, hours), minutes);
      onCreateAppointment(appointmentDateTime);
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);
      toast.error('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, [selectedDate, selectedTime, selectedServiceDuration, onCreateAppointment]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disableDate}
          initialFocus
          locale={tr}
        />
      </div>
      <div className="md:w-1/2">
        {selectedDate && selectedServiceDuration ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Müsait Zaman Dilimleri ({format(selectedDate, 'dd MMMM yyyy', { locale: tr })})</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {availableTimes.map(time => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => handleTimeSelect(time)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Bu tarihte müsait zaman dilimi bulunamadı.</p>
            )}
            <Button
              onClick={handleCreateAppointment}
              disabled={!selectedTime || isLoading}
              className="w-full transition-all duration-200 hover:bg-primary/90"
            >
              Randevu Oluştur
            </Button>
          </div>
        ) : (
          <p className="text-gray-600">Lütfen bir hizmet seçin ve ardından bir tarih seçin.</p>
        )}
      </div>
    </div>
  );
}

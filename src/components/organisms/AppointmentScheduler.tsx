'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, addDays, isSameDay, parseISO, getDay, setHours, setMinutes, isBefore, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

interface WorkingHour {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface AppointmentSchedulerProps {
  barberId: string;
  workingHours: WorkingHour[];
  selectedServiceDuration: number | null;
  onCreateAppointment: (date: Date) => void;
}

const dayMap: { [key: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

export function AppointmentScheduler({ barberId, workingHours, selectedServiceDuration, onCreateAppointment }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate && selectedServiceDuration) {
      calculateAvailableTimes(selectedDate);
    } else {
      setAvailableTimes([]);
      setSelectedTime(null);
    }
  }, [selectedDate, selectedServiceDuration, workingHours]);

  const calculateAvailableTimes = (date: Date) => {
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

    while (isBefore(currentTime, end)) {
      const timeSlot = format(currentTime, 'HH:mm');
      // Burada mevcut randevuları kontrol etme mantığı eklenecek
      // Şimdilik sadece çalışma saatlerine göre boş slotları gösteriyoruz.
      times.push(timeSlot);
      currentTime = addMinutes(currentTime, selectedServiceDuration || 30); // Varsayılan 30 dk
    }
    setAvailableTimes(times);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleCreateAppointment = () => {
    if (selectedDate && selectedTime && selectedServiceDuration) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDateTime = setMinutes(setHours(selectedDate, hours), minutes);
      onCreateAppointment(appointmentDateTime);
    } else {
      toast.error('Lütfen bir tarih ve saat seçin.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date() || !workingHours.some(wh => dayMap[getDay(date)] === wh.day_of_week)}
          initialFocus
          locale={tr}
        />
      </div>
      <div className="md:w-1/2">
        {selectedDate && selectedServiceDuration ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Müsait Zaman Dilimleri ({format(selectedDate, 'dd MMMM yyyy', { locale: tr })})</h3>
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {availableTimes.map(time => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => handleTimeSelect(time)}
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
              disabled={!selectedTime}
              className="w-full"
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

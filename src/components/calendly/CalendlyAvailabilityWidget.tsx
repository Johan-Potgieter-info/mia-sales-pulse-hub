
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { useCalendlyV2API, CalendlyAvailableTime } from "@/hooks/integrations/useCalendlyV2API";
import { format, addDays, startOfDay } from 'date-fns';

interface CalendlyAvailabilityWidgetProps {
  eventTypeUri: string;
  eventTypeName: string;
  eventTypeDuration: number;
  onTimeSlotSelect?: (timeSlot: CalendlyAvailableTime) => void;
}

export const CalendlyAvailabilityWidget = ({
  eventTypeUri,
  eventTypeName,
  eventTypeDuration,
  onTimeSlotSelect
}: CalendlyAvailabilityWidgetProps) => {
  const [availability, setAvailability] = useState<CalendlyAvailableTime[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { getAvailability } = useCalendlyV2API();

  const loadAvailability = async (date: Date) => {
    setIsLoading(true);
    try {
      const startTime = startOfDay(date).toISOString();
      const endTime = startOfDay(addDays(date, 7)).toISOString();
      
      const data = await getAvailability(eventTypeUri, startTime, endTime);
      setAvailability(data?.collection || []);
    } catch (error) {
      console.error('Failed to load availability:', error);
      setAvailability([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability(selectedDate);
  }, [selectedDate, eventTypeUri]);

  const groupedAvailability = availability.reduce((acc, slot) => {
    const date = format(new Date(slot.start_time), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, CalendlyAvailableTime[]>);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Available Times - {eventTypeName}
        </CardTitle>
        <CardDescription>
          {eventTypeDuration} minute sessions • Select a time slot to book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            >
              Next Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAvailability(selectedDate)}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Availability Grid */}
          {isLoading ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading availability...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {dates.map(date => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const daySlots = groupedAvailability[dateKey] || [];
                
                return (
                  <div key={dateKey} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">
                      {format(date, 'EEEE, MMMM d')}
                    </h4>
                    {daySlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {daySlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => onTimeSlotSelect?.(slot)}
                            className="text-xs"
                          >
                            {format(new Date(slot.start_time), 'h:mm a')}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No available times</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Booking Instructions */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">How to Book</h4>
            <p className="text-sm text-muted-foreground">
              Select a time slot above to be redirected to the Calendly booking page where you can complete your appointment booking.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

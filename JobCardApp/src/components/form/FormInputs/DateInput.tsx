import React, { useEffect, useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type DateInputProps = {
  date: string;
  setDate: (date: string) => void;
  style?: Object;
};


export default function DateInput({ date, setDate, style }: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
      }
    }
  }, [date]);

  const onChange = (_event: any, pickedDate?: Date) => {
    setShowPicker(false);
    if (pickedDate) {
      setSelectedDate(pickedDate);
      setDate(pickedDate.toISOString());
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          {
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            backgroundColor: '#fff',
          },
          style,
        ]}
      >
        <Text >
          {date
            ? selectedDate.toLocaleDateString('en-NZ', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
            : 'Enter date'}
        </Text>

      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );

}

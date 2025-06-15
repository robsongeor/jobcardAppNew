import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

type DateInputProps = {
  date: string;
  setDate: (date: string) => void;
  style: Object;
}

export default function DateInput({ date, setDate, style }: DateInputProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_event: any, date?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setDate(date.toISOString())
    }

  };

  return (
    <View >

      {Platform.OS === 'web' ? (
        <TextInput
          value={date}
          onChangeText={(text) => setDate(text)}
          placeholder="Enter date"
          style={style}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 6,
            }}
          >
            <Text>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '../../../constants/colors';

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
      <TouchableOpacity onPress={() => setShowPicker(true)}>

        {date ?
          <Text style={styles.input}>
            {selectedDate.toLocaleDateString('en-NZ', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}
          </Text> :
          <Text style={[styles.input, styles.placeHolderColor]}> Enter date </Text>
        }



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

const styles = StyleSheet.create({

  input: {
    fontSize: 15,
    color: COLORS.black,

    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,

    margin: 0,
  },
  placeHolderColor: {
    color: "#aaa",
    paddingHorizontal: 12,
  }

});

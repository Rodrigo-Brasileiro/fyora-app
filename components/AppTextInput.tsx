import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { sanitizeString } from '../lib/validation';

interface Props extends TextInputProps {
  label: string;
}

const AppTextInput: React.FC<Props> = ({ value, onChangeText, ...rest }) => {
  const handleChange = (text: string) => {
    const cleaned = sanitizeString(text);
    if (onChangeText) onChangeText(cleaned);
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
});

export default AppTextInput;

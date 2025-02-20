import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';

export function TextInput(props: TextInputProps) {
  const { style, ...rest } = props;

  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholderTextColor="#9ca3af"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
});

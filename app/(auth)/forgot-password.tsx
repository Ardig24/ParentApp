import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword() {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'parentapp://reset-password',
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: 'Reset Password',
          headerShown: true,
        }} 
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Your Password</Text>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {success ? (
          <View>
            <Text style={styles.successText}>
              Password reset instructions have been sent to your email.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/sign-in')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Return to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              error={error && error.includes('email') ? error : undefined}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              loading={loading}
              disabled={!email}
            />

            <TouchableOpacity 
              onPress={() => router.push('/sign-in')}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#7c3aed',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    color: '#22c55e',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
});

import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      // Set success state and redirect to sign in after 2 seconds
      setSuccess(true);
      setTimeout(() => {
        router.replace('/sign-in');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          title: 'Create Account',
          headerShown: true,
        }} 
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Join ParentApp</Text>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      {success && (
          <Text style={styles.successText}>Account created successfully! Redirecting to login...</Text>
        )}

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholder="Enter your full name"
          error={error && error.includes('name') ? error : undefined}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
          error={error && error.includes('email') ? error : undefined}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Choose a password"
          error={error && error.includes('password') ? error : undefined}
        />

        <Button
          title="Create Account"
          onPress={signUpWithEmail}
          loading={loading}
          disabled={!email || !password || !fullName}
        />

        <TouchableOpacity 
          onPress={() => router.push('/sign-in')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
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
  },
});

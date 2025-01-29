import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';

interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpForm) => {
    try {
      console.log('[SignUp] Attempting signup with email:', data.email);
      setIsLoading(true);
      await signUp(data.email, data.password);
      console.log('[SignUp] Signup successful, redirecting to home');
      router.replace('/');
    } catch (error) {
      console.error('[SignUp] Signup error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
        Create Account
      </Text>

      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              className="w-full p-4 border border-gray-300 rounded-lg mb-1"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              className="w-full p-4 border border-gray-300 rounded-lg mb-1"
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.password && (
              <Text className="text-red-500 text-sm">
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: 'Please confirm your password',
          validate: (value) =>
            value === password || 'The passwords do not match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <TextInput
              className="w-full p-4 border border-gray-300 rounded-lg mb-1"
              placeholder="Confirm Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
        )}
        name="confirmPassword"
      />

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center space-x-1">
        <Text className="text-gray-600">Already have an account?</Text>
        <Link href="./login" asChild>
          <TouchableOpacity>
            <Text className="text-blue-500 font-semibold">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

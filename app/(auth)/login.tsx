import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log('[Login] Attempting login with email:', data.email);
      setIsLoading(true);
      await signIn(data.email, data.password);
      console.log('[Login] Login successful, redirecting to home');
      router.replace('/');
    } catch (error) {
      console.error('[Login] Login error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
        Welcome Back
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
          <View className="mb-6">
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

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center space-x-1">
        <Text className="text-gray-600">Don't have an account?</Text>
        <Link href="./signup" asChild>
          <TouchableOpacity>
            <Text className="text-blue-500 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Link href="./forgot-password" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center mt-4 font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

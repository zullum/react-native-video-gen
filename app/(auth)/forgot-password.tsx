import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      console.log(
        '[ForgotPassword] Attempting password reset for email:',
        data.email
      );
      setIsLoading(true);
      await resetPassword(data.email);
      console.log('[ForgotPassword] Password reset email sent successfully');
      setIsEmailSent(true);
    } catch (error) {
      console.error('[ForgotPassword] Password reset error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <View className="flex-1 justify-center p-6 bg-white">
        <Text className="text-3xl font-bold mb-4 text-center text-gray-800">
          Email Sent!
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please check your email for instructions to reset your password.
        </Text>
        <Link href="./login" asChild>
          <TouchableOpacity className="w-full bg-blue-500 p-4 rounded-lg">
            <Text className="text-white text-center font-semibold text-lg">
              Back to Login
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-4 text-center text-gray-800">
        Reset Password
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        Enter your email address and we'll send you instructions to reset your
        password.
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
          <View className="mb-6">
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

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <Link href="./login" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center font-semibold">
            Back to Login
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

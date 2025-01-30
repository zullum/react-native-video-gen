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
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-[28px] font-bold mb-4 text-center text-gray-800">
          Email Sent!
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please check your email for instructions to reset your password.
        </Text>
        <Link href="./login" asChild>
          <TouchableOpacity className="w-full h-12 bg-blue-500 rounded-lg justify-center items-center">
            <Text className="text-white font-semibold text-base">
              Back to Login
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-[28px] font-bold mb-4 text-center text-gray-800">
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
          <View className="w-full mb-6">
            <TextInput
              className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
        name="email"
      />

      <TouchableOpacity
        className="w-full h-12 bg-blue-500 rounded-lg mb-4 justify-center items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <Link href="./login" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 font-semibold">Back to Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

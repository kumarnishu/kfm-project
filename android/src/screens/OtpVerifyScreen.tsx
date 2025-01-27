import React, { useContext, useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { useOtpVerify } from 'react-native-otp-verify';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { UserContext } from '../contexts/UserContext';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { GetUserDto } from '../dtos/UserDto';
import { AlertContext } from '../contexts/AlertContext';
import { UserService } from '../services/UserService';

type Props = StackScreenProps<PublicStackParamList, 'OtpVerifyScreen'>;

const OtpVerifyScreen = ({ route }: Props) => {
  const { otp, timeoutError, startListener } = useOtpVerify({ numberOfDigits: 6 });
  const { setAlert } = useContext(AlertContext);
  const { mobile } = route.params;
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate, data, isSuccess, error } = useMutation<
    AxiosResponse<{ user: GetUserDto; token: string }>,
    BackendError,
    { mobile: string; otp: number }
  >(new UserService().CheckOtpAndLogin, {
    onError: (error) => {
      error && setAlert({ message: error.response?.data?.message || '', color: 'error' });
    },
  });

  const { mutate: resendOtp, isSuccess: isOtpSuccess } = useMutation<
    AxiosResponse<{ user: GetUserDto; token: string }>,
    BackendError,
    { mobile: string }
  >(new UserService().SendOtp, {
    onError: (error) => {
      error && setAlert({ message: error.response?.data?.message || '', color: 'error' });
    },
  });

  useEffect(() => {
    startListener();
  }, []);

  useEffect(() => {
    if (otp && mobile) {
      setTimeout(() => {
        mutate({ mobile: mobile, otp: Number(otp) });
      }, 2000);
    }
  }, [otp]);

  useEffect(() => {
    if (isOtpSuccess) {
      setAlert({ message: 'Resend OTP sent successfully', color: 'success' });
    }
    if (error) {
      setAlert({ message: error?.response?.data?.message || 'Unknown error occurred', color: 'error' });
    }
  }, [isOtpSuccess, error]);

  useEffect(() => {
    setIsLoading(false);
  }, [timeoutError]);

  useEffect(() => {
    if (isSuccess && data) {
      setIsLoading(false);
      setUser(data.data.user);
    }
  }, [isSuccess]);

  return (
    <View style={styles.container}>
      {timeoutError && <Text style={styles.errorText}>OTP Timed Out! Please Retry.</Text>}
      <ActivityIndicator size="large" color="red" style={styles.activityIndicator} />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={() => mobile && resendOtp({ mobile: mobile })}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>I didn't get an OTP? Resend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OtpVerifyScreen;

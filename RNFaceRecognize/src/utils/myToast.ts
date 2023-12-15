import {ToastAndroid} from 'react-native';

export const myToast = (message: string, long?: boolean) => {
  return ToastAndroid.show(
    message,
    long ? ToastAndroid.LONG : ToastAndroid.SHORT,
  );
};

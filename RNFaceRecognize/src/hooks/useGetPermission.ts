import {useEffect, useRef} from 'react';
import {Camera} from 'react-native-vision-camera';
import {myToast} from '../utils/myToast';

interface Config {
  onFinish?: () => Promise<void>;
}

const useGetPermission = ({onFinish}: Config) => {
  const savedOnFinish = useRef<() => Promise<void>>(async () => {});

  savedOnFinish.current = async () => {
    if (onFinish) {
      await onFinish();
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      await Camera.getCameraPermissionStatus().then(async status => {
        console.log('permission camera: ', status);
        if (status === 'authorized') {
          return;
        }

        const cameraRequest = await Camera.requestCameraPermission();
        if (cameraRequest === 'authorized') {
          myToast(`Permission Camera ${cameraRequest}`);
          return;
        }
      });

      await savedOnFinish.current();
    };

    getPermissions();
  }, []);
};

export default useGetPermission;

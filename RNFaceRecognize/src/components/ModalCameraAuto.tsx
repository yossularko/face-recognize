import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanFaces} from 'vision-camera-face-detector';
import {runOnJS} from 'react-native-reanimated';
import {ImageObj} from '../types';
import {myToast} from '../utils/myToast';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (img: ImageObj) => void;
}

const invisibleColor = 'rgba(255, 255, 255, 0)';
const dangerColor = 'rgba(237, 35, 28, 1)';
const successColor = 'rgba(85, 198, 170, 1)';

const LoadingView = () => {
  return (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white', fontSize: 16}}>Waiting Camera</Text>
    </View>
  );
};

const ModalCameraAuto = ({visible, onClose, onFinish}: Props) => {
  const [isFace, setIsFace] = useState(false);

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front;

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const faces = scanFaces(frame);

    if (faces.length > 0) {
      runOnJS(setIsFace)(true);
    } else {
      runOnJS(setIsFace)(false);
    }
  }, []);

  useEffect(() => {
    const takePicture = async () => {
      try {
        const photo = await camera.current?.takeSnapshot({
          flash: 'off',
          quality: 85,
          skipMetadata: true,
        });

        if (photo) {
          const {path} = photo;
          const namaFile = path.substring(
            path.lastIndexOf('/') + 1,
            path.length,
          );
          onFinish({
            uri: `file://${path}`,
            name: namaFile,
            type: 'image/jpeg',
          });
          onClose();
        }
      } catch (err: any) {
        myToast(String(err));
        console.log('error capture: ', String(err));
      }
    };
    if (isFace && visible) {
      setTimeout(() => {
        takePicture();
      }, 500);
    } else {
      setIsFace(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFace, visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      {device == null ? (
        <LoadingView />
      ) : (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor={invisibleColor}
          />
          <View style={styles.cameraContainer}>
            <Camera
              ref={camera}
              style={{aspectRatio: 3 / 4}}
              device={device}
              isActive={visible}
              photo={true}
              onError={onError}
              frameProcessor={frameProcessor}
              frameProcessorFps={3}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  backgroundColor: isFace ? successColor : dangerColor,
                  fontSize: 24,
                }}>
                {isFace ? 'Camera Siap 🥳' : 'Wajah tidak terlihat 😴'}
              </Text>
            </View>
            <View style={styles.actionSection} />
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCameraAuto;

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  waitingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    paddingTop: ScreenHeight * 0.07,
  },
  labelContainer: {
    height: 100,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
  },
  actionSection: {
    backgroundColor: 'rgba(21, 21, 21, 0.25)',
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 14,
    padding: 8,
  },
  confirmButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
});

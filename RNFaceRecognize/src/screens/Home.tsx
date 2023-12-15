import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Layout from '../components/Layout';
import {ImageObj} from '../types';
import {useDisclosure} from '../hooks';
import ModalCameraAuto from '../components/ModalCameraAuto';
import {myToast} from '../utils/myToast';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  compareFaceDescription,
  createFaceDescription,
  testApi,
} from '../utils/fetchApi';

const defaultAva =
  'https://media.gettyimages.com/id/1227618801/vector/human-face-avatar-icon-profile-for-social-network-man-vector-illustration.jpg?s=2048x2048&w=gi&k=20&c=a8O0jXGeYVFI9TCguB1f-7sFDsinMVJnoEpbEg4yhvY=';

const Home = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [registeredImg, setRegisteredImg] = useState('');
  const [loadingRegister, setLoadingRegister] = useState(false);

  const [currentImg, setCurrentImg] = useState<ImageObj | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [similarity, setSimilarity] = useState('');

  const matchFaces = useCallback(
    async (imgPost: string) => {
      if (!registeredImg || !imgPost) {
        return;
      }
      setLoadingMatch(true);

      try {
        const response = await compareFaceDescription({
          face_description: registeredImg,
          image: imgPost,
        });

        console.log('res: ', response);

        if (response.isMatch) {
          setSimilarity(`${response.similar}%`);
          setLoadingMatch(false);
          return;
        }

        setSimilarity('Not Match');
        setLoadingMatch(false);
      } catch (error) {
        console.log('error match: ', error);
        setSimilarity('Error');
        setLoadingMatch(false);
      }
    },
    [registeredImg],
  );

  const handleRegisFace = useCallback(async (val: ImageObj) => {
    setLoadingRegister(true);
    try {
      const imgBase64 = await ReactNativeBlobUtil.fs.readFile(
        val.uri,
        'base64',
      );

      const foundFace = await createFaceDescription({image: imgBase64});
      setRegisteredImg(foundFace.face_description);
      setLoadingRegister(false);
    } catch (error) {
      console.log('error regis: ', error);
      setLoadingRegister(false);
    }
  }, []);

  const handleSetImage = useCallback(
    async (val: ImageObj) => {
      if (registeredImg) {
        setCurrentImg(val);
        const imgBase64 = await ReactNativeBlobUtil.fs.readFile(
          val.uri,
          'base64',
        );
        await matchFaces(imgBase64);
        return;
      }

      await handleRegisFace(val);
    },
    [registeredImg, handleRegisFace, matchFaces],
  );

  const clearResults = useCallback((isLogout?: boolean) => {
    if (isLogout) {
      setRegisteredImg('');
    }
    setCurrentImg(null);
    setSimilarity('');
  }, []);
  return (
    <Layout style={styles.container}>
      <ModalCameraAuto
        visible={isOpen}
        onClose={onClose}
        onFinish={handleSetImage}
      />
      {!registeredImg ? (
        <View>
          <Text>
            You're not registered{' '}
            {loadingRegister && <ActivityIndicator color="gray" size="small" />}
          </Text>
          <Button
            title="Register Now"
            onPress={onOpen}
            disabled={loadingRegister}
          />
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <TouchableHighlight onPress={onOpen}>
            <Image
              style={{
                height: 150,
                width: 150,
              }}
              source={{uri: currentImg ? currentImg.uri : defaultAva}}
              resizeMode="contain"
            />
          </TouchableHighlight>
          {!similarity ? (
            <Text>You're Registered. Tap the photo to recognize</Text>
          ) : (
            <Text
              style={{
                fontSize: 24,
                color: similarity.includes('%') ? '#00c851' : '#ff4444',
                fontWeight: '500',
              }}>
              {similarity}
            </Text>
          )}
          {loadingMatch ? (
            <>
              <Text>
                Recognizing <ActivityIndicator size="small" color="gray" />
              </Text>
              <Button title="Clear" onPress={() => clearResults()} />
              <Button title="Logout" onPress={() => clearResults(true)} />
            </>
          ) : null}
        </View>
      )}
      <Button
        title="Test Api"
        onPress={() =>
          testApi()
            .then(data => myToast(String(data.message)))
            .catch(err => console.log('error: ', err))
        }
      />
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Home from './src/screens/Home';
import {useGetPermission} from './src/hooks';

function App(): JSX.Element {
  useGetPermission({
    onFinish: async () => {
      console.log('finish check permission');
    },
  });
  return <Home />;
}

export default App;

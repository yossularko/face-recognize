import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Layout = ({
  children,
  style,
}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={[backgroundStyle, {flex: 1}, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default Layout;

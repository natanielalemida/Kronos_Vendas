import {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
} from 'react-native';
import {LoadingProps} from './type';

export function LoadingLogin({progress}: LoadingProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 900],
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
      <Text style={{color: 'white'}}> {progress.message} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    borderRadius: 8,
    width: 280,
    height: 10,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  animatedBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b5998',
  },
});

import {
  Platform,
  StyleProp,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

interface CardPropsType {
  index: number;
  bgColor: string;
}

export default function Card({index, bgColor}: CardPropsType) {
  const {width} = useWindowDimensions();
  const shadowStyle: StyleProp<ViewStyle> =
    Platform.OS === 'android'
      ? {
          elevation: 15,
        }
      : {
          shadowOffset: {
            width: -3,
            height: -3,
          },
          shadowOpacity: 0.3,
          shadowRadius: 7,
        };

  return (
    <View
      style={[
        {
          position: 'absolute',
          marginTop: index * 20,
          backgroundColor: bgColor,
          borderRadius: 8,
          width: width * 0.7,
          height: width * 0.7 * 0.58,
        },
        shadowStyle,
      ]}
    />
  );
}

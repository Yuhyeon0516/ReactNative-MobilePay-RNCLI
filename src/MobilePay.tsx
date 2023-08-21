import {Animated, PanResponder, View, useWindowDimensions} from 'react-native';
import React, {useRef} from 'react';
import Card from './Card';

export default function MobilePay() {
  const card = [
    {color: '#999'},
    {color: '#aaa'},
    {color: '#bbb'},
    {color: '#ccc'},
    {color: '#ddd'},
    {color: '#eee'},
  ];

  const cardRef = useRef<'fold' | 'unfold'>('fold');
  const {width} = useWindowDimensions();

  const yAnim = useRef(new Animated.Value(0)).current;
  const rotateZAnim = useRef(new Animated.Value(0)).current;

  const panRes = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const {dy, dx} = gestureState;

      const xSlider = Math.abs(dy) < Math.abs(dx);

      if (xSlider) {
      } else {
        if (dy > 5 && dy < 100 && cardRef.current === 'fold') {
          yAnim.setValue(dy);
        }

        if (dy > 5 && dy < 100 && cardRef.current === 'unfold') {
          rotateZAnim.setValue(dy);
        }

        if (dy < -5 && dy > -60 && cardRef.current === 'unfold') {
          yAnim.setValue(60 + dy);
        }
      }
    },
    onPanResponderEnd: (_, gestureState) => {
      const {dy, dx} = gestureState;

      const xSlider = Math.abs(dy) < Math.abs(dx);

      if (xSlider) {
      } else {
        if (dy > 5 && cardRef.current === 'unfold') {
          Animated.timing(rotateZAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }

        if (dy > 5) {
          Animated.timing(yAnim, {
            toValue: 60,
            duration: 300,
            useNativeDriver: false,
          }).start();

          cardRef.current = 'unfold';
        }

        if (dy < -5) {
          Animated.timing(yAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();

          cardRef.current = 'fold';
        }
      }
    },
  });

  return (
    <View
      {...panRes.panHandlers}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          position: 'relative',
          width: width * 0.7,
          height: width * 0.7 * 0.58 + (card.length - 1) * 20,
        }}>
        {card.map((item, index) => {
          const multiplyValue = new Animated.Value(index - 3);
          const translateY = Animated.multiply(yAnim, multiplyValue);

          return (
            <Card
              key={index}
              index={index}
              bgColor={item.color}
              animStyle={{
                transform: [
                  {
                    translateY: translateY,
                  },
                  {
                    rotateZ: rotateZAnim.interpolate({
                      inputRange: [0, 20],
                      outputRange: ['0deg', '2deg'],
                    }),
                  },
                ],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

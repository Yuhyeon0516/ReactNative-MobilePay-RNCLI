import {Animated, PanResponder, View, useWindowDimensions} from 'react-native';
import React, {useRef, useState} from 'react';
import Card from './Card';

export default function MobilePay() {
  const card = [
    {
      color: '#999',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card0.png'),
    },
    {
      color: '#aaa',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card1.png'),
    },
    {
      color: '#bbb',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card2.png'),
    },
    {
      color: '#ccc',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card3.png'),
    },
    {
      color: '#ddd',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card4.png'),
    },
    {
      color: '#eee',
      xAnim: useRef(new Animated.Value(0)).current,
      imagePath: require('../assets/Card5.png'),
    },
  ];

  const cardRef = useRef<'fold' | 'unfold'>('fold');
  const [focus, setFocus] = useState(card.length - 1);
  const {width} = useWindowDimensions();

  const yAnim = useRef(new Animated.Value(0)).current;
  const rotateZAnim = useRef(new Animated.Value(0)).current;

  const panRes = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const {dy, dx} = gestureState;

      const xSlider = Math.abs(dy) < Math.abs(dx);

      if (xSlider) {
        if (dx < -5 && cardRef.current === 'fold') {
          card[focus].xAnim.setValue(dx);
        }
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
        if (dx < -5 && cardRef.current === 'fold') {
          if (focus > 0) {
            Animated.timing(card[focus].xAnim, {
              toValue: -600,
              duration: 300,
              useNativeDriver: false,
            }).start(({finished}) => {
              if (finished) {
                setFocus(prev => prev - 1);
              }
            });
          } else {
            Animated.timing(card[focus].xAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }
        }

        if (dx > 5 && cardRef.current === 'fold') {
          if (focus < card.length - 1) {
            Animated.timing(card[focus + 1].xAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start(({finished}) => {
              if (finished) {
                setFocus(prev => prev + 1);
              }
            });
          }
        }
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
              animStyle={{
                transform: [
                  {
                    translateX: item.xAnim,
                  },
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
              imagePath={item.imagePath}
            />
          );
        })}
      </View>
    </View>
  );
}

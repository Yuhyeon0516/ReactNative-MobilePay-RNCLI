import {View, useWindowDimensions} from 'react-native';
import React from 'react';
import Card from './Card';

export default function MobilePay() {
  const {width} = useWindowDimensions();
  const card = [
    {color: '#aaa'},
    {color: '#bbb'},
    {color: '#ccc'},
    {color: '#ddd'},
    {color: '#eee'},
    {color: '#f2f2f2'},
  ];

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          position: 'relative',
          width: width * 0.7,
          height: width * 0.7 * 0.58 + (card.length - 1) * 20,
        }}>
        {card.map((item, index) => {
          return <Card index={index} bgColor={item.color} />;
        })}
      </View>
    </View>
  );
}

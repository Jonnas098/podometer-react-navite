import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Svg, {G, Circle } from 'react-native-svg';

const Podometer = () => {
  
    const [steps, setSteps] = useState(0);
    const [circleLength, setCircleLength] = useState(0);
    const halfCircle = 50;

  useEffect(() => {
    let subscription;
    Accelerometer.setUpdateInterval(100);

    const calculateSteps = (accelerometerData) => {
      const acceleration = Math.sqrt(
        accelerometerData.x * accelerometerData.x +
        accelerometerData.y * accelerometerData.y +
        accelerometerData.z * accelerometerData.z
      );

      if (acceleration > 1.2) {
        setSteps((prevSteps) => prevSteps + 1);
      }
    };

    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener(calculateSteps);
      } else {
        console.log('Accelerometer not available');
      }
    });

    return () => subscription && subscription.remove();
  }, []);

  useEffect(() => {
    if (steps >= 100){
        setSteps(0);
        setCircleLength(0);
    } else {
        setCircleLength(steps * 10);
    }
  }, [steps]);

  return (
      <Svg
        height="50%"
        width="100%" 
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
        <Circle
          cx="50%"
          cy="50%"
          r="40"
          stroke="#2ecc71"
          strokeWidth="10"
          fill="transparent"
          strokeOpacity={0.2}
        />
        <Circle
          cx="50%"
          cy="50%"
          r="40"
          stroke="#2ecc71"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circleLength + ` ` + 251.2}
          strokeDashoffset={circleLength / 1.3}
          strokeLinecap="round"
          strokeOpacity="0.8"/>
        </G>
        
        <Text style={styles.text}>{steps} Steps</Text>
      </Svg>
  );
}

const styles = StyleSheet.create({
    text: {
        position: 'absolute',
        top:150,
        right: 165,
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 30,
    },
});

export default Podometer;

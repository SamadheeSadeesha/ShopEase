import { View, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';

const TuluLogo = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={150}
    height={150}
    viewBox="0 0 1024 1024"
    fill="none"
    {...props}
  >
    <Path
      fill="#F4F4F2"
      fillRule="evenodd"
      d="M676.144 511.898 726 351.449H576.782c-5.571 0-9.539-5.397-7.876-10.706L615.436 191H454.987l-52.335 168.384c-23.543 75.703 33.052 152.514 112.314 152.514H354.721l-52.336 168.384c-23.542 75.703 33.053 152.514 112.315 152.514h161.178l49.856-160.449H476.516c-5.572 0-9.539-5.397-7.876-10.706l46.53-149.743h160.974Z"
      clipRule="evenodd"
    />
  </Svg>
);

const AnimatedSplash = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrance animation - smooth fade in with subtle movement
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(() => {
      // Gentle breathing effect after entrance
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    });

    // Exit animation
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#BA1D84',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateY },
          ],
        }}
      >
        <TuluLogo />
      </Animated.View>
    </View>
  );
};

export default AnimatedSplash;
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";

const ENTRANCE_DURATION = 900;
const UNDERLINE_DELAY = 550;
const UNDERLINE_DURATION = 500;
const EXIT_DURATION = 500;

const GOLD = "#C9A24B";

function useRing(delay: number) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    const timer = setTimeout(() => {
      animation = Animated.loop(
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.7,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.35,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1550,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      animation?.stop();
    };
  }, [delay, scale, opacity]);

  return { scale, opacity };
}

export default function AnimatedSplash({
  shouldExit,
  onFinish,
}: {
  shouldExit: boolean;
  onFinish: () => void;
}) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.55)).current;
  const logoRotate = useRef(new Animated.Value(1)).current;
  const breathe = useRef(new Animated.Value(1)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitTranslateY = useRef(new Animated.Value(0)).current;

  const ringA = useRing(150);
  const ringB = useRing(950);

  // entrance + underline draw-in + the looping "breathe" pulse — plays
  // indefinitely until `shouldExit` flips true, so this never goes blank
  // while waiting on something slow (e.g. auth hydration taking longer
  // than expected).
  useEffect(() => {
    let breatheLoop: Animated.CompositeAnimation | null = null;
    let cancelled = false;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 0,
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (cancelled) return;
      breatheLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, {
            toValue: 1.045,
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breathe, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      breatheLoop.start();
    });

    const underlineTimer = setTimeout(() => {
      Animated.timing(underlineWidth, {
        toValue: 64,
        duration: UNDERLINE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, UNDERLINE_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(underlineTimer);
      breatheLoop?.stop();
    };
  }, [logoOpacity, logoScale, logoRotate, breathe, underlineWidth]);

  useEffect(() => {
    if (!shouldExit) return;
    Animated.parallel([
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(exitTranslateY, {
        toValue: -14,
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [shouldExit, exitOpacity, exitTranslateY, onFinish]);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-10deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: exitOpacity, transform: [{ translateY: exitTranslateY }] },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { opacity: ringA.opacity, transform: [{ scale: ringA.scale }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { opacity: ringB.opacity, transform: [{ scale: ringB.scale }] },
        ]}
      />

      <Animated.Image
        source={require("../../assets/logo/image.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [
              { scale: Animated.multiply(logoScale, breathe) },
              { rotate: spin },
            ],
          },
        ]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.underline, { width: underlineWidth }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  ring: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  logo: {
    width: 150,
    height: 150,
  },
  underline: {
    height: 2,
    borderRadius: 1,
    backgroundColor: GOLD,
    marginTop: 18,
  },
});

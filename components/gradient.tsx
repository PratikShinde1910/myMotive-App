import {
  Blur,
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

const VISUAL_CONFIG = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 2,
  },
} as const;

const ANIMATION_CONFIG = {
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },
  spring: {
    damping: 10,
    stiffness: 50,
  },
} as const;

const RADIUS_CONFIG = {
  minScale: 0.4,
  maxcScale: 1.4,
  speakingScale: 1.0,
  quietScale: 0.6,
  baseRadius: {
    dafault: width,
    speaking: width / 4,
  },
} as const;

type GradientPosition = "top" | "center" | "bottom";

interface GradientProps {
  position: GradientPosition;
  isSpeaking: boolean;
}

const getTargetY = (pos: GradientPosition): number => {
  switch (pos) {
    case "top":
      return 0;
    case "center":
      return VISUAL_CONFIG.center.y;
    case "bottom":
      return height;
    default:
      return VISUAL_CONFIG.center.y;
  }
};

const calculateRadiusBonds = (baseRadius: number) => {
  "worklet";
  return {
    min: baseRadius * RADIUS_CONFIG.minScale,
    max: baseRadius * RADIUS_CONFIG.maxcScale,
  };
};

const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
  "worklet";
  const { min, max } = calculateRadiusBonds(baseRadius);
  const scale = isSpeaking
    ? RADIUS_CONFIG.speakingScale
    : RADIUS_CONFIG.quietScale;

  return min + (max - min) * scale;
};

export function Gradient({ position, isSpeaking }: GradientProps) {
  const animatedY = useSharedValue(0);
  const radiusScale = useSharedValue(1);
  const baseRadiusvalue = useSharedValue(RADIUS_CONFIG.baseRadius.dafault);
  const mountRadius = useSharedValue(0);

  const center = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusBonds(baseRadiusvalue.value);
    const calculatedRadius = min + (max - min) * radiusScale.value;
    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });

  useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
  }, [position, animatedY]);

  useEffect(() => {
    animatedY.value = getTargetY(position);
  }, []);

  useEffect(() => {
    const targetRadius = calculateTargetRadius(
      RADIUS_CONFIG.baseRadius.dafault,
      isSpeaking
    );
    mountRadius.value = withTiming(targetRadius, {
      duration: ANIMATION_CONFIG.durations.MOUNT,
    });
  }, []);

  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      baseRadiusvalue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking);
      animatedY.value = withTiming(getTargetY("center"), { duration });
    } else {
      baseRadiusvalue.value = withTiming(RADIUS_CONFIG.baseRadius.dafault);
      animatedY.value = withTiming(getTargetY(position), { duration });
    }
  }, [isSpeaking, baseRadiusvalue, animatedY, position]);

  useEffect(() => {
    if (isSpeaking) {
      radiusScale.value = withRepeat(
        withTiming(RADIUS_CONFIG.speakingScale, {
          duration: ANIMATION_CONFIG.durations.PULSE,
        }), -1,
        true
      );
    } else {
      radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, {
        duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION,
      });
    }
  }, [isSpeaking, radiusScale]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
            colors={[
              Colors.mediumBlue,
              Colors.lightBlue,
              Colors.teal,
              Colors.iceBlue,
              Colors.white,
            ]}
          />
          <Blur blur={VISUAL_CONFIG.blur} mode={"clamp"} />
        </Rect>
      </Canvas>
    </View>
  );
}

const Colors = {
  white: "#FFFFFF",
  teal: "#5AC8FA",
  mediumBlue: "#007AFF",
  lightBlue: "#4DA6FF",
  iceBlue: "#E6F3FF",
};

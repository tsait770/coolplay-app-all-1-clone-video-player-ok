/**
 * Design Tokens for Apple Watch-like Design Language
 * Inspired by watchOS design principles: clean, minimal, focused
 */

export const DesignTokens = {
  // Typography Scale (Apple Watch inspired)
  typography: {
    // Display sizes (for main titles)
    display: {
      large: { fontSize: 34, fontWeight: '700' as const, lineHeight: 40 },
      medium: { fontSize: 28, fontWeight: '600' as const, lineHeight: 34 },
      small: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
    },
    // Title sizes
    title: {
      large: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
      medium: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
      small: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    },
    // Body text
    body: {
      large: { fontSize: 17, fontWeight: '400' as const, lineHeight: 24 },
      medium: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
      small: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
    },
    // Caption text
    caption: {
      large: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
      medium: { fontSize: 11, fontWeight: '500' as const, lineHeight: 16 },
      small: { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
    },
  },

  // Spacing System (8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border Radius (Apple Watch style)
  borderRadius: {
    none: 0,
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Shadows (subtle, Apple-like)
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16,
    },
  },

  // Animation Durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Component Sizes
  components: {
    button: {
      height: {
        sm: 32,
        md: 44,
        lg: 56,
      },
      padding: {
        sm: { horizontal: 12, vertical: 6 },
        md: { horizontal: 16, vertical: 12 },
        lg: { horizontal: 20, vertical: 16 },
      },
    },
    input: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      padding: {
        horizontal: 16,
        vertical: 12,
      },
    },
    card: {
      padding: {
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
      },
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },

  // Apple Watch specific design elements
  watch: {
    // Digital Crown inspired interactions
    crown: {
      size: 44,
      borderWidth: 2,
      shadowRadius: 8,
    },
    // Circular progress indicators
    progress: {
      strokeWidth: {
        thin: 2,
        medium: 4,
        thick: 6,
      },
    },
    // Haptic feedback timing
    haptic: {
      light: 50,
      medium: 100,
      heavy: 150,
    },
  },
} as const;

// Helper functions for responsive design
export const getResponsiveValue = <T>(
  mobile: T,
  tablet?: T,
  desktop?: T,
  screenWidth?: number
): T => {
  const width = screenWidth || 375; // Default mobile width
  
  if (desktop && width >= DesignTokens.breakpoints.desktop) return desktop;
  if (tablet && width >= DesignTokens.breakpoints.tablet) return tablet;
  return mobile;
};

// Helper for spacing calculations
export const spacing = (multiplier: number): number => {
  return DesignTokens.spacing.sm * multiplier;
};

// Helper for creating consistent shadows
export const createShadow = (level: keyof typeof DesignTokens.shadows) => {
  return DesignTokens.shadows[level];
};

export default DesignTokens;
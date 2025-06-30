export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const useAnimationVariants = () => {
  return {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerChildren,
  }
}
import { MODES, DEFAULT_MODE } from '@/components/ModeSelector/constants.js'

export const getModeConfig = (modeKey) => {
  return MODES.find(mode => mode.key === modeKey) || MODES.find(mode => mode.key === DEFAULT_MODE)
}

export const getAllModes = () => {
  return MODES
}

export const isValidMode = (modeKey) => {
  return MODES.some(mode => mode.key === modeKey)
}

export const handleModeChange = (newMode, emit) => {
  if (isValidMode(newMode)) {
    emit('mode-change', newMode)
  }
}

export const getNextMode = (currentMode) => {
  const currentIndex = MODES.findIndex(mode => mode.key === currentMode)
  const nextIndex = (currentIndex + 1) % MODES.length
  return MODES[nextIndex].key
}

export const getPreviousMode = (currentMode) => {
  const currentIndex = MODES.findIndex(mode => mode.key === currentMode)
  const prevIndex = currentIndex === 0 ? MODES.length - 1 : currentIndex - 1
  return MODES[prevIndex].key
}
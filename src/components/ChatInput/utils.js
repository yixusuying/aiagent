import { PLACEHOLDERS, DEFAULT_PLACEHOLDER } from '@/components/ChatInput/constants.js'

export const getPlaceholderText = (activeMode) => {
  return PLACEHOLDERS[activeMode] || DEFAULT_PLACEHOLDER
}

export const validateInput = (inputValue) => {
  return inputValue && inputValue.trim().length > 0
}

export const createMessagePayload = (inputValue, activeMode) => {
  return {
    message: inputValue.trim(),
    mode: activeMode
  }
}

export const resetInput = (inputRef) => {
  if (inputRef.value) {
    inputRef.value = ''
  }
}
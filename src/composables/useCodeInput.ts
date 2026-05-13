import { ref, nextTick } from 'vue'

export function useCodeInput(length = 4) {
  const code = ref<string[]>(Array(length).fill(''))

  const handleInputChange = (e: Event, index: number) => {
    const target = e.target as HTMLInputElement
    const value = target.value

    if (value.match(/^[a-zA-Z0-9]$/)) {
      code.value[index] = value
      if (index < code.value.length - 1) {
        nextTick(() => {
          document.getElementById(`input-${index + 1}`)?.focus()
        })
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      code.value[index] = ''
      if (index > 0) {
        nextTick(() => {
          document.getElementById(`input-${index - 1}`)?.focus()
        })
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      nextTick(() => {
        document.getElementById(`input-${index - 1}`)?.focus()
      })
    } else if (e.key === 'ArrowRight' && index < code.value.length - 1) {
      nextTick(() => {
        document.getElementById(`input-${index + 1}`)?.focus()
      })
    } else if (e.key === 'Delete') {
      code.value[index] = ''
      if (index < code.value.length - 1) {
        nextTick(() => {
          document.getElementById(`input-${index + 1}`)?.focus()
        })
      }
    } else if (/^[a-zA-Z0-9]$/.test(e.key) && code.value[index] !== '') {
      nextTick(() => {
        document.getElementById(`input-${index + 1}`)?.focus()
      })
    }
  }

  const resetCode = () => {
    code.value = Array(length).fill('')
  }

  const getCodeString = () => code.value.join('')

  return {
    code,
    handleInputChange,
    handleKeyDown,
    resetCode,
    getCodeString
  }
}

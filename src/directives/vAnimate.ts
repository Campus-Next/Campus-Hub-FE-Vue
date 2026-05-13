export const vAnimate = {
  mounted(el: HTMLElement, binding: any) {
    const defaultClass = 'opacity-0 translate-y-8'
    const animationClass = binding.value || 'animate__animated animate__fadeInUp opacity-100 translate-y-0'
    const durationClass = binding.arg ? `duration-[${binding.arg}ms]` : 'duration-700'
    
    // Set initial state
    el.classList.add('transition-all', durationClass)
    
    if (typeof binding.value === 'string' && binding.value.includes('animate__')) {
       el.style.opacity = '0'
    } else {
       defaultClass.split(' ').forEach(c => el.classList.add(c))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (typeof binding.value === 'string' && binding.value.includes('animate__')) {
                el.style.opacity = ''
                el.classList.add(...animationClass.split(' '))
            } else {
                defaultClass.split(' ').forEach(c => el.classList.remove(c))
                el.classList.add('opacity-100', 'translate-y-0')
            }
            observer.unobserve(el) // Runs once (viewport={once: true})
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  }
}

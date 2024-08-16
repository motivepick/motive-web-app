export const setTheme = (theme: string) => {
    document.querySelector('html')?.setAttribute('data-bs-theme', theme)
}


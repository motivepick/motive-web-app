export const DELAY_MS = 250

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

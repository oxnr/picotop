// Standardized signal colors and styling across the entire app
export const SIGNAL_COLORS = {
  ACCUMULATE: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
    hex: '#22c55e'
  },
  HOLD: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400', 
    border: 'border-yellow-500/30',
    hex: '#eab308'
  },
  DISTRIBUTE: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30', 
    hex: '#f97316'
  },
  SELL: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    hex: '#ef4444'
  }
} as const

export type SignalType = keyof typeof SIGNAL_COLORS

export function getSignalStyle(signal: SignalType) {
  return SIGNAL_COLORS[signal]
}

export function getSignalColorClass(signal: SignalType, type: 'bg' | 'text' | 'border' | 'hex' = 'text') {
  return SIGNAL_COLORS[signal][type]
}
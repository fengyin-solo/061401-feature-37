export type StatName = 'health' | 'hunger' | 'thirst' | 'wood' | 'stone'

export type ChangeDirection = 'increase' | 'decrease' | 'neutral'

export type LogSource = 'player_action' | 'random_event' | 'system'

export interface MetricChange {
  metric: StatName
  value: number
  direction: ChangeDirection
}

export interface GameState {
  health: number
  hunger: number
  thirst: number
  wood: number
  stone: number
  turn: number
  isGameOver: boolean
  logs: LogEntry[]
}

export interface LogEntry {
  id: number
  text: string
  type: 'action' | 'event' | 'system' | 'good' | 'bad'
  turn: number
  source: LogSource
  sourceName: string
  metrics: MetricChange[]
}

export interface RandomEvent {
  id: string
  text: string
  type: 'good' | 'bad' | 'neutral'
  effects: {
    health?: number
    hunger?: number
    thirst?: number
    wood?: number
    stone?: number
  }
}

export type ActionType = 'gatherWood' | 'gatherStone' | 'hunt' | 'drink'

export interface ActionEffect {
  health?: number
  hunger?: number
  thirst?: number
  wood?: number
  stone?: number
}

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { LogEntry, MetricChange, StatName } from '@/types/game'

interface Props {
  logs: LogEntry[]
}

const props = defineProps<Props>()

const logContainer = ref<HTMLElement | null>(null)

const statDisplayNames: Record<StatName, string> = {
  health: '生命',
  hunger: '饥饿',
  thirst: '口渴',
  wood: '木材',
  stone: '石头',
}

function getLogColor(type: LogEntry['type']): string {
  switch (type) {
    case 'good':
      return 'text-green-400'
    case 'bad':
      return 'text-red-400'
    case 'system':
      return 'text-purple-400'
    case 'event':
      return 'text-yellow-400'
    default:
      return 'text-gray-300'
  }
}

function getLogIcon(type: LogEntry['type']): string {
  switch (type) {
    case 'good':
      return '✨'
    case 'bad':
      return '⚠️'
    case 'system':
      return '📢'
    case 'event':
      return '🎲'
    default:
      return '▶️'
  }
}

function getSourceTag(source: LogEntry['source']): { label: string; class: string } {
  switch (source) {
    case 'player_action':
      return { label: '玩家行动', class: 'bg-blue-600/30 text-blue-300 border-blue-500/50' }
    case 'random_event':
      return { label: '随机事件', class: 'bg-amber-600/30 text-amber-300 border-amber-500/50' }
    case 'system':
      return { label: '系统', class: 'bg-purple-600/30 text-purple-300 border-purple-500/50' }
    default:
      return { label: '未知', class: 'bg-gray-600/30 text-gray-300 border-gray-500/50' }
  }
}

function getMetricClass(m: MetricChange): string {
  if (m.direction === 'increase') {
    if (m.metric === 'hunger' || m.metric === 'thirst') {
      return 'bg-red-900/40 text-red-300 border border-red-700/50'
    }
    return 'bg-green-900/40 text-green-300 border border-green-700/50'
  }
  if (m.direction === 'decrease') {
    if (m.metric === 'hunger' || m.metric === 'thirst') {
      return 'bg-green-900/40 text-green-300 border border-green-700/50'
    }
    return 'bg-red-900/40 text-red-300 border border-red-700/50'
  }
  return 'bg-gray-700/40 text-gray-300 border border-gray-600/50'
}

function getMetricArrow(m: MetricChange): string {
  if (m.direction === 'increase') {
    if (m.metric === 'hunger' || m.metric === 'thirst') {
      return '↑'
    }
    return '↑'
  }
  if (m.direction === 'decrease') {
    return '↓'
  }
  return '→'
}

function formatMetricValue(m: MetricChange): string {
  const absValue = Math.abs(m.value)
  const sign = m.value > 0 ? '+' : '-'
  return `${sign}${absValue}`
}

watch(
  () => props.logs.length,
  async () => {
    await nextTick()
    if (logContainer.value) {
      logContainer.value.scrollTop = 0
    }
  }
)
</script>

<template>
  <div class="bg-game-card rounded-2xl p-6 border border-game-border shadow-xl flex flex-col h-full">
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span>📜</span>
      <span>事件日志</span>
    </h2>
    <div
      ref="logContainer"
      class="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      style="max-height: 400px;"
    >
      <div
        v-for="log in logs"
        :key="log.id"
        :class="[getLogColor(log.type), 'animate-slide-up']"
        class="text-sm leading-relaxed bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
      >
        <div class="flex items-start gap-2 mb-2">
          <span class="flex-shrink-0 text-base">{{ getLogIcon(log.type) }}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span
                :class="[getSourceTag(log.source).class, 'text-xs px-2 py-0.5 rounded-full border font-medium']"
              >
                {{ getSourceTag(log.source).label }}
              </span>
              <span v-if="log.turn > 0" class="text-xs text-gray-500">
                回合 {{ log.turn }}
              </span>
            </div>
            <div>{{ log.text }}</div>
          </div>
        </div>

        <div v-if="log.metrics.length > 0" class="flex flex-wrap gap-1.5 ml-7">
          <span
            v-for="(m, idx) in log.metrics"
            :key="idx"
            :class="[getMetricClass(m), 'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-mono']"
          >
            <span class="font-medium">{{ statDisplayNames[m.metric] }}</span>
            <span>{{ getMetricArrow(m) }}</span>
            <span>{{ formatMetricValue(m) }}</span>
          </span>
        </div>
      </div>

      <div v-if="logs.length === 0" class="text-gray-500 text-sm text-center py-8">
        暂无日志...
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-500 space-y-1">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-blue-600/50 inline-block"></span>
          玩家行动
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-amber-600/50 inline-block"></span>
          随机事件
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-green-700/50 inline-block"></span>
          有利变化
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-red-700/50 inline-block"></span>
          不利变化
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #374151;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #4b5563;
}
</style>

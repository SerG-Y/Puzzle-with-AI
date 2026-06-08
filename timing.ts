import { State, RulesManhattanDistance, IDAStar } from './src/solver'
import { shuffle, solved } from './src/lib/board'
const rules = new RulesManhattanDistance(4, solved(4))
let max = 0, sum = 0
for (let t = 0; t < 12; t++) {
  const board = shuffle(4)
  const start = process.hrtime.bigint()
  const path = new IDAStar(rules).search(new State(board))
  const ms = Number(process.hrtime.bigint() - start) / 1e6
  max = Math.max(max, ms); sum += ms
  console.log(`4x4 #${t}: ${path ? path.length - 1 : '?'} moves, ${ms.toFixed(0)} ms`)
}
console.log(`avg=${(sum/12).toFixed(0)}ms  max=${max.toFixed(0)}ms`)

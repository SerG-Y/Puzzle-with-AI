<script lang="ts">
  import Tile from './Tile.svelte'
  import SizeToggle from './SizeToggle.svelte'
  import { State, RulesManhattanDistance, IDAStar, solved } from './solver'

  const TRAY = 468; // outer tray width (px)
  const PAD = 18; // tray inner padding
  const GAP = 12; // gap between tiles

  let size = $state(4);
  let board = $state<number[]>(scramble(4));
  let solving = $state(false);

  // One ruleset drives both the game mechanics (moves, win, shuffle) and the
  // solver -- no board logic lives outside src/solver.
  const rules = $derived(new RulesManhattanDistance(size, solved(size)));

  const won = $derived(rules.isTerminate(new State(board)));
  const total = $derived(size * size - 1);
  const tileSize = $derived((TRAY - PAD * 2 - GAP * (size - 1)) / size);
  const tiles = $derived(
    board.map((val, idx) => ({ val, idx })).filter((tile) => tile.val !== 0),
  );

  // Mix by walking the blank through random legal moves (so the board is always
  // solvable), avoiding immediate backtracking. Kept shallow so the optimal
  // solver stays fast -- deep shuffles produce near-worst-case boards.
  function scramble(n: number): number[] {
    const ruleset = new RulesManhattanDistance(n, solved(n));
    let current = new State(solved(n));
    let previous: string | null = null;
    const steps = Math.round(n * n * 2.5);
    for (let i = 0; i < steps; i++) {
      const options = ruleset.getNeighbors(current).filter((s) => s.hash !== previous);
      previous = current.hash;
      current = options[Math.floor(Math.random() * options.length)];
    }
    return ruleset.isTerminate(current) ? scramble(n) : [...current.field];
  }

  function move(val: number): void {
    if (solving || won) return;
    const blank = board.indexOf(0);
    // The legal neighbour (if any) that slides this tile into the blank.
    const next = rules.getNeighbors(new State(board)).find((s) => s.field[blank] === val);
    if (next) board = [...next.field];
  }

  function reset(): void {
    if (solving) return;
    board = scramble(size);
  }

  function changeSize(newSize: number): void {
    if (solving) return;
    size = newSize;
    board = scramble(newSize);
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async function solve(): Promise<void> {
    if (solving || won) return;

    const path = new IDAStar(rules).search(new State(board.slice()));
    if (path === null) {
      console.log('Solution not found');
      return;
    }

    solving = true;
    // Replay the optimal path one move at a time; tile transitions animate it.
    for (let i = 1; i < path.length; i++) {
      await delay(280);
      board = [...path[i].field];
    }
    solving = false;
  }
</script>

<main class="wrap">
  <header class="head">
    <div class="logo">
      <span class="logo-tiles" aria-hidden="true">
        <i style="background:#ff7a9c"></i>
        <i style="background:#ffc24b"></i>
        <i style="background:#4fc7a1"></i>
        <i style="background:#6aa9ff"></i>
      </span>
      <span class="logo-word">slide</span>
    </div>
    <p class="tag">put the numbers back in order</p>
  </header>

  <div class="board-stage">
    <div
      class="tray"
      style="width:{TRAY}px; height:{TRAY}px; padding:{PAD}px; border-radius:{TRAY * 0.07}px;"
    >
      {#each tiles as tile (tile.val)}
        <Tile val={tile.val} idx={tile.idx} {size} {tileSize} {total} {won} onmove={move} />
      {/each}
    </div>
    <div class="win-badge" class:show={won}>solved! ✨</div>
  </div>

  <div class="controls">
    <div class="btn-row">
      <button class="btn btn-solve" onclick={solve} disabled={solving || won}>Solve</button>
      <button class="btn btn-reset" onclick={reset} disabled={solving}>Shuffle</button>
    </div>
    <SizeToggle {size} onchange={changeSize} />
  </div>
</main>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
  }

  /* header */
  .head {
    text-align: center;
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .logo-tiles {
    display: grid;
    grid-template-columns: repeat(2, 13px);
    grid-gap: 3px;
    transform: rotate(-8deg);
  }
  .logo-tiles i {
    width: 13px;
    height: 13px;
    border-radius: 4px;
    display: block;
  }
  .logo-word {
    font-size: 38px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #2b2440;
  }
  .tag {
    margin-top: 6px;
    font-size: 16px;
    font-weight: 500;
    color: #8b83a8;
  }

  /* board */
  .board-stage {
    position: relative;
  }
  .tray {
    position: relative;
    background:
      repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.5) 0 14px, rgba(255, 255, 255, 0.34) 14px 28px),
      #efe7f7;
    box-shadow:
      inset 0 4px 14px rgba(43, 36, 64, 0.14),
      inset 0 -2px 0 rgba(255, 255, 255, 0.7),
      0 24px 50px -18px rgba(43, 36, 64, 0.4);
    border: 3px solid #fff;
  }

  /* win badge */
  .win-badge {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.6) rotate(-4deg);
    background: #fff;
    color: #2b2440;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
    padding: 16px 30px;
    border-radius: 999px;
    box-shadow:
      0 14px 34px -8px rgba(43, 36, 64, 0.5),
      inset 0 0 0 3px #ffd36e;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.3s ease,
      transform 0.45s cubic-bezier(0.34, 1.8, 0.5, 1);
    z-index: 5;
  }
  .win-badge.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-4deg);
  }

  /* controls */
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }
  .btn-row {
    display: flex;
    gap: 14px;
  }
  .btn {
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #fff;
    padding: 14px 32px;
    border-radius: 16px;
    transition:
      transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.12s ease,
      filter 0.12s ease;
  }
  .btn:hover {
    transform: translateY(-3px);
  }
  .btn:active {
    transform: translateY(3px);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    filter: saturate(0.7);
  }
  .btn:focus-visible {
    outline: 3px solid #2b2440;
    outline-offset: 3px;
  }
  .btn-solve {
    background: linear-gradient(160deg, #6be3a8, #34c47e);
    box-shadow: 0 7px 0 #1f9a5e, 0 12px 20px -8px rgba(52, 196, 126, 0.6);
  }
  .btn-solve:active {
    box-shadow: 0 3px 0 #1f9a5e, 0 6px 12px -8px rgba(52, 196, 126, 0.6);
  }
  .btn-reset {
    background: linear-gradient(160deg, #ffb27a, #ff8a5b);
    box-shadow: 0 7px 0 #d9622f, 0 12px 20px -8px rgba(255, 138, 91, 0.6);
  }
  .btn-reset:active {
    box-shadow: 0 3px 0 #d9622f, 0 6px 12px -8px rgba(255, 138, 91, 0.6);
  }
</style>

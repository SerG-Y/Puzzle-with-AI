<script lang="ts">
  const GAP = 12;

  interface Props {
    val: number;
    idx: number;
    size: number;
    tileSize: number;
    total: number;
    won: boolean;
    onmove: (val: number) => void;
  }
  let { val, idx, size, tileSize, total, won, onmove }: Props = $props();

  const row = $derived(Math.floor(idx / size));
  const col = $derived(idx % size);
  const x = $derived(col * (tileSize + GAP));
  const y = $derived(row * (tileSize + GAP));
  const home = $derived(val - 1 === idx);

  // Rainbow colour from a tile's home number: red -> magenta.
  const hue = $derived(((val - 1) / Math.max(1, total - 1)) * 300);
</script>

<div class="tile" style="width:{tileSize}px; height:{tileSize}px; transform: translate({x}px, {y}px);">
  <button
    class="tile-btn"
    class:won
    style="
      border-radius:{tileSize * 0.18}px;
      font-size:{tileSize * 0.42}px;
      background: linear-gradient(160deg, hsl({hue} 85% 70%), hsl({hue} 80% 63%));
      box-shadow: 0 {tileSize * 0.085}px 0 hsl({hue} 68% 44%), 0 {tileSize * 0.085 + 6}px 14px rgba(43, 36, 64, .18);
      --delay: {(col + row) * 0.05}s;
    "
    onclick={() => onmove(val)}
  >
    {val}
    {#if home && !won}<span class="home-dot"></span>{/if}
  </button>
</div>

<style>
  .tile {
    position: absolute;
    transition: transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 2;
  }
  .tile-btn {
    width: 100%;
    height: 100%;
    position: relative;
    border: none;
    cursor: pointer;
    color: #fff;
    font-family: inherit;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.12s ease;
  }
  .tile-btn:hover {
    transform: translateY(-3px);
    filter: saturate(1.08) brightness(1.03);
  }
  .tile-btn:active {
    transform: translateY(4px);
    filter: brightness(0.98);
  }
  .tile-btn:focus-visible {
    outline: 3px solid #2b2440;
    outline-offset: 3px;
  }
  .tile-btn.won {
    animation: winwave 0.6s ease var(--delay) both;
  }
  .home-dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
  }
  @keyframes winwave {
    0% {
      transform: translateY(0) scale(1);
    }
    40% {
      transform: translateY(-16px) scale(1.06);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }
</style>

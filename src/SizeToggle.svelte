<script lang="ts">
  interface Props {
    size: number;
    onchange: (size: number) => void;
  }
  let { size, onchange }: Props = $props();

  const options = [3, 4];
</script>

<div class="seg" role="tablist" aria-label="Board size">
  <div class="seg-thumb" style="transform: translateX({options.indexOf(size) * 100}%);"></div>
  {#each options as s (s)}
    <button
      type="button"
      role="tab"
      aria-selected={size === s}
      class="seg-opt"
      class:on={size === s}
      onclick={() => onchange(s)}
    >
      {s}×{s}
    </button>
  {/each}
</div>

<style>
  .seg {
    position: relative;
    display: flex;
    background: #efe7f7;
    border-radius: 14px;
    padding: 5px;
    box-shadow: inset 0 2px 6px rgba(43, 36, 64, 0.14);
  }
  .seg-thumb {
    position: absolute;
    top: 5px;
    left: 5px;
    width: calc(50% - 5px);
    height: calc(100% - 10px);
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 8px -2px rgba(43, 36, 64, 0.3);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .seg-opt {
    position: relative;
    z-index: 1;
    background: none;
    border: none;
    cursor: pointer;
    padding: 9px 26px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 600;
    color: #8b83a8;
    transition: color 0.2s ease;
  }
  .seg-opt.on {
    color: #2b2440;
  }
  .seg-opt:focus-visible {
    outline: 3px solid #2b2440;
    outline-offset: 3px;
    border-radius: 8px;
  }
</style>

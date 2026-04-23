<script>
  import { bloomData, bloomMap } from '../data/bloomData.js'

  export let showFilters = false

  const cols = ['Early', 'Early–Mid', 'Mid', 'Mid–Late', 'Late']

  // March covers cols 0-1, April col 2, May cols 3-4
  const months = [
    { label: 'March', span: 2 },
    { label: 'April', span: 1 },
    { label: 'May',   span: 2 },
  ]

  const allRows = bloomData.map(d => {
    const { start, end } = bloomMap[d.bloom]
    return { name: d.type.replace(/^Tulip\s+/i, ''), type: d.type, bloom: d.bloom, hex: d.hex, start, end }
  }).sort((a, b) => a.start - b.start || a.end - b.end)

  const types = ['All', ...allRows.map(r => r.type)]

  let activeFilter = 'All'

  $: filtered = activeFilter === 'All'
    ? allRows
    : allRows.filter(r => r.type === activeFilter)

  /** @param {number} col @param {number} start @param {number} end */
  function segClass(col, start, end) {
    if (col < start || col > end) return ''
    if (start === end)            return 'only'
    if (col === start)            return 'bar start'
    if (col === end)              return 'bar end'
    return 'bar mid'
  }
</script>

<div class="chart">
  <div class="month-headers">
    <div class="name-col"></div>
    {#each months as m}
      <div class="month-label" style="grid-column: span {m.span}">{m.label}</div>
    {/each}
  </div>

  <div class="col-headers">
    <div class="name-col"></div>
    {#each cols as col}
      <div class="col-label">{col}</div>
    {/each}
  </div>

  {#each filtered as row}
    <div class="row">
      <span class="name">{row.name}</span>
      {#each cols as _col, ci}
        {@const seg = segClass(ci, row.start, row.end)}
        <span class="cell {seg}"></span>
      {/each}
    </div>
  {/each}
</div>

<style>

  .chart {
    width: 100%;
    font-family: var(--sans);
  }

  .month-headers,
  .col-headers {
    display: grid;
    grid-template-columns: 160px repeat(5, 1fr);
  }

  .month-headers { margin-bottom: 2px; }
  .col-headers   { margin-bottom: 4px; }

  .month-label {
    font-size: var(--14px);
    letter-spacing: .08em;
    text-transform: uppercase;
    opacity: 0.85;
    text-align: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 3px;
    font-weight: bold;
  }

  .col-label {
    font-size: var(--12px);
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text);
    opacity: 1;
    text-align: center;
  }

  .row {
    display: grid;
    grid-template-columns: 160px repeat(5, 1fr);
    align-items: center;
    width: 100%;
    padding: 2px 0;
    position: relative;
  }

  .row::after {
    content: '';
    position: absolute;
    left: 160px;
    right: 0;
    top: 50%;
    height: 0.5px;
    background: var(--border);
    pointer-events: none;
  }

  .name {
    font-size: 16px;
    color: var(--text-h);
    padding-right: 8px;
    font-family: var(--sans);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .cell {
    height: 14px;
    display: block;
    position: relative;
    z-index: 1;
  }

  .cell.bar, .cell.only, .cell.start, .cell.end { background: #b5cc18; }
  .cell.only  { border-radius: 4px; }
  .cell.start { border-radius: 4px 0 0 4px; }
  .cell.end   { border-radius: 0 4px 4px 0; }

  @media (max-width: 600px) {
    .month-headers,
    .col-headers,
    .row { grid-template-columns: 90px repeat(5, 1fr); }
    .row::after { left: 100px; }
    .name { font-size: var(--12px); padding-right: 0; }
    .col-label { font-size: var(--10px); letter-spacing: 0; white-space: normal; text-align: center; line-height: 1.2; }
    .month-label { font-size: var(--12px); }
  }
</style>

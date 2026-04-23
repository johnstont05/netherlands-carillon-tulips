<script>
  import { onMount } from 'svelte';

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXkNu5YmjCT9JYhlPoXDSu06vHGo_gY4MDLS6e3VdTsA12cyiFRa-60141tvjYj-a0CViA5msg-N6M/pub?output=csv';
  const PAGE_SIZE = 15;

  let rows = [];
  let headers = [];
  let imgIndex = -1;
  let urlIndex = -1;
  let sourceIndex = -1;
  let typeIndex = -1;
  let libraryBedIndex = -1;
  let loading = true;
  let error = null;

  const HIDDEN_COLS = new Set(['bed-ring', 'color', 'url']);

  let currentPage = 0;
  let sortCol = -1;
  let sortAsc = true;

  function sortBy(i) {
    if (sortCol === i) { sortAsc = !sortAsc; }
    else { sortCol = i; sortAsc = true; }
    currentPage = 0;
  }

  onMount(async () => {
    try {
      const res = await fetch(SHEET_URL);
      if (!res.ok) throw new Error(`Sheet fetch failed (${res.status})`);
      const text = await res.text();
      const lines = text.trim().split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      headers = lines[0];
      imgIndex         = headers.indexOf('img');
      urlIndex         = headers.indexOf('url');
      sourceIndex      = headers.indexOf('source');
      typeIndex        = headers.indexOf('Species');
      libraryBedIndex  = headers.indexOf('Bed');
      rows = lines.slice(1);
      sortCol = libraryBedIndex;
      sortAsc = true;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function bedCompare(a, b) {
    const na = parseInt(a), nb = parseInt(b);
    const aNum = !isNaN(na), bNum = !isNaN(nb);
    if (aNum && bNum) return na - nb;
    if (aNum) return -1;
    if (bNum) return 1;
    return a.localeCompare(b);
  }

  $: sortedRows = sortCol < 0 ? rows : [...rows].sort((a, b) => {
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    const cmp = sortCol === libraryBedIndex
      ? bedCompare(av, bv)
      : av.toLowerCase().localeCompare(bv.toLowerCase());
    return sortAsc ? cmp : -cmp;
  });
  $: totalPages = Math.ceil(sortedRows.length / PAGE_SIZE);
  $: visibleRows = sortedRows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  function prev() { if (currentPage > 0) currentPage -= 1; }
  function next() { if (currentPage < totalPages - 1) currentPage += 1; }

  $: visibleHeaders = [
    ...headers
      .map((h, i) => ({ h, i }))
      .filter(({ h, i }) => i !== imgIndex && !HIDDEN_COLS.has(h)),
    ...(imgIndex >= 0 ? [{ h: 'img', i: imgIndex }] : []),
  ];
</script>

{#if loading}
  <p class="status">Loading…</p>
{:else if error}
  <p class="status error">{error}</p>
{:else}
  <div class="table-outer">
    {#if totalPages > 1}
      <div class="pagination">
        <button class="page-arrow" on:click={prev} disabled={currentPage === 0} aria-label="Previous page">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="page-info">Page {currentPage + 1} of {totalPages}</span>
        <button class="page-arrow" on:click={next} disabled={currentPage === totalPages - 1} aria-label="Next page">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    {/if}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            {#each visibleHeaders as { h, i }}
              {#if h === 'img'}
                <th></th>
              {:else if h === 'Name' || i === typeIndex || i === libraryBedIndex}
                <th class="sortable" class:active={sortCol === i} class:bed-col={i === libraryBedIndex} on:click={() => sortBy(i)}>
                  {h}
                  {#if sortCol === i}
                    <span class="sort-arrow active-arrow">{sortAsc ? '▲' : '▼'}</span>
                  {:else if i === libraryBedIndex}
                    <span class="sort-arrow">▲</span>
                  {/if}
                </th>
              {:else if i === sourceIndex}
                <th class="source-cell">{h}</th>
              {:else}
                <th>{h}</th>
              {/if}
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each visibleRows as row}
            {@const url = urlIndex >= 0 ? row[urlIndex] : ''}
            <tr>
              {#each visibleHeaders as { i }}
                {#if i === imgIndex}
                  <td class="img-cell">
                    {#if row[i]}
                      <img src="{import.meta.env.BASE_URL}images/{row[i]}" alt={row[i]} class="tulip-thumb" />
                    {/if}
                  </td>
                {:else if i === sourceIndex}
                  <td class="source-cell">
                    {#if url}
                      <a href={url} target="_blank" rel="noreferrer">{row[i]}</a>
                    {:else}
                      {row[i]}
                    {/if}
                  </td>
                {:else}
                  <td class:bed-col={i === libraryBedIndex}>{row[i]}</td>
                {/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

  </div>
{/if}


<style>
  .table-outer {
    width: 100%;
    margin: 0 auto;
    font-family: var(--sans);
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    table-layout: auto;
  }

  th, td {
    /* padding: 0.5rem 0.75rem; */
    border-bottom: 1px solid #c7c7c7;
    text-align: left;
    vertical-align: middle;
    color: var(--text-h);
    white-space: nowrap;
  }

  th {
    font-size: var(--14px);
    font-weight: 600;
    color: var(--text);
    border-bottom: 2px solid #676767;
  }

  th.sortable {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }



  th.sortable:hover { opacity: 1; }
  th.active { opacity: 1; }

  .sort-arrow {
    margin-left: 4px;
    font-style: normal;
    display: inline-block;
    color: #000;
    transition: transform 0.15s, color 0.15s;
  }

  .active-arrow { color: var(--text-h, #000); }

  .source-cell { text-align: right; }


  a {
    color: var(--text-h);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 0.25rem 0.6rem;
  }

  .page-info {
    font-size: var(--12px);
    color: var(--text);
    min-width: 80px;
    text-align: center;
  }

  .page-arrow {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-h);
    padding: 4px 6px;
    border-radius: 3px;
    font-size: 11px;
    line-height: 1;
    display: flex;
    align-items: center;
    border: 1px solid black
  }



  .page-arrow:disabled {
    opacity: 0.25;
    cursor: default;
  }

  @media (max-width: 768px) {
    table { font-size: 13px; }
    th { font-size: 12px; }
    td, th { padding: 0.4rem 0.35rem; }
    .img-cell, .source-cell { display: none; }
    .bed-col { text-align: center; }
  }
</style>

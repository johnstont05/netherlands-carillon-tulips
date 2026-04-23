<script>
  const { methodology } = $props()

  const headline = $derived(methodology?.headline ?? methodology?.title)

  const PREVIEW_COUNT = 3

  let open = $state(false)

  const blocks = $derived(
    Array.isArray(methodology?.text) ? methodology.text : methodology?.text ? [{ type: 'text', value: methodology.text }] : []
  )
  const preview = $derived(blocks.slice(0, PREVIEW_COUNT))
  const rest = $derived(blocks.slice(PREVIEW_COUNT))
</script>

<section class="methodology-container">
  {#if headline}<div class="toggle-label">{headline}</div>{/if}

  <div class="content">
    {#each preview as block, i (i)}
      {#if block.type === 'text' || !block.type}
        <p>{@html block.value ?? block}</p>
      {:else if block.type === 'bulleted-list'}
        <ul>
          {#each block.value.list as item, j (j)}
            <li>{@html item.value}</li>
          {/each}
        </ul>
      {/if}
    {/each}

    {#if rest.length > 0}
      {#if open}
        {#each rest as block, i (i)}
          {#if block.type === 'text' || !block.type}
            <p>{@html block.value ?? block}</p>
          {:else if block.type === 'bulleted-list'}
            <ul>
              {#each block.value.list as item, j (j)}
                <li>{@html item.value}</li>
              {/each}
            </ul>
          {/if}
        {/each}
      {:else}
        <button class="read-more" onclick={() => open = true}>Read more ▾</button>
      {/if}
      {#if open}
        <button class="read-more read-less" onclick={() => open = false}>Read less <span class="caret">▾</span></button>
      {/if}
    {/if}
  </div>
</section>

<style>
  .methodology-container {
    max-width: 640px;
    width: 100%;
    margin: 2rem auto;
    border-top: 2px solid var(--border);
    font-size: var(--14px);
    color: var(--text);
    text-align: left;
  }

  .toggle-label {
    font-size: var(--22px);
    font-weight: 600;
    color: var(--text-h);
    padding: 1.25rem 0;
    display: block;
  }

  .content {
    padding-bottom: 1.25rem;
  }

  .read-more {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--sans);
    font-size: var(--14px);
    color: var(--text-h);
    font-weight: 600;
    padding: 0.25rem 0;
    text-decoration: underline;
    text-decoration-color: #b5cc18;
    text-underline-offset: 3px;
  }

  .read-less {
    display: block;
    margin-top: 0.5rem;
  }

  .read-less .caret {
    display: inline-block;
    transform: rotate(180deg);
  }

  .read-more:hover {
    text-decoration-color: #000;
  }

  p {
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul {
    margin: 0 0 0.75rem 1.25rem;
    padding: 0;
    list-style-type: disc;
  }

  li {
    margin-bottom: 0.4rem;
    line-height: 1.5;
  }

  .methodology-container :global(a) {
    color: #000;
    text-decoration: underline;
    text-decoration-color: #b5cc18;
    text-underline-offset: 3px;
  }

  .methodology-container :global(a:hover) {
    color: #000;
    text-decoration-color: #000;
  }

  @media (max-width: 768px) {
    .methodology-container { font-size: var(--14px); }
    .toggle-label { font-size: var(--22px); }
    p { line-height: 1.3; }
  }
</style>

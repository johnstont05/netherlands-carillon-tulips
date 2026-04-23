<script>
  export let illustration = null; // path to image, e.g. '/images/tulip.png'
  export let title = '';
  export let description = '';
  export let byline = '';
  export let date = '';
</script>

<header>
  <div class="illustration">
    {#if illustration}
      <img src="{import.meta.env.BASE_URL}{illustration}" alt="Illustration of three tulips" />
    {:else}
      <div class="illustration-placeholder"></div>
    {/if}
  </div>

  {#if title}
    <h1>{title}</h1>
  {/if}

  {#if description}
    <p class="description">{description}</p>
  {/if}

  {#if byline || date}
    <p class="byline">
      {#if byline}<span class="by">{@html byline}</span>{/if}
      {#if byline && date}<span class="sep"> | </span>{/if}
      {#if date}<time>{date}</time>{/if}
    </p>
  {/if}
</header>

<style>
  header {
    position: relative;
    z-index: 2;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .illustration {
    margin-bottom: 2rem;
    margin: auto;
        margin-bottom: 1.5rem;

  }

  .illustration img {
    height: 80px;
    width: auto;
    display: block;
  }

  @media (max-width: 768px) {
    .illustration img { height: 40px; }
    .description {
      font-size: var(--18px);
    }
  }

  .illustration-placeholder {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    border: 2px dashed var(--border);
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2rem, 6vw, var(--64px));
    font-optical-sizing: auto;
    line-height: 1.15;
    color: var(--text-h);
    font-family: var(--serif);
    font-weight: bold;
    max-width: 100%;
    text-wrap: balance;
    margin-bottom: 1.5rem;
  }

  .description {
    margin: 0 0 1rem;
    font-size: clamp(1rem, 2.5vw, var(--24px));
    line-height: 1.3;
    color: var(--text);
    max-width: 100%;
  }

  .byline {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text);
    margin-bottom: 2rem;
    text-align: center;
  }

  .by {
    font-weight: 600;
  }

  .sep {
    opacity: 0.4;
  }

  time {
    opacity: 0.7;
  }
</style>

<script>
  export let hed = ""
  export let description = ""
  export let note = ""
  export let credits = ""
  export let width = "text-width"
  export let altText = ""


  function addSpaceBeforeLinks(html) {
    if (!html) return html
    return html.replace(/([^\s])(<a\s)/gi, "$1 $2")
  }

  $: processedCredits = addSpaceBeforeLinks(credits)
</script>

<figure class="custom-graphic {width}" aria-label={altText}>
  <div class="headline-wrapper">
    {#if hed}
      <h3 class="headline">{hed}</h3>
    {/if}
    {#if description}
      <p class="description">{@html description}</p>
    {/if}
  </div>

  <div class="visualization-container">
    <slot />
  </div>

  {#if note || credits}
    <figcaption class="caption-wrapper">
      {#if note}
        <p class="note">{@html note}</p>
      {/if}
      {#if credits}
        <p class="credit">{@html processedCredits}</p>
      {/if}
    </figcaption>
  {/if}
</figure>

<style>
  .custom-graphic {
    width: 100%;
    margin: 1,5rem 0;
  }

  .headline-wrapper {
    margin-bottom: 1rem;
  }

  .headline {
    font-size: var(--22px);
    color: var(--text-h);
    margin: 0 0 0.25rem;
    text-align: left;
  }

  @media (max-width: 768px) {
    .headline { font-size: 20px; }
  }

  .description {
    font-size: 16px;
    color: var(--text);
    font-family: var(--sans);
    margin: 0;
    text-align: left;
    line-height: 1.3;

  }

  .visualization-container {
    margin-bottom: 0.5rem;
  }

  .caption-wrapper {
    font-size: 0.875rem;
  }

  .note {
    font-size: 0.875rem;
    color: var(--text);
    font-family: var(--sans);
    text-align: left;
  }

  .credit {
    font-size: 0.75rem;
    color: #828282;
    font-family: var(--sans);
    margin: 0;
    text-align: left;
  }

  .credit :global(a) {
    color: #828282;
    text-decoration: underline;
    text-underline-offset: 1px;
    text-align: left;
  }

  /* Width options */
  .float-left {
    float: left;
    width: 320px;
    margin-right: 1.5rem;
    margin-left: -10rem;
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .float-right {
    float: right;
    width: 320px;
    margin-right: -10rem;
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .text-width {
    width: 100%;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }

  .large {
    width: 928px;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .wide {
    width: 1200px;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .full {
    width: 100vw;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 768px) {
    .float-left,
    .float-right,
    .large,
    .wide {
      width: 100% !important;
      float: none;
      margin-left: 0;
      margin-right: 0;
      transform: none;
      left: auto;
    }
  }
</style>

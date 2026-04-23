<script>
  // @ts-nocheck
  import Table from './components/Table.svelte'
  import Hero from './components/Hero.svelte'
  import TulipMap from './components/TulipMap.svelte'
  import Photo from './components/Photo.svelte'
  import CustomGraphic from './components/CustomGraphic.svelte'
  import Locator from './components/Locator.svelte'
  import BloomChart from './components/BloomChart.svelte'
  import Subhed from './components/Subhed.svelte'
  import Methodology from './components/Methodology.svelte'
  import TulipBanner from './components/TulipBanner.svelte'
  import contentData from './data/content.json'

  const content = contentData.content ?? [];
  const heroBlock = content.find(b => b.type === 'hero')?.value;
  const bodyContent = content.filter(b => b.type !== 'hero');

  function exportSVG() {
    const svg = document.querySelector('svg');
    if (!svg) return;
    const blob = new Blob(
      ['<?xml version="1.0" encoding="UTF-8"?>', svg.outerHTML],
      { type: 'image/svg+xml' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'circle-bed.svg';
    a.click();
    URL.revokeObjectURL(a.href);
  }
</script>

{#if heroBlock}
  <Hero
    title={heroBlock.title}
    description={heroBlock.description}
    byline={heroBlock.byline}
    date={heroBlock.date}
    illustration={heroBlock.illustration}
  />
{/if}

<main>
  {#each bodyContent as block}
    {#if block.type === 'ai2html'}
      {@const g = block.value}
      <CustomGraphic
        hed={g.hed}
        description={g.description}
        note={g.note}
        credits={g.credits}
        width={g.width || 'text-width'}
        altText={g.altText ?? ''}
      ><Locator /></CustomGraphic>

    {:else if block.type === 'tulipmap'}
      {@const g = block.value ?? {}}
      <CustomGraphic
        hed={g.hed}
        description={g.description}
        note={g.note}
        credits={g.credits}
        width={g.width || 'text-width'}
        altText={g.altText ?? ''}
      ><TulipMap /></CustomGraphic>

    {:else if block.type === 'blooms'}
      <BloomChart />
    {:else if block.type === 'table'}
      {@const g = block.value ?? {}}
      <CustomGraphic
        hed={g.headline ?? g.hed}
        description={g.description}
        note={g.note}
        credits={g.credits}
        width={g.width || 'text-width'}
        altText={g.altText ?? ''}
      ><Table /></CustomGraphic>

    {:else if block.type === 'subhed'}
      <Subhed text={block.value?.text ?? block.value} />

    {:else if block.type === 'photo'}
      {@const p = block.value}
      <Photo
        url={p.url}
        altText={p.altText ?? ''}
        caption={p.caption}
        credit={p.credit}
        width={p.width || 'text-width'}
      />

    {:else if block.type === 'bloomchart'}
      {@const g = block.value}
      <CustomGraphic
        hed={g.headline ?? g.hed}
        description={g.description}
        note={g.note}
        credits={g.credits}
        width={g.width || 'text-width'}
        altText={g.altText ?? ''}
      ><BloomChart /></CustomGraphic>

    {:else if block.type === 'methodology'}
      <Methodology methodology={block.value} />

    {:else if block.type === 'text' && block.value}
      <p class="prose">{@html block.value}</p>

    {/if}
  {/each}
</main>

<footer>
  <TulipBanner />
</footer>

<style>
  :global(body) {
    overflow-x: clip;
    background-color: #f5efeb;
  }

  footer {
    width: 100%;
    margin-top: 2rem;
  }

  :global(header) {
    padding: 2rem 2rem 0;
    box-sizing: border-box;
  }

  main {
    display: block;
    max-width: 780px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .prose {
    max-width: 640px;
    width: 100%;
    margin: 0 auto 1.25rem;
    line-height: 1.4;
    font-size: var(--18px);
    text-align: left;
    font-family: var(--sans);
  }

  @media (max-width: 768px) {
    .prose { font-size: 16px;
    line-height: 1.3; }
  }

</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
</svelte:head>

<script>
  import { bedsById } from '../data/beds.js';

  // Clockwise bed-ID ordering per ring, read from the physical garden map.
  // Middle ring: 16 confirmed positions — verify the 17th with the garden map.
  const OUTER_IDS  = ['19','20','21','22','23','24','25','26','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'];
  const MIDDLE_IDS = ['39','40','41','42','27','28','29','30','31','32','33','34','35','36','37','38'];
  const INNER_IDS  = ['47','48','43','44','45','46'];
  const CENTER_ID  = '49';

  function bedFor(id) { return bedsById[id] ?? { id, name: '?', colors: ['#ccc'], hex: '#ccc' }; }

  const cx = 210, cy = 210;
  const ringGroups = [
    { rIn: 148, rOut: 205, beds: OUTER_IDS.map(bedFor),  label: `Outer ring · ${OUTER_IDS.length} beds`,  stripId: 'outer' },
    { rIn:  92, rOut: 142, beds: MIDDLE_IDS.map(bedFor), label: `Middle ring · ${MIDDLE_IDS.length} beds`, stripId: 'mid'   },
    { rIn:  48, rOut:  86, beds: INNER_IDS.map(bedFor),  label: `Inner ring · ${INNER_IDS.length} beds`,   stripId: 'inner', angles: [50, 80, 50, 50, 80, 50] },
  ];
  const centerBed = bedFor(CENTER_ID);

  // colorPicks: { [bed.id]: 0 | 1 | 2 } — index into bed.colors
  let colorPicks = (() => {
    try { return JSON.parse(localStorage.getItem('tulip-color-picks') ?? '{}'); } catch { return {}; }
  })();

  function getHex(bed) {
    return bed.colors[colorPicks[bed.id] ?? 0] ?? bed.hex;
  }

  function getFill(bed) {
    return bed.id === '45' ? 'url(#hatch)' : getHex(bed);
  }


  let selectedBed = bedFor('1');
  let selectedId = '1';



  function toXY(r, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function arcPath(rIn, rOut, a0, a1) {
    const [x1, y1] = toXY(rOut, a0);
    const [x2, y2] = toXY(rOut, a1);
    const [x3, y3] = toXY(rIn,  a1);
    const [x4, y4] = toXY(rIn,  a0);
    const lg = a1 - a0 > 180 ? 1 : 0;
    return `M${x1},${y1} A${rOut},${rOut} 0 ${lg},1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 ${lg},0 ${x4},${y4}Z`;
  }

  // Rotate so bed 1 (index 8 of 26) sits at the top
  const RING_ROTATION = -(8.5 * (360 / OUTER_IDS.length));

  function selectBed(bed) {
    selectedBed = bed;
    selectedId = bed.id;
  }

</script>

<svg width="0" height="0" style="position:absolute">
  <defs>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#c4c4c4"/>
      <line x1="0" y1="0" x2="0" y2="6" stroke="#fff" stroke-width="3"/>
    </pattern>
  </defs>
</svg>

<div class="page">

  <!-- Hero ring -->
     <!-- <div class="text"><i class="fa-regular fa-hand-pointer"></i> Use the diagram below to explore the tulip beds. The beds are numbered starting from the front of the tower, running clockwise.</div> -->

  <div class="hero-ring">
    <svg viewBox="-40 0 500 430" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="bed1-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#333" />
        </marker>
      </defs>
      <g transform="rotate({RING_ROTATION}, {cx}, {cy})">
        <!-- Pass 1: fills only -->
        {#each ringGroups as ring}
          {#each ring.beds as bed, i}
            {@const n = ring.beds.length}
            {@const a0 = ring.angles ? ring.angles.slice(0, i).reduce((s, v) => s + v, 0) : i * (360 / n)}
            {@const a1 = ring.angles ? a0 + ring.angles[i] : (i + 1) * (360 / n)}
            <path
              d={arcPath(ring.rIn, ring.rOut, a0, a1)}
              fill={getFill(bed)}
              stroke="none"
              style="cursor:pointer"
              on:click={() => selectBed(bed)}
            />
          {/each}
        {/each}
        <circle cx={cx} cy={cy} r="38" fill={getHex(centerBed)} stroke="none"
          role="button" tabindex="0"
          style="cursor:pointer"
          on:click={() => selectBed(centerBed)}
          on:keydown={e => e.key === 'Enter' && selectBed(centerBed)}
        />

        <!-- Pass 2a: white strokes (non-selected) -->
        {#each ringGroups as ring}
          {#each ring.beds as bed, i}
            {#if bed.id !== selectedId}
              {@const n = ring.beds.length}
              {@const a0 = ring.angles ? ring.angles.slice(0, i).reduce((s, v) => s + v, 0) : i * (360 / n)}
              {@const a1 = ring.angles ? a0 + ring.angles[i] : (i + 1) * (360 / n)}
              <path d={arcPath(ring.rIn, ring.rOut, a0, a1)} fill="none" stroke="#f5efeb" stroke-width="2" pointer-events="none" />
            {/if}
          {/each}
        {/each}
        {#if selectedId !== centerBed.id}
          <circle cx={cx} cy={cy} r="38" fill="none" stroke="#f5efeb" stroke-width="2" pointer-events="none" />
        {/if}

        <!-- Pass 2b: black stroke for selected segment, rendered last so it's always on top -->
        {#each ringGroups as ring}
          {#each ring.beds as bed, i}
            {#if bed.id === selectedId}
              {@const n = ring.beds.length}
              {@const a0 = ring.angles ? ring.angles.slice(0, i).reduce((s, v) => s + v, 0) : i * (360 / n)}
              {@const a1 = ring.angles ? a0 + ring.angles[i] : (i + 1) * (360 / n)}
              <path d={arcPath(ring.rIn, ring.rOut, a0, a1)} fill="none" stroke="black" stroke-width="3" pointer-events="none" />
            {/if}
          {/each}
        {/each}
        {#if selectedId === centerBed.id}
          <circle cx={cx} cy={cy} r="38" fill="none" stroke="black" stroke-width="3" pointer-events="none" />
        {/if}
      </g>
    </svg>
  </div>

  <!-- Selected bed banner -->
  {#if selectedBed}
    <div class="bed-banner">
      {#if selectedBed.img}
        <div class="bb-img-wrap">
          <img
            class="bb-img"
            class:no-source={!selectedBed.sourceName}
            src="{import.meta.env.BASE_URL}images/{selectedBed.img}"
            alt={selectedBed.name}
          />
          {#if selectedBed.sourceName}
            <a
              class="bb-source"
              href={selectedBed.sourceUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
            >Photo by {selectedBed.sourceName}</a>
          {/if}
        </div>
      {/if}
      <div class="bb-info">
        <p class="bb-label">Bed {selectedBed.id}</p>
        <p class="bb-name">{selectedBed.name}</p>
        {#if selectedBed.type}
          <p class="bb-meta"><span class="bb-meta-key">Species:</span> {selectedBed.type}</p>
          <p class="bb-meta"><span class="bb-meta-key">Bloom time:</span> {selectedBed.bloom}</p>
        {/if}
      </div>
    </div>
  {/if}


</div>

<style>
  .page {
    font-family: var(--sans);
    max-width: 780px;
    width: 100%;
  }

  .hero-ring {
    display: flex;
    justify-content: center;
    margin-bottom: .75rem;
  }

  .hero-ring svg {
    width: 100%;
    max-width: 800px;
    height: auto;
  }

  .hero-ring :global(*:focus) {
    outline: none;
  }

  .bed-banner {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1rem 1rem 0rem 1rem;
    background: #fff;
    border: 1px solid #000;
    border-radius: 5px;
    max-width: 400px;
    margin: 0 auto 0.5rem;
  }

  .bb-img-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
  }

  .bb-img {
    width: 140px;
    height: 140px;
    object-fit: cover;
  }

  .bb-img.no-source {
    margin-bottom: 0.5rem;
  }

  .bb-source {
    font-size: 12px;
    color: #888;
    text-decoration: none;
  }

  .bb-source:hover { color: #333; }

  .bb-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .bb-label {
    display: inline-block;
    font-size: var(--12px);
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #000;
    text-decoration: underline;
    text-decoration-color: #b5cc18;
    text-decoration-thickness: 2px;
    margin-bottom: 0.25rem;

    /* padding: 0 0 1px; */
    align-self: center;
    /* margin-bottom: 0.5rem; */
  }

  .bb-name {
    font-family: var(--sans);
    font-size: var(--22px);
    font-weight: 700;
    color: #000;
    line-height: 1.1;
    margin-bottom: 0.25rem;
  }

  @media (max-width: 768px) {
    .bb-name { font-size: var(--16px); }
    .bed-banner { min-height: 120px; align-items: flex-start; }
    .bb-img-wrap { align-self: flex-start; margin-top: 0.25rem; }
    .bb-info { justify-content: flex-start; align-items: flex-start; text-align: left; }
    .bb-label { align-self: flex-start; }
    .bb-img { width: 100px; height: 100px; }
  }


  .bb-meta {
    font-size: var(--12px);
    color: #000;
    font-family: var(--sans);
  }

  .bb-meta-key {
    font-weight: 700;
  }

  .bb-source{
    font-size: var(--10px);
  }

</style>

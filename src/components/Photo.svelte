<script>
  import { onMount } from "svelte"

  export let url
  export let altText
  export let caption = ""
  export let credit = ""
  export let width = "text-width"
  export let ratio = "56.25%"
  let imgElement

  function updateRatio() {
    if (imgElement && imgElement.naturalWidth && imgElement.naturalHeight) {
      const aspectRatio =
        (imgElement.naturalHeight / imgElement.naturalWidth) * 100
      ratio = `${aspectRatio}%`
    }
  }

  let container
  let imageRez = 0

  function addTargetRel(html) {
    return html.replace(
      /([^\s])(<a\s+(?![^>]*\b(target|rel)=)[^>]*href="[^"]*"[^>]*>)/gi,
      (match, beforeChar, aTag) => {
        const updatedTag = aTag.replace(
          /^<a/,
          '<a target="_blank" rel="noopener noreferrer"'
        )
        return beforeChar + " " + updatedTag
      }
    )
  }

  function debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  const setImageWidth = () => {
    let pixelWidth = 900
    const pixelRatio = window.devicePixelRatio || 1
    if (container && container.offsetWidth) {
      pixelWidth = Math.round(container.offsetWidth * pixelRatio)
    }
    if (imageRez < pixelWidth) imageRez = pixelWidth
  }

  onMount(() => {
    setImageWidth()
    const resizeHandler = debounce(() => setImageWidth(), 300)
    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  })

  if (!url) throw new Error(`Missing 'url'`)
  if (typeof altText !== "string") throw new Error(`Missing altText for image`)

  // Strip /public prefix, then prepend BASE_URL to handle the Vite base path
  $: resolvedUrl = /^https?:\/\//.test(url)
    ? url
    : import.meta.env.BASE_URL + url.replace(/^\/public\//, '/').replace(/^\//, '')
</script>

<figure class={width}>
  <div
    bind:this={container}
    class="photo-container"
    style="padding-bottom: {ratio};"
  >
    {#if imageRez > 0}
      <img
        bind:this={imgElement}
        src={resolvedUrl}
        alt={altText}
        loading="lazy"
        on:load={updateRatio}
      />
    {/if}
  </div>
  {#if caption || credit}
    <figcaption>
      {@html addTargetRel(caption)}
      {#if credit}
        <span class="credit"> {@html addTargetRel(credit)}</span>
      {/if}
    </figcaption>
  {/if}
</figure>

<style>
  .photo-container {
    position: relative;
    overflow: hidden;
  }

  .photo-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

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
    max-width: 640px;
    margin: 0 auto 1.5rem auto;
  }

  .large {
    width: 928px;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1.5rem;
  }

  .wide {
    width: 1200px;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1.5rem;
  }

  .full {
    width: 100vw;
    max-width: none;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1.5rem;
  }

  figcaption {
    font-size: 14px;
    color: var(--text);
    margin-top: 0.5rem;
    font-family: var(--sans);
  }

  .credit {
    font-size: 12px;
    color: #828282;
  }

  @media (max-width: 768px) {
    .float-left,
    .float-right,
    .large,
    .wide {
      width: 100% !important;
      float: none;
      margin: 0 0 1rem 0;
    }
  }
</style>

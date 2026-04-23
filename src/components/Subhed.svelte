<script>
  export let text = ""
</script>

<h2 class="subhed">{@html text}</h2>

<style>
  .subhed {
    font-family: var(--serif);
    font-weight: 700;
    font-size: var(--32px);
    line-height: 1.3;
    color: var(--text-h);
    margin: 2rem auto 0.75rem;
    max-width: 640px;
    width: 100%;
    text-align: left;
  }

  @media (max-width: 768px) {
    .subhed {
      font-size: var(--28px);
    }
  }
</style>

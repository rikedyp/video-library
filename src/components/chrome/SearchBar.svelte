<script lang="ts">
  import { slide } from "svelte/transition";
  import AdvancedOptions from "../browse/AdvancedOptions.svelte";
  import { assetsPrefix } from "../../lib/env";
  import Link from "../../lib/router/Link.svelte";
  import { location } from "../../lib/router/location.svelte";
  import { filters, setFilters } from "../../lib/state/filters.svelte";
  import { searchPanel } from "../../lib/state/searchPanel.svelte";

  const PANEL_ID = "video-library-advanced-options";

  // On a watch page the video title is the h1, so the band steps down to h2.
  const heading = $derived(location.pathname === "/watch/" ? "h2" : "h1");

  // Follows the URL, so clicking a presenter name updates the box.
  const query = $derived(filters.current.q);

  // Only the query, merged over the URL so the panel's event, presenters and
  // year range survive. The destination is always /search/, because a search
  // box means search.
  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "");
    setFilters({ q }, { pathname: "/search/" });
  }
</script>

<section class="band">
  <div class="inner video-library-x-padding">
    <form onsubmit={submit}>
      <Link href="/">
        <svelte:element this={heading} class="heading">
          Video&nbsp;<strong>Library</strong>
        </svelte:element>
      </Link>

      <input type="search" name="q" placeholder="Search..." value={query} />

      <button type="submit" title="Search">
        <img
          src="{assetsPrefix}/icon_video-library_search_01.svg"
          alt=""
          aria-hidden="true"
          width="20"
          height="20"
        />
        Search
      </button>

      <button
        type="button"
        title="Advanced Options"
        aria-label="Advanced Options"
        aria-expanded={searchPanel.open}
        aria-controls={PANEL_ID}
        onclick={() => searchPanel.toggle()}
      >
        <img
          src="{assetsPrefix}/{searchPanel.open
            ? 'icon_video-chevron-up_01.svg'
            : 'icon_video-library_advanced-options_01.svg'}"
          alt=""
          aria-hidden="true"
          width="24"
          height="24"
        />
      </button>
    </form>

    <!-- The mode strip goes here, between the form and the advanced-search
         panel: Videos / Events / Presenters with their counts. It needs
         location.pathname for the active tab and the three totals. -->

    <!-- The wrapper is always here, so aria-controls names an element that
         exists in both states. Closed removes the controls outright rather than
         hiding them: react-collapsible keeps dvl's mounted, so its visually
         closed panel holds a dozen focusable controls. -->
    <div id={PANEL_ID}>
      {#if searchPanel.open}
        <div transition:slide={{ duration: 175 }}>
          <AdvancedOptions />
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .band {
    display: flex;
    justify-content: center;
    background-color: var(--dyalog-video-library-band);
    color: var(--dyalog-video-library-on-primary);
  }

  /* Asymmetric on purpose: the row wants a little more air above it than below,
     where the tab band follows on. */
  .inner {
    padding: 15px 0.4rem 10px;
  }

  form {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(#dyalog-video-library) .heading {
    margin-right: 0.5rem;
    font-size: var(--dyalog-video-library-size-md);
    font-weight: var(--dyalog-video-library-weight-regular);
    line-height: 1.3;
    letter-spacing: -0.5px;
    color: var(--dyalog-video-library-on-primary);
  }

  /* The heading's Link renders the anchor, so the selector has to reach into
     another component's markup. Kept as narrow as a global can be. */
  form :global(a) {
    color: inherit;
    text-decoration: none;
  }

  input {
    flex: 1;
    height: 40px;
    padding: 0 1.25rem;
    border: 0;
    border-radius: 6px;
    background-color: var(--dyalog-video-library-surface);
    color: var(--dyalog-video-library-text);
    font-size: var(--dyalog-video-library-size-md);
  }

  /* The mount id, since the kit styles `button:hover` and `:focus`, which
     outranks the scoping hash. `:global`, or Svelte prunes the rule. */
  :global(#dyalog-video-library) button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 0.8rem;
    border: 0;
    border-radius: 6px;
    background-color: var(--dyalog-video-library-secondary);
    color: var(--dyalog-video-library-on-primary);
    font-size: var(--dyalog-video-library-size-sm);
    font-weight: var(--dyalog-video-library-weight-medium);
    cursor: pointer;
  }

  @media (max-width: 640px) {
    form {
      flex-direction: column;
      align-items: stretch;
    }

    :global(#dyalog-video-library) .heading {
      font-size: var(--dyalog-video-library-size-2xl);
    }

    /* Touch targets. */
    input,
    button {
      min-height: 44px;
    }

    button {
      justify-content: center;
    }
  }
</style>

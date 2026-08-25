// The live filters, read from the URL and written back to it.

import { location, navigate } from "../router/location.svelte";
import {
  defaultSortFor,
  parseFilters,
  serialiseFilters,
  type BrowseFilters,
} from "../utils/browseFilters";

interface WriteOptions {
  /** Skip this write when going Back. */
  replace?: boolean;
  /** Where to land. Defaults to the route the user is on. */
  pathname?: string;
  /** The caller already owns the scroll position. */
  keepScroll?: boolean;
}

const parsed = $derived(parseFilters(location.search));

export const filters = {
  get current(): BrowseFilters {
    return parsed;
  },
};

/**
 * Merge `patch` over the filters in the URL and navigate.
 *
 * `page` returns to 1 unless the patch names it: the page the user was on means
 * nothing under a different filter. An unchosen sort follows a changed `q` for
 * the same reason.
 */
export function setFilters(
  patch: Partial<BrowseFilters>,
  options: WriteOptions = {},
): void {
  const next = { ...parsed, page: 1, ...patch };

  // parseFilters answered defaultSortFor for the query being replaced, so a
  // sort matching it is one nobody chose and follows the new query. Anything
  // else came from the Sort control and stays.
  if (
    patch.q !== undefined &&
    patch.sort === undefined &&
    parsed.sort === defaultSortFor(parsed.q)
  ) {
    next.sort = defaultSortFor(patch.q);
  }

  const pathname = options.pathname ?? location.pathname;

  navigate(`${pathname}?${serialiseFilters(next).toString()}`, {
    replace: options.replace,
    keepScroll: options.keepScroll,
  });
}

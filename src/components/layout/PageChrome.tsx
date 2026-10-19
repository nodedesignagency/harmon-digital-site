/**
 * How much of the site's chrome a page wears, declared by the page itself —
 * the same arrangement as PageSurface, and for the same reason.
 *
 * The header and footer are mounted by SiteChrome, outside every page, so a
 * page cannot hand them a prop. It renders this marker instead, and
 * `globals.css` selects on `body:has([data-page-chrome="…"])` to hide whatever
 * in the chrome carries `data-chrome-full`.
 *
 *  - `landing` — a single-goal page (/vsl): the header keeps its wordmark and
 *                its "Book a Call" and drops the navigation, desktop and
 *                mobile; the footer keeps its closing call to action and its
 *                legal bar and drops the link columns. Nothing on the page
 *                offers a way off it but the booking link.
 *
 * A page that renders nothing here gets the full chrome, which is every page
 * but the landing ones — so unlike PageSurface, silence is the normal case.
 */

type PageChromeProps = {
  value: "landing";
};

export function PageChrome({ value }: PageChromeProps) {
  return <div hidden data-page-chrome={value} />;
}

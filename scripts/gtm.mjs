export const GTM_HASH = 'sha256-8fZCrZrdXjBrydeluTWo4wxVTIm98HTPl3BFzE94r7g=';
const bootstrap = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
`;
export const GTM_HEAD = `<script>${bootstrap}</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-WZ75JWVK"></script>`;

export function addGtmToHead(html) {
  if (html.includes('https://www.googletagmanager.com/gtm.js?id=GTM-WZ75JWVK')) return html;
  return html.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}\n${GTM_HEAD}`);
}

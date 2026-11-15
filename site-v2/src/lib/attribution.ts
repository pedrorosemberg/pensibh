/** First/last touch and lightweight navigation history. No internal UTMs. */
export type Touch = { at: string; source: string; medium: string; campaign: string; content: string; term: string; campaignId: string; clickIdType?: string; clickId?: string; landing: string };
export type Journey = { v: 1; id: string; first: Touch; last: Touch; touches: Touch[]; events: { at: string; name: string; detail?: string }[]; expires: number };
const KEY = 'pensi-attribution-v1';
const TTL = 180 * 24 * 60 * 60 * 1000;
const PARAMS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id'] as const;
const CLICK = ['gclid','gbraid','wbraid','fbclid'] as const;
const safe = (v: string | null, n = 120) => (v || '').slice(0,n).replace(/[<>\r\n]/g,'');
const now = () => new Date().toISOString();
export function readJourney(): Journey | null {
  try { const v = JSON.parse(localStorage.getItem(KEY) || 'null') as Journey | null; return v?.v === 1 && v.expires > Date.now() ? v : null; } catch { return null; }
}
function write(v: Journey) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage blocked */ } }
export function clearJourney() { try { localStorage.removeItem(KEY); } catch { /* storage blocked */ } }
export function captureTouch(allowAdClickIds = false): Journey | null {
  if (typeof window === 'undefined') return null;
  const u = new URL(location.href);
  const hasCampaign = PARAMS.some(p=>u.searchParams.has(p)) || (allowAdClickIds && CLICK.some(p=>u.searchParams.has(p)));
  let ref: URL | null = null;
  try { if (document.referrer) ref = new URL(document.referrer); } catch { /* malformed referrer */ }
  const external = ref && ref.hostname !== location.hostname && !ref.hostname.endsWith('.'+location.hostname);
  const existing = readJourney();
  if (!allowAdClickIds && existing) {
    const redact = (t: Touch) => { delete t.clickId; delete t.clickIdType; };
    redact(existing.first); redact(existing.last); existing.touches.forEach(redact); write(existing);
  }
  if (!hasCampaign && !external && existing) return existing;
  const click = allowAdClickIds ? CLICK.find(p=>u.searchParams.has(p)) : undefined;
  const source = safe(u.searchParams.get('utm_source')) || (click === 'fbclid' ? 'facebook' : click ? 'google' : external ? safe(ref!.hostname) : 'direct');
  const medium = safe(u.searchParams.get('utm_medium')) || (click ? 'cpc' : external ? (/(google|bing|duckduckgo)\./.test(ref!.hostname) ? 'organic' : 'referral') : 'none');
  const t: Touch = {at:now(),source,medium,campaign:safe(u.searchParams.get('utm_campaign')),content:safe(u.searchParams.get('utm_content')),term:safe(u.searchParams.get('utm_term')),campaignId:safe(u.searchParams.get('utm_id')),landing:u.pathname.slice(0,160),...(click ? {clickIdType:click,clickId:safe(u.searchParams.get(click),500)} : {})};
  if (existing) {
    const signature = (x: Touch) => [x.source,x.medium,x.campaign,x.content,x.term,x.clickId].join('|');
    if (signature(t) !== signature(existing.last)) { existing.last=t; existing.touches=[...existing.touches,t].slice(-30); }
    existing.expires=Date.now()+TTL; write(existing); return existing;
  }
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : '';
  if (!id) return null;
  const journey:Journey={v:1,id,first:t,last:t,touches:[t],events:[],expires:Date.now()+TTL};write(journey);return journey;
}
export function recordJourneyEvent(name: string, detail?: string) {
  const j=readJourney(); if(!j)return;
  j.events=[...j.events,{at:now(),name:safe(name,40),...(detail?{detail:safe(detail,120)}:{})}].slice(-80);write(j);
}
export function attendanceCode() { const j=readJourney(); return j ? 'P26-'+j.id.replace(/-/g,'').slice(0,10).toUpperCase() : ''; }
export function attachAttendanceCode(href: string): string {
  const code=attendanceCode();if(!code)return href;
  try { const u=new URL(href);if(u.hostname!=='wa.me')return href;const text=u.searchParams.get('text')||'Olá! Tenho interesse nos cursos da PENSI+.';if(!text.includes(code))u.searchParams.set('text',text+'\nCódigo de atendimento: '+code);return u.toString(); } catch {return href;}
}

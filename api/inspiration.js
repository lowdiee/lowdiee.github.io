// api/inspiration.js — latest Shorts from channels you take inspiration from ("Find a Hit" tab)
// Uses the same YOUTUBE_API_KEY as api/youtube.js — nothing to configure in Vercel.
// Cost per refresh: ~3 quota units per channel (Vercel caches the result for 30 minutes).

// ▼ Edit this list: @handles or channel IDs (UC...)
const CHANNELS = [
  '@KindOtter',
  '@ShortsRender',
  '@frodowmusa',
  '@좋아요행운충전',
  '@행운행복건강좋아요',
  '@CamBR-l4k',
  '@viralhog',            // added: licensed viral clips (animals, funny, unexpected)
  '@Bleu'  // added: trending real-life clips
];
const VIDEOS_PER_CHANNEL = 50; // latest uploads per channel (max 50)

const API = 'https://www.googleapis.com/youtube/v3/';

async function yt(path, params, key) {
  const url = new URL(API + path);
  Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || 'YouTube API error');
  return j;
}

// ISO 8601 duration (PT1M5S) -> seconds
function seconds(iso) {
  const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '');
  if (!m) return 0;
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
}

async function resolveChannel(entry, key) {
  const part = 'snippet,statistics,contentDetails';
  if (/^UC[\w-]{22}$/.test(entry)) return (await yt('channels', { part, id: entry }, key)).items?.[0];
  const handle = entry.startsWith('@') ? entry : '@' + entry;
  const byHandle = await yt('channels', { part, forHandle: handle }, key);
  if (byHandle.items?.length) return byHandle.items[0];
  // Fallback (100 units) — only if the handle lookup fails. Tip: put the UC... ID in the list instead.
  const s = await yt('search', { part: 'snippet', type: 'channel', q: handle, maxResults: 1 }, key);
  const id = s.items?.[0]?.id?.channelId;
  return id ? (await yt('channels', { part, id }, key)).items?.[0] : null;
}

async function loadChannel(entry, key) {
  const ch = await resolveChannel(entry, key);
  if (!ch) return { handle: entry, error: 'Channel not found', videos: [] };

  const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
  const pl = await yt('playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: VIDEOS_PER_CHANNEL }, key);
  const ids = (pl.items || []).map(i => i.contentDetails?.videoId).filter(Boolean);

  let videos = [];
  if (ids.length) {
    const v = await yt('videos', { part: 'snippet,statistics,contentDetails', id: ids.join(',') }, key);
    videos = (v.items || []).map(x => {
      const duration = seconds(x.contentDetails?.duration);
      const th = x.snippet?.thumbnails || {};
      return {
        id: x.id,
        title: x.snippet?.title || '',
        thumbnail: (th.high || th.medium || th.default || {}).url || '',
        publishedAt: x.snippet?.publishedAt,
        views: Number(x.statistics?.viewCount || 0),
        likes: Number(x.statistics?.likeCount || 0),
        comments: Number(x.statistics?.commentCount || 0),
        duration,
        format: duration && duration <= 180 ? 'short' : 'long' // Shorts can be up to 3 min
      };
    });
  }

  const th = ch.snippet?.thumbnails || {};
  return {
    id: ch.id,
    handle: ch.snippet?.customUrl || entry,
    title: ch.snippet?.title || entry,
    avatar: (th.high || th.medium || th.default || {}).url || '',
    subs: Number(ch.statistics?.subscriberCount || 0),
    hiddenSubs: !!ch.statistics?.hiddenSubscriberCount,
    views: Number(ch.statistics?.viewCount || 0),
    videoCount: Number(ch.statistics?.videoCount || 0),
    videos
  };
}

export default async function handler(req, res) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing YOUTUBE_API_KEY' });

  // Vercel keeps the answer for 30 minutes, then refreshes it in the background
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');

  const channels = await Promise.all(
    CHANNELS.map(entry => loadChannel(entry, key).catch(e => ({ handle: entry, error: e.message, videos: [] })))
  );
  res.status(200).json({ updatedAt: new Date().toISOString(), channels });
}

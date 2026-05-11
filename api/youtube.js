export default async function handler(req, res) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = "UCiET35uAJMAHQFbxGDRalTw";

    // USTAWIANIE CACHE: Vercel zapamięta odpowiedź na 1 godzinę (s-maxage=3600)
    // Przeglądarka użytkownika nie będzie odświeżać danych przez 1 minutę (maxage=60)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=59');

    /* CHANNEL DATA */
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items) {
      return res.status(200).json({ error: "Brak danych kanału (prawdopodobnie limit API)" });
    }

    /* GET VIDEOS (Zredukowano pętlę do 1, aby oszczędzać punkty Quota) */
    let allVideoIds = [];
    let nextPageToken = "";

    // Zmieniono z 6 na 1 - pobiera 50 najnowszych filmów (koszt: 100 pkt)
    for (let i = 0; i < 1; i++) {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=50&pageToken=${nextPageToken}`
      );
      const searchData = await searchResponse.json();

      if (!searchData.items) break;

      const ids = searchData.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      allVideoIds.push(...ids);
      nextPageToken = searchData.nextPageToken;
      if (!nextPageToken) break;
    }

    /* VIDEO DETAILS */
    let videos = [];
    if (allVideoIds.length > 0) {
      const chunk = allVideoIds.join(",");
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${chunk}&key=${apiKey}`
      );
      const videosData = await videosResponse.json();

      if (videosData.items) {
        videos = videosData.items.map(video => ({
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          views: Number(video.statistics.viewCount || 0),
          likes: Number(video.statistics.likeCount || 0),
          comments: Number(video.statistics.commentCount || 0),
          publishedAt: video.snippet.publishedAt
        }));
      }
    }

    /* SORT & STATS */
    videos.sort((a, b) => b.views - a.views);
    const totalViews = videos.reduce((sum, vid) => sum + vid.views, 0);
    const avgViews = videos.length > 0 ? Math.floor(totalViews / videos.length) : 0;

    res.status(200).json({
      channel: channelData.items[0],
      videos,
      avgViews
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

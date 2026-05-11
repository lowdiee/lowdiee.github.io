export default async function handler(req, res) {

  try {

    const apiKey = process.env.YOUTUBE_API_KEY;

    const channelId = "UCiET35uAJMAHQFbxGDRaITw";

    /*
      CHANNEL DATA
    */

    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
    );

    const channelData = await channelResponse.json();

    /*
      GET ALL VIDEOS
    */

    let allVideoIds = [];

    let nextPageToken = "";

    for (let i = 0; i < 6; i++) {

      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=50&pageToken=${nextPageToken}`
      );

      const searchData = await searchResponse.json();

      const ids = searchData.items
        .filter(item => item.id.videoId)
        .map(item => item.id.videoId);

      allVideoIds.push(...ids);

      nextPageToken = searchData.nextPageToken;

      if (!nextPageToken) break;
    }

    /*
      VIDEO DETAILS
    */

    let videos = [];

    for (let i = 0; i < allVideoIds.length; i += 50) {

      const chunk = allVideoIds.slice(i, i + 50).join(",");

      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${chunk}&key=${apiKey}`
      );

      const videosData = await videosResponse.json();

      const mapped = videosData.items.map(video => ({

        title: video.snippet.title,

        thumbnail:
          video.snippet.thumbnails.high.url,

        views:
          Number(video.statistics.viewCount || 0),

        likes:
          Number(video.statistics.likeCount || 0),

        comments:
          Number(video.statistics.commentCount || 0),

        publishedAt:
          video.snippet.publishedAt

      }));

      videos.push(...mapped);
    }

    /*
      SORT BY VIEWS
    */

    videos.sort((a, b) => b.views - a.views);

    /*
      AVERAGE VIEWS
    */

    const totalViews =
      videos.reduce((sum, vid) => sum + vid.views, 0);

    const avgViews =
      Math.floor(totalViews / videos.length);

    res.status(200).json({

      channel: channelData.items[0],

      videos,

      avgViews

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}

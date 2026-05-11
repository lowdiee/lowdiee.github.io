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
      VIDEOS
    */

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=8`
    );

    const searchData = await searchResponse.json();

    const videoIds =
      searchData.items
      .filter(item => item.id.videoId)
      .map(item => item.id.videoId)
      .join(",");

    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
    );

    const videosData = await videosResponse.json();

    const videos = videosData.items.map(video => ({

      title: video.snippet.title,

      thumbnail:
        video.snippet.thumbnails.high.url,

      views:
        video.statistics.viewCount || 0,

      likes:
        video.statistics.likeCount || 0,

      comments:
        video.statistics.commentCount || 0

    }));

    res.status(200).json({

      channel: channelData.items[0],

      videos

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}

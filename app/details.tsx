import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Appbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { getStreamsByChannel } from '@/services/database';

export default function Details() {
  const router = useRouter();
  const { channelId, name } = useLocalSearchParams();
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    const loadStream = async () => {
      const streams = await getStreamsByChannel(channelId as string);
      if (streams.length > 0) setStreamUrl(streams[0].url);
    };
    loadStream();
  }, [channelId]);

  const player = useVideoPlayer(streamUrl, (player) => {
    if (streamUrl) player.play();
  });

  return (
    <View className="flex flex-1 bg-background-light dark:bg-background-dark">
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={name} />
      </Appbar.Header>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

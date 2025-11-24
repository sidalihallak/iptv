import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { initDatabase, searchChannels } from '@/services/database';

export default function Search() {
  const router = useRouter();
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length === 0) {
        setChannels([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchChannels(searchQuery);
        setChannels(data);
      } catch (error) {
        console.error('Error searching channels:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex flex-1 bg-background-light dark:bg-background-dark p-4">
      <Searchbar
        placeholder="Search channels..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        autoFocus
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={channels}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <Card style={{ width: '48%', marginBottom: 12 }} onPress={() => router.push({ pathname: '/details', params: { channelId: item.id, name: item.name } })}>
              {item.logo && <Card.Cover source={{ uri: item.logo }} style={{ height: 80 }} />}
              <Card.Content>
                <Text variant="titleSmall" numberOfLines={1}>{item.name}</Text>
                <Text variant="bodySmall">{item.country}</Text>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text>No channels found</Text>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center mt-10">
                <Text>Type to search channels</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

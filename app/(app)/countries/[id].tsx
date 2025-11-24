import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { initDatabase, getChannelsByCountry } from '@/services/database';

export default function CountryChannels() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadChannels();
        }
    }, [id]);

    const loadChannels = async () => {
        try {
            await initDatabase();
            const data = await getChannelsByCountry(id as string);
            setChannels(data);
        } catch (error) {
            console.error('Error loading channels:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex flex-1 bg-background-light dark:bg-background-dark">
            <Stack.Screen options={{ title: name as string }} />
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={channels}
                    numColumns={2}
                    contentContainerStyle={{ padding: 16 }}
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
                        <View className="flex-1 justify-center items-center mt-10">
                            <Text>No channels found in this country.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

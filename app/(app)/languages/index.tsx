import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { initDatabase, getAllLanguages } from '@/services/database';

export default function LanguagesList() {
    const router = useRouter();
    const [languages, setLanguages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            await initDatabase();
            const data = await getAllLanguages();
            setLanguages(data);
        } catch (error) {
            console.error('Error loading languages:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex flex-1 bg-background-light dark:bg-background-dark p-4">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={languages}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 12 }} onPress={() => router.push({ pathname: '/(app)/languages/[id]', params: { id: item.code, name: item.name } })}>
                            <Card.Content>
                                <Text variant="titleMedium">{item.name}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item) => item.code}
                />
            )}
        </View>
    );
}

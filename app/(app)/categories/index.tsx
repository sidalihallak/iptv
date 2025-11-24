import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { initDatabase, getAllCategories } from '@/services/database';

export default function CategoriesList() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            await initDatabase();
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
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
                    data={categories}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 12 }} onPress={() => router.push({ pathname: '/(app)/categories/[id]', params: { id: item.id, name: item.name } })}>
                            <Card.Content>
                                <Text variant="titleMedium">{item.name}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
}

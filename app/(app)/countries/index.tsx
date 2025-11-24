import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { initDatabase, getAllCountries } from '@/services/database';
import { importData } from '@/scripts/importData';

export default function CountriesList() {
    const router = useRouter();
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            await initDatabase();
            const data = await getAllCountries();
            if (data.length === 0) {
                await handleImport();
            } else {
                setCountries(data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading countries:', error);
            setLoading(false);
        }
    };

    const handleImport = async () => {
        setImporting(true);
        try {
            await importData();
            const data = await getAllCountries();
            setCountries(data);
        } catch (error) {
            console.error('Import error:', error);
        } finally {
            setImporting(false);
            setLoading(false);
        }
    };

    return (
        <View className="flex flex-1 bg-background-light dark:bg-background-dark p-4">
            {loading || importing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-4">{importing ? "Importing data..." : "Loading..."}</Text>
                </View>
            ) : countries.length === 0 ? (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="mb-4">No data found.</Text>
                </View>
            ) : (
                <FlatList
                    data={countries}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 12 }} onPress={() => router.push({ pathname: '/(app)/countries/[id]', params: { id: item.code, name: item.name } })}>
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

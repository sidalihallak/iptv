import { Stack } from 'expo-router';

export default function LanguagesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Languages', headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: 'Channels', headerShown: true }} />
        </Stack>
    );
}

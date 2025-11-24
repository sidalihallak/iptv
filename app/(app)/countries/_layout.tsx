import { Stack } from 'expo-router';

export default function CountriesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Countries', headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: 'Channels', headerShown: true }} />
        </Stack>
    );
}

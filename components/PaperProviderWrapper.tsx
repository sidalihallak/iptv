import { useColorScheme } from 'nativewind';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

import tailwindConfig from '../tailwind.config';


function transformString(input: string): string {
    return input
        .split('-')
        .slice(0, -1)
        .reduce((result, word, index) => {
            if (index === 0) return word;
            return result + word.charAt(0).toUpperCase() + word.slice(1);
        }, '');
}

function extractThemes(tailwindColors: any) {
    const light = { elevation: {} };
    const dark = { elevation: {} };
    for (const color in tailwindColors) {
        if (color.includes('dark')) {
            if (color.includes('elevation')) {
                console.log('color', color);
                // @ts-ignore
                dark['elevation'][transformString(color.replace('elevation-', ''))] = tailwindColors[color];
            } else {
                // @ts-ignore
                dark[transformString(color)] = tailwindColors[color];
            }
        }
        if (color.includes('light')) {
            if (color.includes('elevation')) {
                // @ts-ignore
                light['elevation'][transformString(color.replace('elevation-', ''))] =
                    tailwindColors[color];
            } else {
                // @ts-ignore
                light[transformString(color)] = tailwindColors[color];
            }
        }
    }

    return { dark, light };
}

export const PaperProviderWrapper = ({ children }: {children: any}) => {
    const { colorScheme } = useColorScheme();
    const theme = extractThemes(tailwindConfig?.theme?.colors)[colorScheme || 'dark'];
    const baseTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    const paperTheme = {
        ...baseTheme,
        colors: theme,
    };

    return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};
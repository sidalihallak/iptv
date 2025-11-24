import color from 'color';

const {
    argbFromHex,
    themeFromSourceColor,
    hexFromArgb,
    CustomColor,
} = require('@material/material-color-utilities');
const opacity = {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
};
function withMaterialColor(tailwindConfig, sourceColor, options = {}) {
    // Destructure options with default values
    const { secondaryColor, tertiaryColor } = options;

    // Validate the source color
    const hexColorRegex = /^#([0-9A-F]{6}|[0-9A-F]{3})$/i;
    if (!hexColorRegex.test(sourceColor)) {
        throw new Error(
            'Invalid source color. Please provide a valid hex color in the format #RRGGBB or #RGB.'
        );
    }

    // Validate secondary and tertiary colors if provided
    if (secondaryColor && !hexColorRegex.test(secondaryColor)) {
        throw new Error(
            'Invalid secondary color. Please provide a valid hex color in the format #RRGGBB or #RGB.'
        );
    }
    if (tertiaryColor && !hexColorRegex.test(tertiaryColor)) {
        throw new Error(
            'Invalid tertiary color. Please provide a valid hex color in the format #RRGGBB or #RGB.'
        );
    }

    // Generate custom colors for secondary and tertiary if provided
    const customColorList = [];
    if (secondaryColor) {
        customColorList.push(new CustomColor('secondary', argbFromHex(secondaryColor), false));
    }
    if (tertiaryColor) {
        customColorList.push(new CustomColor('tertiary', argbFromHex(tertiaryColor), false));
    }

    // Generate the theme from the source color with custom colors
    const theme = themeFromSourceColor(argbFromHex(sourceColor), customColorList);

    // Extract the light and dark color schemes
    const { light, dark } = theme.schemes;

    // Function to map the color scheme to Tailwind color tokens with suffixes
    const mapSchemeToColors = (scheme, suffix) => {
        const colorTokens = {};
        for (const [key, value] of Object.entries(scheme.toJSON())) {
            // Convert camelCase to kebab-case and add suffix
            const colorName = `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}-${suffix}`;
            // Convert ARGB integer to hex string
            colorTokens[colorName] = hexFromArgb(value);
        }
        const elevationValues = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];
        const elevations = elevationValues.reduce((elevations, elevationValue, index) => {
            return {
                ...elevations,
                [`elevation-level${index}-${suffix}`]:
                    index === 0
                        ? elevationValue
                        : color(colorTokens[`surface-${suffix}`])
                            .mix(color(colorTokens[`primary-${suffix}`]), elevationValue)
                            .rgb()
                            .string(),
            };
        }, {});

        colorTokens[`shadow-${suffix}`] = 'rgba(0, 0, 0, 1)';
        colorTokens[`scrim-${suffix}`] = 'rgba(0, 0, 0, 1)';
        colorTokens[`surface-disabled-${suffix}`] = color(colorTokens.onSurface)
            .alpha(opacity.level2)
            .rgb()
            .string();
        colorTokens[`on-surface-disabled-${suffix}`] = color(colorTokens.onSurface)
            .alpha(opacity.level4)
            .rgb()
            .string();
        colorTokens[`backdrop-${suffix}`] = color('rgba(50, 47, 55, 1)').alpha(0.4).rgb().string();


        return {
            ...colorTokens,
            ...elevations,
        };
    };

    // Map both light and dark schemes
    const lightColors = mapSchemeToColors(light, 'light');
    const darkColors = mapSchemeToColors(dark, 'dark');

    // Merge the generated colors with existing colors in the Tailwind config
    const mergedColors = {
        ...(tailwindConfig.theme && tailwindConfig.theme.colors),
        ...lightColors,
        ...darkColors,
    };

    // Return the updated Tailwind config with colors in theme.colors
    return {
        ...tailwindConfig,
        theme: {
            ...tailwindConfig.theme,
            colors: mergedColors,
        },
    };
}

module.exports = withMaterialColor;
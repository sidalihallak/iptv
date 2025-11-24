import { router, Slot } from 'expo-router';
import { Platform, View } from "react-native";
import { Surface, Drawer, Icon, FAB, IconButton, Appbar } from "react-native-paper";
import { useState } from "react";
import { cssInterop, useColorScheme } from "nativewind";

cssInterop(Surface, {
    className: 'style'
});

export default function HomeLayout() {
    const [active, setActive] = useState("countries")
    const { colorScheme, toggleColorScheme } = useColorScheme()

    const toggleScheme = () => {
        toggleColorScheme()
    }

    const renderItems = () => (
        <>
            <Drawer.CollapsedItem
                onPress={() => {
                    setActive("countries")
                    router.replace("countries")
                }}
                active={active === "countries"}
                focusedIcon="earth"
                unfocusedIcon="earth"
                label="countries"
            />
            <Drawer.CollapsedItem
                onPress={() => {
                    setActive("categories")
                    router.replace("categories")
                }}
                active={active === "categories"}
                focusedIcon="file"
                unfocusedIcon="file-outline"
                label="categories"
            />
            <Drawer.CollapsedItem
                onPress={() => {
                    setActive("languages")
                    router.replace("languages")
                }}
                active={active === "languages"}
                focusedIcon="translate"
                unfocusedIcon="translate"
                label="languages"
            />
            <Drawer.CollapsedItem
                onPress={() => {
                    setActive("search")
                    router.replace("search")
                }}
                active={active === "search"}
                focusedIcon="magnify-plus"
                unfocusedIcon="magnify-plus-outline"
                label="search"
            />
        </>
    )

    return (
        <View className="flex-1 md:flex-row">
            <View className="md:hidden">
                <Appbar.Header mode="small">
                    <Appbar.Content title={<Icon size={50} source="television" />} />
                    <Appbar.Action mode="outlined" icon={colorScheme === "light" ? "brightness-3" : "brightness-5"}
                        onPress={() => toggleScheme()} />
                </Appbar.Header>
            </View>

            <Surface mode="flat" className="items-center p-1 hidden md:flex">
                <View className="mt-2 mb-5">
                    <Icon size={50} source="television" />
                </View>
                <View className="flex-1">
                    {renderItems()}
                </View>
                <IconButton
                    mode="outlined"
                    size={25}
                    icon={colorScheme === "light" ? "brightness-3" : "brightness-5"}
                    onPress={() => toggleScheme()}
                />
            </Surface>
            <Slot />
            <Surface className="justify-around items-center px-2.5 py-3 flex-row md:hidden">
                {renderItems()}
            </Surface>
        </View>
    )
}
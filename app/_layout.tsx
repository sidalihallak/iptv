import '../global.css';

import { Stack } from 'expo-router';
import {PaperProviderWrapper} from "@/components/PaperProviderWrapper";

export default function Layout() {
  return (
      <PaperProviderWrapper>
        <Stack screenOptions={{headerShown: false}} />
      </PaperProviderWrapper>
  );
}

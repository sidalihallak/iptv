import { initDatabase, insertChannels, insertStreams, insertCategories, insertLanguages, insertCountries, insertChannelCategories, insertChannelLanguages } from '../services/database';
import { fetchChannels, fetchStreams, fetchCategories, fetchLanguages, fetchCountries } from '../services/iptvService';

export const importData = async () => {
  await initDatabase();

  console.log('Fetching data...');
  const [channels, streams, categories, languages, countries] = await Promise.all([
    fetchChannels(),
    fetchStreams(),
    fetchCategories(),
    fetchLanguages(),
    fetchCountries()
  ]);

  console.log('Inserting data...');
  await insertCategories(categories);
  await insertLanguages(languages);
  await insertCountries(countries);
  await insertChannels(channels);
  await insertStreams(streams);
  await insertChannelCategories(channels);
  await insertChannelLanguages(channels);

  console.log(`Imported:
  - ${channels.length} channels
  - ${streams.length} streams
  - ${categories.length} categories
  - ${languages.length} languages
  - ${countries.length} countries`);
};

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('iptv.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      network TEXT,
      country TEXT,
      subdivision TEXT,
      city TEXT,
      is_nsfw INTEGER,
      launched TEXT,
      closed TEXT,
      website TEXT,
      logo TEXT
    );
    CREATE TABLE IF NOT EXISTS streams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_id TEXT,
      url TEXT NOT NULL,
      timeshift TEXT,
      http_referrer TEXT,
      user_agent TEXT,
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS countries (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS channel_categories (
      channel_id TEXT,
      category_id TEXT,
      PRIMARY KEY(channel_id, category_id)
    );
    CREATE TABLE IF NOT EXISTS channel_languages (
      channel_id TEXT,
      language_code TEXT,
      PRIMARY KEY(channel_id, language_code)
    );
    CREATE INDEX IF NOT EXISTS idx_streams_channel ON streams(channel_id);
    CREATE INDEX IF NOT EXISTS idx_channels_country ON channels(country);
  `);
};

export const insertChannels = async (channels: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO channels VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const c of channels) {
      await stmt.executeAsync([c.id, c.name, c.network, c.country, c.subdivision, c.city, c.is_nsfw ? 1 : 0, c.launched, c.closed, c.website, c.logo]);
    }
    await stmt.finalizeAsync();
  });
};

export const insertStreams = async (streams: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT INTO streams (channel_id, url, timeshift, http_referrer, user_agent) VALUES (?, ?, ?, ?, ?)'
    );
    for (const s of streams) {
      await stmt.executeAsync([s.channel, s.url, s.timeshift, s.http_referrer, s.user_agent]);
    }
    await stmt.finalizeAsync();
  });
};

export { db };

export const insertCategories = async (categories: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO categories VALUES (?, ?)'
    );
    for (const c of categories) {
      await stmt.executeAsync([c.id, c.name]);
    }
    await stmt.finalizeAsync();
  });
};

export const insertLanguages = async (languages: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO languages VALUES (?, ?)'
    );
    for (const l of languages) {
      await stmt.executeAsync([l.code, l.name]);
    }
    await stmt.finalizeAsync();
  });
};

export const insertCountries = async (countries: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO countries VALUES (?, ?)'
    );
    for (const c of countries) {
      await stmt.executeAsync([c.code, c.name]);
    }
    await stmt.finalizeAsync();
  });
};

export const insertChannelCategories = async (channels: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO channel_categories VALUES (?, ?)'
    );
    for (const c of channels) {
      if (c.categories) {
        for (const catId of c.categories) {
          await stmt.executeAsync([c.id, catId]);
        }
      }
    }
    await stmt.finalizeAsync();
  });
}

export const insertChannelLanguages = async (channels: any[]) => {
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      'INSERT OR REPLACE INTO channel_languages VALUES (?, ?)'
    );
    for (const c of channels) {
      if (c.languages) {
        for (const langCode of c.languages) {
          await stmt.executeAsync([c.id, langCode]);
        }
      }
    }
    await stmt.finalizeAsync();
  });
}

export const getAllCategories = async () => await db.getAllAsync('SELECT * FROM categories ORDER BY name');
export const getAllLanguages = async () => await db.getAllAsync('SELECT * FROM languages ORDER BY name');
export const getAllCountries = async () => await db.getAllAsync('SELECT * FROM countries ORDER BY name');

export const getChannelsByCategory = async (categoryId: string) =>
  await db.getAllAsync(`
    SELECT c.id, c.name, c.logo, c.country, s.url, s.id as stream_id
    FROM channels c
    JOIN channel_categories cc ON c.id = cc.channel_id
    LEFT JOIN streams s ON c.id = s.channel_id
    WHERE cc.category_id = ? AND s.url IS NOT NULL
  `, [categoryId]);

export const getChannelsByLanguage = async (languageCode: string) =>
  await db.getAllAsync(`
    SELECT c.id, c.name, c.logo, c.country, s.url, s.id as stream_id
    FROM channels c
    JOIN channel_languages cl ON c.id = cl.channel_id
    LEFT JOIN streams s ON c.id = s.channel_id
    WHERE cl.language_code = ? AND s.url IS NOT NULL
  `, [languageCode]);

export const getChannelsByCountry = async (countryCode: string) =>
  await db.getAllAsync(`
    SELECT c.id, c.name, c.logo, c.country, s.url, s.id as stream_id
    FROM channels c
    LEFT JOIN streams s ON c.id = s.channel_id
    WHERE c.country = ? AND s.url IS NOT NULL
  `, [countryCode]);

export const getStreamsByChannel = async (channelId: string) =>
  await db.getAllAsync('SELECT * FROM streams WHERE channel_id = ?', [channelId]);

export const getAllChannelsWithStreams = async () =>
  await db.getAllAsync(`
    SELECT c.id, c.name, c.logo, c.country, s.url, s.id as stream_id
    FROM channels c
    LEFT JOIN streams s ON c.id = s.channel_id
    WHERE s.url IS NOT NULL
  `);

export const searchChannels = async (query: string) =>
  await db.getAllAsync(
    `SELECT c.id, c.name, c.logo, c.country
     FROM channels c
     JOIN streams s ON c.id = s.channel_id
     WHERE c.name LIKE ? AND s.url IS NOT NULL
     GROUP BY c.id`,
    [`%${query}%`]
  );

import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('steps.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS step_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      steps INTEGER,
      calories REAL
    );
  `);
};

export const insertOrUpdateStepData = async (date, steps, calories) => {
  await db.runAsync(
    `INSERT INTO step_data (date, steps, calories)
     VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET steps = ?, calories = ?;`,
    [date, steps, calories, steps, calories]
  );
};

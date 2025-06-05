
import * as FileSystem from 'expo-file-system';
import { getUserId } from './storage';

const bodyTrackingDir = `${FileSystem.documentDirectory}bodyTracking`;

const ensureDirExists = async (path) => {
    const dirInfo = await FileSystem.getInfoAsync(path);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    }
};

export const getUserBodyTrackingDir = async () => {
    const userId = await getUserId();
    if (!userId) throw new Error('Kullanıcı ID bulunamadı');

    const userDir = `${bodyTrackingDir}/${userId}`;
    await ensureDirExists(userDir);
    return userDir;
};

export const saveBodyImage = async (imageUri) => {
    const userDir = await getUserBodyTrackingDir();
    const timestamp = Date.now();
    const newFileName = `${userDir}/${timestamp}.jpg`;

    await FileSystem.copyAsync({
        from: imageUri,
        to: newFileName
    });

    return newFileName;
};

export const getUserBodyImages = async () => {
    try {
        const userDir = await getUserBodyTrackingDir();
        const files = await FileSystem.readDirectoryAsync(userDir);

        return files
            .filter(file => file.endsWith('.jpg'))
            .map(file => ({
                name: file,
                path: `${userDir}/${file}`,
                uri: `${userDir}/${file}`
            }))
            .sort((a, b) => parseInt(b.name.split('.')[0]) - parseInt(a.name.split('.')[0]));
    } catch (error) {
        console.error('Resimler yüklenirken hata:', error);
        return [];
    }
};


// utils/fileSystem.js (mevcut fonksiyonlara ek olarak)
export const deleteBodyImage = async (imagePath) => {
    try {
        await FileSystem.deleteAsync(imagePath);
        return true;
    } catch (error) {
        console.error('Resim silinirken hata:', error);
        throw error;
    }
};
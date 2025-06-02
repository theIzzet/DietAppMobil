
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUserBodyImages, saveBodyImage, deleteBodyImage } from '../utils/fileSystem';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const BodyTrackingScreen = () => {
    const [images, setImages] = useState([]);
    const { isDark } = useTheme();
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin gerekiyor', 'Fotoğraflara erişim için izin gereklidir');
            }
            loadImages();
        })();
    }, []);

    const loadImages = async () => {
        try {
            const userImages = await getUserBodyImages();
            setImages(userImages);
        } catch (error) {
            console.error('Resimler yüklenirken hata:', error);
            Alert.alert('Hata', 'Resimler yüklenirken bir sorun oluştu');
        }
    };

    const handleAddPhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                await saveBodyImage(result.assets[0].uri);
                await loadImages();
            }
        } catch (error) {
            console.error('Resim eklenirken hata:', error);
            Alert.alert('Hata', 'Resim eklenirken bir sorun oluştu');
        }
    };

    const handleDeleteImage = async () => {
        try {
            await deleteBodyImage(selectedImage.path);
            setModalVisible(false);
            await loadImages();
            Alert.alert('Başarılı', 'Fotoğraf başarıyla silindi');
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
            Alert.alert('Hata', 'Fotoğraf silinirken bir hata oluştu');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedImage(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={[styles.dateText, { color: isDark ? '#fff' : '#000' }]}>
                    {new Date(parseInt(item.name.split('.')[0])).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Vücut Form Takibi</Text>
                <TouchableOpacity onPress={handleAddPhoto}>
                    <Ionicons name="add-circle-outline" size={32} color={isDark ? '#fff' : '#2563eb'} />
                </TouchableOpacity>
            </View>

            {images.length > 0 ? (
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="images-outline" size={64} color={isDark ? '#94a3b8' : '#cbd5e1'} />
                    <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#cbd5e1' }]}>
                        Henüz fotoğraf eklenmedi
                    </Text>
                </View>
            )}

            {/* Silme Onay Modalı */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: isDark ? '#334155' : '#fff' }]}>
                        <Text style={[styles.modalText, { color: isDark ? '#fff' : '#000' }]}>
                            Bu fotoğrafı silmek istediğinize emin misiniz?
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Vazgeç</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonDelete]}
                                onPress={handleDeleteImage}
                            >
                                <Text style={styles.textStyle}>Sil</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        padding: 8,
    },
    listContent: {
        paddingBottom: 20,
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        marginTop: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        width: '45%',
    },
    buttonCancel: {
        backgroundColor: '#6b7280',
    },
    buttonDelete: {
        backgroundColor: '#ef4444',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default BodyTrackingScreen;
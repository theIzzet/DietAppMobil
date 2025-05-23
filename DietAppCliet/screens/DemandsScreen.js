import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api';
import { BASE_URL } from '../src/constants';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const DemandsScreen = ({ navigation }) => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState('pending'); // 'pending', 'approved', 'rejected'

    const fetchDemands = async () => {
        try {
            const response = await api.get('/demand/received');

            // Veri yapısını dönüştür
            const transformedDemands = response.data.map(demand => ({
                id: demand.id,
                clientId: demand.senderId,
                clientName: demand.senderName || 'Bilinmeyen Kullanıcı',
                sendTime: demand.sendTime,
                state: demand.state,
                profilePhotoPath: demand.profilePhotoPath || null
            }));

            console.log('Transformed Demands:', transformedDemands);
            setDemands(transformedDemands);
        } catch (error) {
            console.error('Error fetching demands:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDemands();
            return () => { };
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDemands();
    };

    const handleStatusChange = async (demandId, isApproved) => {
        try {
            console.log(`Talep ${demandId} için ${isApproved ? 'onaylama' : 'reddetme'} işlemi başlatılıyor`);

            const payload = {
                isApproved,
                ...(!isApproved && { rejectionReason: "Diyetisyen tarafından reddedildi" })
            };

            const response = await api.put(`/demand/${demandId}`, payload);

            Alert.alert(
                "Başarılı",
                isApproved ? "Talep onaylandı" : "Talep reddedildi",
                [{ text: "Tamam", onPress: () => fetchDemands() }]
            );
        } catch (error) {
            console.error('Hata detayı:', error);
            Alert.alert(
                "Hata",
                error.response?.data?.message || "Talep durumu güncellenirken bir hata oluştu"
            );
        }
    };


    const filteredDemands = demands.filter(demand => {
        if (selectedTab === 'pending') return demand.state === 'Bekliyor';
        if (selectedTab === 'approved') return demand.state === 'Onaylandı';
        if (selectedTab === 'rejected') return demand.state === 'Reddedildi';
        return true;
    });

    const renderDemandItem = ({ item }) => (
        <View style={[
            styles.demandCard,
            item.state === 'Onaylandı' && styles.approvedCard,
            item.state === 'Reddedildi' && styles.rejectedCard
        ]}>
            <View style={styles.demandHeader}>
                {item.profilePhotoPath ? (
                    <Image
                        source={{ uri: `${BASE_URL}/${item.profilePhotoPath}` }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profilePlaceholder}>
                        <Ionicons name="person" size={24} color="#fff" />
                    </View>
                )}
                <View style={styles.demandInfo}>
                    <Text style={styles.clientName}>{item.clientName}</Text>
                    <Text style={styles.demandTime}>
                        {formatDistanceToNow(new Date(item.sendTime), { addSuffix: true, locale: tr })}
                    </Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.state === 'Onaylandı' && styles.approvedBadge,
                    item.state === 'Reddedildi' && styles.rejectedBadge
                ]}>
                    <Text style={styles.statusText}>{item.state}</Text>
                </View>
            </View>

            {item.state === 'Bekliyor' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleStatusChange(item.id, true)}
                    >
                        <Ionicons name="checkmark" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Onayla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleStatusChange(item.id, false)}
                    >
                        <Ionicons name="close" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Reddet</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a11cb" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danışan Talepleri</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'pending' && styles.activeTab]}
                    onPress={() => setSelectedTab('pending')}
                >
                    <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>Bekleyenler</Text>
                    {selectedTab === 'pending' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'approved' && styles.activeTab]}
                    onPress={() => setSelectedTab('approved')}
                >
                    <Text style={[styles.tabText, selectedTab === 'approved' && styles.activeTabText]}>Onaylananlar</Text>
                    {selectedTab === 'approved' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'rejected' && styles.activeTab]}
                    onPress={() => setSelectedTab('rejected')}
                >
                    <Text style={[styles.tabText, selectedTab === 'rejected' && styles.activeTabText]}>Reddedilenler</Text>
                    {selectedTab === 'rejected' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            {filteredDemands.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>
                        {selectedTab === 'pending'
                            ? 'Bekleyen talep bulunmamaktadır'
                            : selectedTab === 'approved'
                                ? 'Onaylanan talep bulunmamaktadır'
                                : 'Reddedilen talep bulunmamaktadır'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredDemands}
                    renderItem={renderDemandItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#6a11cb']}
                            tintColor={'#6a11cb'}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        position: 'relative',
    },
    activeTab: {
        backgroundColor: '#f8f9fa',
    },
    tabText: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#6a11cb',
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: '100%',
        backgroundColor: '#6a11cb',
    },
    listContent: {
        padding: 15,
    },
    demandCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    approvedCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    rejectedCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
    },
    demandHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    profilePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6a11cb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    demandInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    demandTime: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 3,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: '#FFC107',
    },
    approvedBadge: {
        backgroundColor: '#4CAF50',
    },
    rejectedBadge: {
        backgroundColor: '#F44336',
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default DemandsScreen;
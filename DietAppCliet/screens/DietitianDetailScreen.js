

// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     StyleSheet,
//     Image,
//     TouchableOpacity,
//     FlatList,
//     Modal,
//     TextInput,
//     Dimensions,
//     Animated,
//     Easing, ActivityIndicator
// } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import api from '../api';
// import { BASE_URL } from '../src/constants';
// import { getToken } from '../utils/storage';
// import { AirbnbRating } from 'react-native-ratings';
// import { Rating } from 'react-native-ratings';

// const { width } = Dimensions.get('window');

// const DietitianDetailScreen = ({ route, navigation }) => {
//     const { dietitianId } = route.params;
//     const [dietitian, setDietitian] = useState({
//         specialties: [],
//         dietTypes: [],
//         certificates: [],
//         experience: [],
//         comments: []
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState('about');
//     const [commentModalVisible, setCommentModalVisible] = useState(false);
//     const [newComment, setNewComment] = useState('');
//     const [rating, setRating] = useState(5);
//     const [spinValue] = useState(new Animated.Value(0));
//     const [flipValue] = useState(new Animated.Value(0));

//     // Flip animation for the profile card
//     const flipAnimation = () => {
//         Animated.timing(flipValue, {
//             toValue: 180,
//             duration: 800,
//             easing: Easing.linear,
//             useNativeDriver: true,
//         }).start();
//     };

//     // Spin animation for the star rating
//     const spinAnimation = () => {
//         spinValue.setValue(0);
//         Animated.timing(spinValue, {
//             toValue: 1,
//             duration: 1500,
//             easing: Easing.linear,
//             useNativeDriver: true,
//         }).start();
//     };

//     const spin = spinValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });

//     const frontInterpolate = flipValue.interpolate({
//         inputRange: [0, 180],
//         outputRange: ['0deg', '180deg'],
//     });

//     const backInterpolate = flipValue.interpolate({
//         inputRange: [0, 180],
//         outputRange: ['180deg', '360deg'],
//     });

//     const frontAnimatedStyle = {
//         transform: [{ rotateY: frontInterpolate }],
//     };

//     const backAnimatedStyle = {
//         transform: [{ rotateY: backInterpolate }],
//     };

//     // API'den gelen veriyi işleme kısmını güncelleyin
//     useEffect(() => {
//         const fetchDietitianDetails = async () => {
//             try {
//                 const res = await api.get(`/diettypemanagement/dietitians/${dietitianId}`);
//                 const data = res.data;

//                 // specialties string olarak geliyorsa array'e çevir
//                 const specialties = typeof data.specialties === 'string' ?
//                     data.specialties.split(',').map(s => s.trim()) :
//                     (Array.isArray(data.specialties) ? data.specialties : []);

//                 setDietitian({
//                     ...data,
//                     specialties, // Düzgün formatlanmış specialties
//                     certificates: data.certificates || [],
//                     experience: data.experience || [],
//                     comments: data.comments || [],
//                     dietTypes: data.dietTypes || []
//                 });

//                 spinAnimation();
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDietitianDetails();
//     }, [dietitianId]);


//     const renderCertificates = () => {
//         return dietitian.certificates.map((item) => (
//             <View key={item.id.toString()} style={styles.certificateCard}>
//                 <View style={styles.certificateHeader}>
//                     <MaterialIcons name="verified" size={24} color="#4CAF50" />
//                     <Text style={styles.certificateTitle}>{item.certificateName}</Text>
//                 </View>
//                 <Text style={styles.certificateIssuer}>{item.issuer}</Text>
//                 <Text style={styles.certificateDate}>
//                     {new Date(item.dateReceived).toLocaleDateString()}
//                 </Text>
//                 {item.qualificationUrl && (
//                     <TouchableOpacity style={styles.linkButton}>
//                         <Text style={styles.linkText}>Sertifika Linki</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         ));
//     };

//     const renderExperience = () => {
//         return dietitian.experience.map((item) => (
//             <View key={item.id.toString()} style={styles.experienceCard}>
//                 <View style={styles.experienceHeader}>
//                     <View style={styles.experienceBullet} />
//                     <Text style={styles.experiencePosition}>{item.position}</Text>
//                 </View>
//                 <Text style={styles.experienceInstitution}>{item.institution}</Text>
//                 <Text style={styles.experienceDate}>
//                     {new Date(item.startDate).toLocaleDateString()} -{' '}
//                     {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Devam ediyor'}
//                 </Text>
//             </View>
//         ));
//     };

//     const renderComments = () => {
//         return dietitian.comments.map((item) => (
//             <View key={item.commentId.toString()} style={styles.commentCard}>
//                 <View style={styles.commentHeader}>
//                     <Text style={styles.commentAuthor}>
//                         {item.userName} {item.userSurname}
//                     </Text>
//                     <View style={styles.commentRating}>
//                         {[...Array(5)].map((_, i) => (
//                             <FontAwesome
//                                 key={i}
//                                 name={i < item.rating ? 'star' : 'star-o'}
//                                 size={16}
//                                 color="#FFD700"
//                             />
//                         ))}
//                     </View>
//                 </View>
//                 <Text style={styles.commentDate}>
//                     {new Date(item.publishedOn).toLocaleDateString()}
//                 </Text>
//                 <Text style={styles.commentText}>{item.commentText}</Text>
//             </View>
//         ));
//     };


//     const handleAddComment = async () => {
//         try {
//             const token = await getToken();
//             if (!token) {
//                 navigation.navigate('Login');
//                 return;
//             }

//             await api.post(`/diettypemanagement/dietitians/${dietitianId}/comments`, {
//                 commentText: newComment,
//                 rating: rating
//             });

//             // Refresh comments
//             const res = await api.get(`/diettypemanagement/dietitians/${dietitianId}`);
//             setDietitian(res.data);
//             setCommentModalVisible(false);
//             setNewComment('');
//             setRating(5);
//         } catch (err) {
//             console.error('Error adding comment:', err);
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#6a11cb" />
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//             </View>
//         );
//     }

//     if (!dietitian) {
//         return null;
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <LinearGradient
//                 colors={['#6a11cb', '#2575fc']}
//                 style={styles.header}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Diyetisyen Profili</Text>
//                 <View style={{ width: 24 }} /> {/* For balance */}
//             </LinearGradient>

//             <ScrollView contentContainerStyle={styles.contentContainer}>
//                 {/* Profile Card with Flip Animation */}
//                 <View style={styles.profileCardContainer}>
//                     <TouchableOpacity activeOpacity={0.9} onPress={flipAnimation}>
//                         <Animated.View style={[styles.profileCardFront, frontAnimatedStyle, {
//                             backfaceVisibility: 'hidden',
//                             position: flipValue >= 90 ? 'absolute' : 'relative'
//                         }]}>
//                             <LinearGradient
//                                 colors={['#6a11cb', '#2575fc']}
//                                 style={styles.profileCard}
//                             >
//                                 {dietitian.profilePhotoPath && (
//                                     <Image
//                                         source={{ uri: `${BASE_URL}/${dietitian.profilePhotoPath}` }}
//                                         style={styles.profileImage}
//                                     />
//                                 )}
//                                 <Text style={styles.profileName}>{dietitian.name} {dietitian.surname}</Text>
//                                 <Text style={styles.profileClinic}>{dietitian.clinicName || 'Bağımsız Diyetisyen'}</Text>

//                                 <View style={styles.ratingContainer}>
//                                     <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                                         <FontAwesome name="star" size={24} color="#FFD700" />
//                                     </Animated.View>
//                                     <Text style={styles.ratingText}>
//                                         {dietitian.averageRating?.toFixed(1) || 'Yeni'}
//                                     </Text>
//                                 </View>
//                             </LinearGradient>
//                         </Animated.View>

//                         <Animated.View style={[styles.profileCardBack, backAnimatedStyle, {
//                             backfaceVisibility: 'hidden',
//                             position: flipValue >= 90 ? 'relative' : 'absolute'
//                         }]}>
//                             <LinearGradient
//                                 colors={['#2575fc', '#6a11cb']}
//                                 style={styles.profileCard}
//                             >
//                                 <View style={styles.specialtiesContainer}>
//                                     <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
//                                     <View style={styles.specialtiesList}>
//                                         {dietitian.specialties?.map((specialty, index) => (
//                                             <View key={index} style={styles.specialtyBadge}>
//                                                 <Text style={styles.specialtyText}>{specialty}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 </View>
//                                 <View style={styles.dietTypesContainer}>
//                                     <Text style={styles.sectionTitle}>Verdiği Diyet Türleri</Text>
//                                     <View style={styles.dietTypesList}>
//                                         {dietitian.dietTypes?.map((dietType) => (
//                                             <View key={dietType.id} style={styles.dietTypeBadge}>
//                                                 <Text style={styles.dietTypeText}>{dietType.title}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 </View>
//                             </LinearGradient>
//                         </Animated.View>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Tabs */}
//                 <View style={styles.tabsContainer}>
//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === 'about' && styles.activeTab]}
//                         onPress={() => setActiveTab('about')}
//                     >
//                         <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>Hakkında</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === 'certificates' && styles.activeTab]}
//                         onPress={() => setActiveTab('certificates')}
//                     >
//                         <Text style={[styles.tabText, activeTab === 'certificates' && styles.activeTabText]}>Sertifikalar</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === 'experience' && styles.activeTab]}
//                         onPress={() => setActiveTab('experience')}
//                     >
//                         <Text style={[styles.tabText, activeTab === 'experience' && styles.activeTabText]}>Deneyimler</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
//                         onPress={() => setActiveTab('comments')}
//                     >
//                         <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Yorumlar</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Tab Content */}
//                 <View style={styles.tabContent}>
//                     {activeTab === 'about' && (
//                         <View style={styles.aboutContainer}>
//                             <Text style={styles.aboutTitle}>Hakkımda</Text>
//                             <Text style={styles.aboutText}>{dietitian.about || 'Diyetisyen henüz bir açıklama eklememiş.'}</Text>

//                             <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
//                             <View style={styles.specialtiesList}>
//                                 {dietitian.specialties.map((specialty, index) => (
//                                     <View key={index} style={styles.specialtyBadge}>
//                                         <Text style={styles.specialtyText}>{specialty}</Text>
//                                     </View>
//                                 ))}
//                             </View>

//                             <Text style={styles.sectionTitle}>Verdiği Diyet Türleri</Text>
//                             <View style={styles.dietTypesList}>
//                                 {dietitian.dietTypes.map((dietType) => (
//                                     <View key={dietType.id} style={styles.dietTypeBadge}>
//                                         <Text style={styles.dietTypeText}>{dietType.title}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         </View>
//                     )}

//                     {activeTab === 'certificates' && (
//                         <View style={styles.certificatesContainer}>
//                             {dietitian.certificates.length > 0 ? (
//                                 renderCertificates()
//                             ) : (
//                                 <Text style={styles.noContentText}>Sertifika bilgisi bulunamadı.</Text>
//                             )}
//                         </View>
//                     )}

//                     {activeTab === 'experience' && (
//                         <View style={styles.experienceContainer}>
//                             {dietitian.experience.length > 0 ? (
//                                 renderExperience()
//                             ) : (
//                                 <Text style={styles.noContentText}>Deneyim bilgisi bulunamadı.</Text>
//                             )}
//                         </View>
//                     )}

//                     {activeTab === 'comments' && (
//                         <View style={styles.commentsContainer}>
//                             <TouchableOpacity
//                                 style={styles.addCommentButton}
//                                 onPress={() => setCommentModalVisible(true)}
//                             >
//                                 <Text style={styles.addCommentButtonText}>Yorum Ekle</Text>
//                             </TouchableOpacity>

//                             {dietitian.comments.length > 0 ? (
//                                 renderComments()
//                             ) : (
//                                 <Text style={styles.noContentText}>Henüz yorum yapılmamış.</Text>
//                             )}
//                         </View>
//                     )}
//                 </View>
//             </ScrollView>

//             {/* Add Comment Modal */}
//             {/* Add Comment Modal */}
//             {/* Add Comment Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={commentModalVisible}
//                 onRequestClose={() => setCommentModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Yorum Ekle</Text>

//                         <Text style={styles.ratingLabel}>Değerlendirme:</Text>

//                         {/* Yıldız değerlendirme bileşeni */}
//                         <View style={styles.ratingStarsContainer}>
//                             <Rating
//                                 type='star'
//                                 ratingCount={5}
//                                 imageSize={30}
//                                 startingValue={rating}
//                                 onFinishRating={(rating) => setRating(rating)}
//                                 style={styles.ratingStarsContainer}
//                             />
//                         </View>

//                         <TextInput
//                             style={styles.commentInput}
//                             multiline
//                             placeholder="Yorumunuzu buraya yazın..."
//                             value={newComment}
//                             onChangeText={setNewComment}
//                         />

//                         <View style={styles.modalButtons}>
//                             <TouchableOpacity
//                                 style={[styles.modalButton, styles.cancelButton]}
//                                 onPress={() => setCommentModalVisible(false)}
//                             >
//                                 <Text style={styles.modalButtonText}>İptal</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[styles.modalButton, styles.submitButton]}
//                                 onPress={handleAddComment}
//                             >
//                                 <Text style={styles.modalButtonText}>Gönder</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     header: {
//         paddingTop: 50,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 5,
//     },
//     backButton: {
//         padding: 5,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     contentContainer: {
//         paddingBottom: 20,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 16,
//     },
//     profileCardContainer: {
//         padding: 20,
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 250,
//         perspective: 1000,
//     },
//     profileCardFront: {
//         width: width - 40,
//         height: 220,
//         borderRadius: 15,
//         overflow: 'hidden',
//         backfaceVisibility: 'hidden',
//     },
//     profileCardBack: {
//         width: width - 40,
//         height: 220,
//         borderRadius: 15,
//         overflow: 'hidden',
//         backfaceVisibility: 'hidden',
//     },
//     profileCard: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//     },
//     profileImage: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         borderWidth: 3,
//         borderColor: 'rgba(255,255,255,0.5)',
//         marginBottom: 10,
//     },
//     profileName: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#fff',
//         marginBottom: 5,
//     },
//     profileClinic: {
//         fontSize: 16,
//         color: 'rgba(255,255,255,0.8)',
//         marginBottom: 10,
//     },
//     ratingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     ratingText: {
//         fontSize: 18,
//         color: '#fff',
//         fontWeight: 'bold',
//         marginLeft: 5,
//     },
//     specialtiesContainer: {
//         marginBottom: 15,
//         alignItems: 'center',
//     },
//     dietTypesContainer: {
//         alignItems: 'center',
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#fff',
//         marginBottom: 10,
//     },
//     specialtiesList: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//     },
//     specialtyBadge: {
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         borderRadius: 15,
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//         margin: 3,
//     },
//     specialtyText: {
//         color: '#fff',
//         fontSize: 12,
//     },
//     dietTypesList: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//     },
//     dietTypeBadge: {
//         backgroundColor: 'rgba(255,255,255,0.3)',
//         borderRadius: 15,
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//         margin: 3,
//     },
//     dietTypeText: {
//         color: '#fff',
//         fontSize: 12,
//     },
//     tabsContainer: {
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//         marginHorizontal: 20,
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//         borderBottomWidth: 2,
//         borderBottomColor: 'transparent',
//     },
//     activeTab: {
//         borderBottomColor: '#6a11cb',
//     },
//     tabText: {
//         fontSize: 14,
//         color: '#6c757d',
//     },
//     activeTabText: {
//         color: '#6a11cb',
//         fontWeight: 'bold',
//     },
//     tabContent: {
//         padding: 20,
//     },
//     aboutContainer: {},
//     aboutTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#212529',
//         marginBottom: 10,
//     },
//     aboutText: {
//         fontSize: 14,
//         color: '#495057',
//         lineHeight: 22,
//         marginBottom: 15,
//     },
//     infoRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     infoText: {
//         fontSize: 14,
//         color: '#495057',
//         marginLeft: 10,
//     },
//     certificatesContainer: {},
//     certificateCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 2,
//     },
//     certificateHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 5,
//     },
//     certificateTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#212529',
//         marginLeft: 10,
//     },
//     certificateIssuer: {
//         fontSize: 14,
//         color: '#6c757d',
//         marginBottom: 3,
//     },
//     certificateDate: {
//         fontSize: 12,
//         color: '#adb5bd',
//         marginBottom: 10,
//     },
//     linkButton: {
//         alignSelf: 'flex-start',
//         paddingVertical: 5,
//         paddingHorizontal: 10,
//         backgroundColor: '#e9ecef',
//         borderRadius: 5,
//     },
//     linkText: {
//         color: '#2575fc',
//         fontSize: 12,
//     },
//     experienceContainer: {},
//     experienceCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 2,
//     },
//     experienceHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 5,
//     },
//     experienceBullet: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#6a11cb',
//         marginRight: 10,
//     },
//     experiencePosition: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#212529',
//     },
//     experienceInstitution: {
//         fontSize: 14,
//         color: '#6c757d',
//         marginBottom: 3,
//         marginLeft: 18,
//     },
//     experienceDate: {
//         fontSize: 12,
//         color: '#adb5bd',
//         marginLeft: 18,
//     },
//     commentsContainer: {},
//     addCommentButton: {
//         backgroundColor: '#6a11cb',
//         borderRadius: 25,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         alignSelf: 'center',
//         marginBottom: 15,
//     },
//     addCommentButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     commentCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 2,
//     },
//     commentHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 5,
//     },
//     commentAuthor: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#212529',
//     },
//     commentRating: {
//         flexDirection: 'row',
//     },
//     commentDate: {
//         fontSize: 12,
//         color: '#adb5bd',
//         marginBottom: 8,
//     },
//     commentText: {
//         fontSize: 14,
//         color: '#495057',
//         lineHeight: 20,
//     },
//     noContentText: {
//         textAlign: 'center',
//         color: '#6c757d',
//         fontSize: 14,
//         marginTop: 20,
//     }, modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalContainer: {
//         width: width - 40,
//         maxHeight: '80%', // Maksimum yükseklik ekranın %80'i
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         overflow: 'hidden', // İçerik taşmasını engeller
//     },
//     modalContent: {
//         padding: 20,
//     },
//     ratingContainer: {
//         marginBottom: 15,
//         alignItems: 'center',
//     },
//     starRatingContainer: {
//         paddingVertical: 10,
//     },
//     ratingStarsContainer: {
//         marginBottom: 20,
//         alignItems: 'center',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',

//     },
//     modalContent: {
//         width: width - 40,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//         maxHeight: '80%',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#212529',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     ratingLabel: {
//         fontSize: 14,
//         color: '#495057',
//         marginBottom: 5,
//     },
//     // starRatingContainer: {
//     //     marginBottom: 15,
//     //     width: '100%',
//     //     justifyContent: 'center',
//     // },
//     starRatingContainer: {
//         marginBottom: 15,
//         alignSelf: 'center',
//     },
//     commentInput: {
//         height: 100,
//         borderColor: '#e0e0e0',
//         borderWidth: 1,
//         borderRadius: 5,
//         padding: 10,
//         marginBottom: 15,
//         textAlignVertical: 'top',
//     },
//     modalButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     modalButton: {
//         flex: 1,
//         paddingVertical: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginHorizontal: 5,
//     },
//     cancelButton: {
//         backgroundColor: '#e9ecef',
//     },
//     submitButton: {
//         backgroundColor: '#6a11cb',
//     },
//     modalButtonText: {
//         fontWeight: 'bold',
//     },
// });

// export default DietitianDetailScreen;








import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Dimensions,
    Animated,
    Easing,
    ActivityIndicator, Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../api';
import { BASE_URL } from '../src/constants';
import { getToken } from '../utils/storage';
import { Rating } from 'react-native-ratings';

const { width } = Dimensions.get('window');

const DietitianDetailScreen = ({ route, navigation }) => {
    const { dietitianId } = route.params;
    const [dietitian, setDietitian] = useState({
        name: '',
        surname: '',
        about: '',
        profilePhotoPath: '',
        specialties: [],
        workHours: '',
        clinicName: '',
        dietTypes: [],
        certificates: [],
        experience: [],
        comments: [],
        averageRating: 0
    });
    const [isSending, setIsSending] = useState(false);
    const [demandStatus, setDemandStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about');
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [spinValue] = useState(new Animated.Value(0));
    const [flipValue] = useState(new Animated.Value(0));

    const spinAnimation = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const flipAnimation = () => {
        Animated.timing(flipValue, {
            toValue: 180,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const frontInterpolate = flipValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    useEffect(() => {
        const fetchDietitianDetails = async () => {
            try {
                const res = await api.get(`/diettypemanagement/dietitians/${dietitianId}`);
                const data = res.data;

                // specialties'i düzgün bir şekilde formatla
                let specialties = [];
                if (typeof data.specialties === 'string') {
                    specialties = data.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0);
                } else if (Array.isArray(data.specialties)) {
                    specialties = data.specialties;
                }

                setDietitian({
                    ...data,
                    specialties,
                    certificates: data.certificates || [],
                    experience: data.experience || [],
                    comments: data.comments || [],
                    dietTypes: data.dietTypes || [],
                    averageRating: data.averageRating || 0
                });

                spinAnimation();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDietitianDetails();
    }, [dietitianId]);
    const handleSendDemand = async () => {
        try {
            setIsSending(true);
            const token = await getToken();
            if (!token) {
                navigation.navigate('Login');
                return;
            }

            const response = await api.post('/demand', {
                dietitianId: dietitianId
            });

            setDemandStatus("pending");
            Alert.alert("Başarılı", "Talep başarıyla gönderildi.");
        } catch (error) {
            console.error('Error sending demand:', error);
            Alert.alert("Hata", error.response?.data?.message || "Talep gönderilirken bir hata oluştu.");
        } finally {
            setIsSending(false);
        }
    };
    const renderCertificates = () => {
        if (!dietitian.certificates || dietitian.certificates.length === 0) {
            return (
                <View style={styles.noContentContainer}>
                    <MaterialIcons name="picture-as-pdf" size={40} color="#ccc" />
                    <Text style={styles.noContentText}>Sertifika bilgisi bulunamadı</Text>
                </View>
            );
        }

        return dietitian.certificates.map((item) => (
            <View key={item.id?.toString() || Math.random().toString()} style={styles.certificateCard}>
                <View style={styles.certificateHeader}>
                    <MaterialIcons name="verified" size={24} color="#4CAF50" />
                    <Text style={styles.certificateTitle}>{item.certificateName || 'Sertifika'}</Text>
                </View>
                {item.issuer && <Text style={styles.certificateIssuer}>{item.issuer}</Text>}
                {item.dateReceived && (
                    <Text style={styles.certificateDate}>
                        {new Date(item.dateReceived).toLocaleDateString()}
                    </Text>
                )}
                {item.qualificationUrl && (
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Sertifika Linki</Text>
                    </TouchableOpacity>
                )}
            </View>
        ));
    };

    const renderExperience = () => {
        if (!dietitian.experience || dietitian.experience.length === 0) {
            return (
                <View style={styles.noContentContainer}>
                    <Ionicons name="briefcase" size={40} color="#ccc" />
                    <Text style={styles.noContentText}>Deneyim bilgisi bulunamadı</Text>
                </View>
            );
        }

        return dietitian.experience.map((item) => (
            <View key={item.id?.toString() || Math.random().toString()} style={styles.experienceCard}>
                <View style={styles.experienceHeader}>
                    <View style={styles.experienceBullet} />
                    <Text style={styles.experiencePosition}>{item.position || 'Pozisyon'}</Text>
                </View>
                {item.institution && <Text style={styles.experienceInstitution}>{item.institution}</Text>}
                <Text style={styles.experienceDate}>
                    {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Başlangıç tarihi belirtilmemiş'} -{' '}
                    {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Devam ediyor'}
                </Text>
            </View>
        ));
    };

    const renderComments = () => {
        if (!dietitian.comments || dietitian.comments.length === 0) {
            return (
                <View style={styles.noContentContainer}>
                    <FontAwesome name="comment-o" size={40} color="#ccc" />
                    <Text style={styles.noContentText}>Henüz yorum yapılmamış</Text>
                </View>
            );
        }

        return dietitian.comments.map((item) => (
            <View key={item.commentId?.toString() || Math.random().toString()} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                        {item.userName || 'Kullanıcı'} {item.userSurname || ''}
                    </Text>
                    <View style={styles.commentRating}>
                        {[...Array(5)].map((_, i) => (
                            <FontAwesome
                                key={i}
                                name={i < (item.rating || 0) ? 'star' : 'star-o'}
                                size={16}
                                color="#FFD700"
                            />
                        ))}
                    </View>
                </View>
                <Text style={styles.commentDate}>
                    {item.publishedOn ? new Date(item.publishedOn).toLocaleDateString() : 'Tarih belirtilmemiş'}
                </Text>
                {item.commentText && <Text style={styles.commentText}>{item.commentText}</Text>}
            </View>
        ));
    };

    const handleAddComment = async () => {
        try {
            const token = await getToken();
            if (!token) {
                navigation.navigate('Login');
                return;
            }

            await api.post(`/diettypemanagement/dietitians/${dietitianId}/comments`, {
                commentText: newComment,
                rating: rating
            });

            // Refresh comments
            const res = await api.get(`/diettypemanagement/dietitians/${dietitianId}`);
            const data = res.data;

            let specialties = [];
            if (typeof data.specialties === 'string') {
                specialties = data.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0);
            } else if (Array.isArray(data.specialties)) {
                specialties = data.specialties;
            }

            setDietitian({
                ...data,
                specialties,
                certificates: data.certificates || [],
                experience: data.experience || [],
                comments: data.comments || [],
                dietTypes: data.dietTypes || []
            });

            setCommentModalVisible(false);
            setNewComment('');
            setRating(5);
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a11cb" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#6a11cb', '#2575fc']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Diyetisyen Profili</Text>
                <View style={{ width: 24 }} />
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Profile Card with Flip Animation */}
                <View style={styles.profileCardContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={flipAnimation}>
                        <Animated.View style={[styles.profileCardFront, frontAnimatedStyle, {
                            backfaceVisibility: 'hidden',
                            position: flipValue >= 90 ? 'absolute' : 'relative'
                        }]}>
                            <LinearGradient
                                colors={['#6a11cb', '#2575fc']}
                                style={styles.profileCard}
                            >
                                {dietitian.profilePhotoPath ? (
                                    <Image
                                        source={{ uri: `${BASE_URL}/${dietitian.profilePhotoPath}` }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style={styles.profileImagePlaceholder}>
                                        <Ionicons name="person" size={40} color="#fff" />
                                    </View>
                                )}
                                <Text style={styles.profileName}>{dietitian.name} {dietitian.surname}</Text>
                                <Text style={styles.profileClinic}>{dietitian.clinicName || 'Bağımsız Diyetisyen'}</Text>

                                <View style={styles.ratingContainer}>
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                        <FontAwesome name="star" size={24} color="#FFD700" />
                                    </Animated.View>
                                    <Text style={styles.ratingText}>
                                        {dietitian.averageRating?.toFixed(1) || 'Yeni'} ({dietitian.comments?.length || 0})
                                    </Text>
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        <Animated.View style={[styles.profileCardBack, backAnimatedStyle, {
                            backfaceVisibility: 'hidden',
                            position: flipValue >= 90 ? 'relative' : 'absolute'
                        }]}>
                            <LinearGradient
                                colors={['#2575fc', '#6a11cb']}
                                style={styles.profileCard}
                            >
                                <View style={styles.specialtiesContainer}>
                                    <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
                                    <View style={styles.specialtiesList}>
                                        {dietitian.specialties?.length > 0 ? (
                                            dietitian.specialties.map((specialty, index) => (
                                                <View key={index} style={styles.specialtyBadge}>
                                                    <Text style={styles.specialtyText}>{specialty}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.noInfoText}>Uzmanlık alanı belirtilmemiş</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.dietTypesContainer}>
                                    <Text style={styles.sectionTitle}>Verdiği Diyet Türleri</Text>
                                    <View style={styles.dietTypesList}>
                                        {dietitian.dietTypes?.length > 0 ? (
                                            dietitian.dietTypes.map((dietType) => (
                                                <View key={dietType.id} style={styles.dietTypeBadge}>
                                                    <Text style={styles.dietTypeText}>{dietType.title}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.noInfoText}>Diyet türü belirtilmemiş</Text>
                                        )}
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <View style={styles.demandButtonContainer}>
                    {demandStatus === null ? (
                        <TouchableOpacity
                            style={styles.sendDemandButton}
                            onPress={handleSendDemand}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.sendDemandButtonText}>Talep Gönder</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={[
                            styles.demandStatusBadge,
                            demandStatus === "pending" && styles.demandStatusPending,
                            demandStatus === "approved" && styles.demandStatusApproved,
                            demandStatus === "rejected" && styles.demandStatusRejected
                        ]}>
                            <Text style={styles.demandStatusText}>
                                {demandStatus === "pending" && "Talep Gönderildi"}
                                {demandStatus === "approved" && "Onaylandı"}
                                {demandStatus === "rejected" && "Reddedildi"}

                            </Text>
                        </View>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'about' && styles.activeTab]}
                        onPress={() => setActiveTab('about')}
                    >
                        <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>Hakkında</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'certificates' && styles.activeTab]}
                        onPress={() => setActiveTab('certificates')}
                    >
                        <Text style={[styles.tabText, activeTab === 'certificates' && styles.activeTabText]}>Sertifikalar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'experience' && styles.activeTab]}
                        onPress={() => setActiveTab('experience')}
                    >
                        <Text style={[styles.tabText, activeTab === 'experience' && styles.activeTabText]}>Deneyimler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
                        onPress={() => setActiveTab('comments')}
                    >
                        <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Yorumlar</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'about' && (
                        <View style={styles.aboutContainer}>
                            <Text style={styles.aboutTitle}>Hakkımda</Text>
                            <Text style={styles.aboutText}>
                                {dietitian.about || 'Diyetisyen henüz bir açıklama eklememiş.'}
                            </Text>

                            <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
                            <View style={styles.specialtiesList}>
                                {dietitian.specialties?.length > 0 ? (
                                    dietitian.specialties.map((specialty, index) => (
                                        <View key={index} style={styles.specialtyBadge}>
                                            <Text style={styles.specialtyText}>{specialty}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noInfoText}>Uzmanlık alanı belirtilmemiş</Text>
                                )}
                            </View>

                            <Text style={styles.sectionTitle}>Verdiği Diyet Türleri</Text>
                            <View style={styles.dietTypesList}>
                                {dietitian.dietTypes?.length > 0 ? (
                                    dietitian.dietTypes.map((dietType) => (
                                        <View key={dietType.id} style={styles.dietTypeBadge}>
                                            <Text style={styles.dietTypeText}>{dietType.title}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noInfoText}>Diyet türü belirtilmemiş</Text>
                                )}
                            </View>

                            <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
                            <Text style={styles.aboutText}>
                                {dietitian.workHours || 'Çalışma saatleri belirtilmemiş'}
                            </Text>
                        </View>
                    )}

                    {activeTab === 'certificates' && (
                        <View style={styles.certificatesContainer}>
                            {renderCertificates()}
                        </View>
                    )}

                    {activeTab === 'experience' && (
                        <View style={styles.experienceContainer}>
                            {renderExperience()}
                        </View>
                    )}

                    {activeTab === 'comments' && (
                        <View style={styles.commentsContainer}>
                            <TouchableOpacity
                                style={styles.addCommentButton}
                                onPress={() => setCommentModalVisible(true)}
                            >
                                <Text style={styles.addCommentButtonText}>Yorum Ekle</Text>
                            </TouchableOpacity>

                            {renderComments()}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Add Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Yorum Ekle</Text>

                            <Text style={styles.ratingLabel}>Değerlendirme:</Text>

                            <View style={styles.ratingStarsContainer}>
                                <Rating
                                    type='star'
                                    ratingCount={5}
                                    imageSize={30}
                                    startingValue={rating}
                                    onFinishRating={(rating) => setRating(rating)}
                                />
                            </View>

                            <TextInput
                                style={styles.commentInput}
                                multiline
                                placeholder="Yorumunuzu buraya yazın..."
                                value={newComment}
                                onChangeText={setNewComment}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setCommentModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>İptal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.submitButton, !newComment.trim() && styles.disabledButton]}
                                    onPress={handleAddComment}
                                    disabled={!newComment.trim()}
                                >
                                    <Text style={styles.modalButtonText}>Gönder</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
    },
    backButtonText: {
        color: '#6a11cb',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    profileCardContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 250,
        perspective: 1000,
    },
    profileCardFront: {
        width: width - 40,
        height: 220,
        borderRadius: 15,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
    },
    profileCardBack: {
        width: width - 40,
        height: 220,
        borderRadius: 15,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
    },
    profileCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
        marginBottom: 10,
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    profileClinic: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    specialtiesContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    dietTypesContainer: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    specialtiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    specialtyBadge: {
        backgroundColor: 'rgba(255,255,255,0.7)', // Daha opak beyaz
        borderRadius: 15,
        paddingHorizontal: 15, // Daha geniş padding
        paddingVertical: 8,
        margin: 5,
    },
    specialtyText: {
        color: '#6a11cb', // Mor renkli metin
        fontSize: 14, // Daha büyük font
        fontWeight: '600', // Daha kalın
    },

    dietTypeBadge: {
        backgroundColor: 'rgba(255,255,255,0.7)', // Daha opak beyaz
        borderRadius: 15,
        paddingHorizontal: 15, // Daha geniş padding
        paddingVertical: 8,
        margin: 5,
    },
    dietTypeText: {
        color: '#2575fc', // Mavi renkli metin
        fontSize: 14, // Daha büyük font
        fontWeight: '600', // Daha kalın
    },
    dietTypesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    // dietTypeBadge: {
    //     backgroundColor: 'rgba(255,255,255,0.3)',
    //     borderRadius: 15,
    //     paddingHorizontal: 12,
    //     paddingVertical: 5,
    //     margin: 3,
    // },
    // dietTypeText: {
    //     color: '#fff',
    //     fontSize: 12,
    // },
    noInfoText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontStyle: 'italic',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginHorizontal: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#6a11cb',
    },
    tabText: {
        fontSize: 14,
        color: '#6c757d',
    },
    activeTabText: {
        color: '#6a11cb',
        fontWeight: 'bold',
    },
    tabContent: {
        padding: 20,
    },
    aboutContainer: {},
    aboutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 22,
        marginBottom: 15,
    },
    certificatesContainer: {},
    certificateCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    certificateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    certificateTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginLeft: 10,
    },
    certificateIssuer: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 3,
    },
    certificateDate: {
        fontSize: 12,
        color: '#adb5bd',
        marginBottom: 10,
    },
    linkButton: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 5,
    },
    linkText: {
        color: '#2575fc',
        fontSize: 12,
    },
    experienceContainer: {},
    experienceCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    experienceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    experienceBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6a11cb',
        marginRight: 10,
    },
    experiencePosition: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    experienceInstitution: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 3,
        marginLeft: 18,
    },
    experienceDate: {
        fontSize: 12,
        color: '#adb5bd',
        marginLeft: 18,
    },
    commentsContainer: {},
    addCommentButton: {
        backgroundColor: '#6a11cb',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginBottom: 15,
    },
    addCommentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212529',
    },
    commentRating: {
        flexDirection: 'row',
    },
    commentDate: {
        fontSize: 12,
        color: '#adb5bd',
        marginBottom: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    noContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    noContentText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: width - 40,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 15,
        textAlign: 'center',
    },
    ratingLabel: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 5,
    },
    ratingStarsContainer: {
        marginBottom: 15,
        alignSelf: 'center',
    },
    commentInput: {
        height: 100,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#e9ecef',
    },
    submitButton: {
        backgroundColor: '#6a11cb',
    },
    disabledButton: {
        opacity: 0.6,
    },
    modalButtonText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    demandButtonContainer: {
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    sendDemandButton: {
        backgroundColor: '#6a11cb',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    sendDemandButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    demandStatusBadge: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    demandStatusPending: {
        backgroundColor: '#FFC107',
    },
    demandStatusApproved: {
        backgroundColor: '#4CAF50',
    },
    demandStatusRejected: {
        backgroundColor: '#F44336',
    },
    demandStatusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default DietitianDetailScreen;
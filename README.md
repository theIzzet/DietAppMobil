# DietAppMobil

---
### Proje Açıklaması
Bu projenin amacı, diyet yapma sürecinde bireylerin ihtiyaç duyduğu uzman desteğine kolayca 
ulaşmasını sağlamak, diyetisyenlerle danışanları dijital ortamda bir araya getirerek etkin bir takip, 
iletişim ve geri bildirim mekanizması sunmaktır. Diyetisyenler farklı diyet alanlarında (örneğin sporcu 
diyeti, vegan diyeti vb.) uzmanlıklarını sisteme tanımlayabilirken, danışanlar ihtiyaçlarına göre seçim 
yapabilir, önceki kullanıcı yorumlarını inceleyebilir. Danışan istediği diyetisyene talep gönderebilir ve diyetisyenin talebi onaylaması durumunda artık diyetisyen hizmeti alabilir. Diyetisyen ilgili danışana özel bilgilerine göre ve isteklerine göre doğru programını hazırlar.

# Proje Kurulum
Projeyi klonlamak içim: git clone https://github.com/theIzzet/DietAppMobil.git

Proje Visual Stıdio Code aracılığıyla geliştirilmiştir.
Restful, Asp .NET Core Web Api 9.0 ile geliştirilmiştir ve dosyaları DietTracking.API klasörü içerisindedir. çalıştırılması için proje klonlandıktan sonra açıldığında cd DietTracking.API komutu ile ilgili dizine gidilir ve dotnet run komutu ile çalıştırılır.

Arayüz için React Native kullanılmıştır. ilgili dizine cd DietAppCliet ile geçilir. npm install komutu ile npm kütüphanesi indirilir. Daha sonra npx expo start komutu ile çalıştırılır ve terminaldeki qr kod okutularak uygulama çalıştırılır. **Projenin geliştirildiği cihaz ile bağlanacak telefon aynı interneti kullanmalıdır.Ayrıca restful ve ui eş zamanlı çalıştırılımalıdır.**

# Özellikler

**1- Basic Data:** Basic data için projeye karanlık mod seçeneği eklenmiştir. Basic data için preferences kullanımı sağlanmıştır. Bunun için react native de bulunan async - storage kullanılmıştır. Bunun için kullanılan eklenti şu şekilde sisteme eklendi: **npm install @react-native-async-storage/async-storage**. 
Preference kullanımı ve async-storege kullanımının incelenmesi için şu dosyaya göz atılmalıdır: DietAppCliet/context/ThemeContext.js.


**Sorumlu Kişi:** İzzet Esener
**İlgili Branch:** develop-basic_data

---

**2- Storage Data:** Storage data için diyetisyene danışan danışmanlar(hastalar) için form takip sistemi tasarlanmıştır. Danışanlar burada sisteme mevcut form durumunu tarihiyle birlikte ekleyebilir resim olarak. Storage kapsamında app-specific  kullanıma yönelik dosya sistemi üzerine uygulamalar var. Bu uygulamada kullanıcıların yüklediği vücut fotoğrafları, cihazın uygulamaya özel (app-specific) depolama alanında saklanıyor. Bunun için **npx expo install expo-file-system** eklendi. 

**Sorumlu Kişi:** İzzet Esener <br>
**İlgili Branch:** develop-storage-data

---

**3- RESTFul API:** Projede Asp .NET Core Web Api 9.0 kullanılmıştır. DietTracking.API klasörü restfulu içermektedir. 

**Sorumlu Kişi:** Kerem Kartal
**İlgili Branch:** develop-restful-storage

---

**4- UI:** Projede UI olarak React Native kullanılmıştır. Expo paketi ile proje mobilde çalıştırılmıştır.

**Sorumlu Kişi:** İzzet Esener, Salih Can Turan
**İlgili Branch:** develop-ui

---

**5-Authorization:** JWT tabanlı güvenli oturum yönetimi uygulanmıştır.Token üretimi TokenService.cs dosyasında gerçekleştirilir. Projede ilgili bölüm: DietTracking.API/Services/TokenService.cs 

**Sorumlu Kişi:** Kerem Kartal
**İlgili Branch:** develop-authorization

---

**6-Broadcast Receiver:** Broadcast Receiver için diyetisyenlerin hesaplarına yorum atıldığında diyetisyenlerin telefonuna bildirim gönderilmesi işlemi yapılmıştır. Bu işlem **expo-notifications ve expo-device** kütüphaneleriyle sağlanmıştır. Uygulamaya giriş yapan diyetisyenlerin cihazlarına özel oluşan tokenler hesaplarıyla ilişkilendirilir ve danışan bir diyetisyene yorum yaptığında bu diyetisyenin tokeni veri tabanından alınıp sunucuya bu tokene/cihaza bildirim gönderme isteği yapılır. Bu sayede diyetisyenlerin telefonuna uygulama açık olmasa dahi bildirim gönderilmiş olur. 

**İlgili işlemler** DietAppCliet/screens/DashboardScreen.js, DietAppCliet/screens/DietitianPanel.js, DietTracking.API/Controllers/NotificationController.cs, DietTracking.API/Controllers/DietTypeManagementController dosyalarında yapılmıştır.

**Sorumlu Kişi:** Volkan Mutlu
**İlgili Branch:** develop-broadcast_receiver



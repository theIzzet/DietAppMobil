# DietAppMobil

---
### Proje Açıklaması
Bu projenin amacı, diyet yapma sürecinde bireylerin ihtiyaç duyduğu uzman desteğine kolayca 
ulaşmasını sağlamak, diyetisyenlerle danışanları dijital ortamda bir araya getirerek etkin bir takip, 
iletişim ve geri bildirim mekanizması sunmaktır. Diyetisyenler farklı diyet alanlarında (örneğin sporcu 
diyeti, vegan diyeti vb.) uzmanlıklarını sisteme tanımlayabilirken, danışanlar ihtiyaçlarına göre seçim 
yapabilir, önceki kullanıcı yorumlarını inceleyebilir. Danışan istediği diyetisyene talep gönderebilir ve diyetisyenin talebi onaylaması durumunda artık diyetisyen hizmeti alabilir. Diyetisyen ilgili danışana özel bilgilerine göre ve isteklerine göre doğru programını hazırlar.

# Özellikler

**1- Basic Data:** Basic data için projeye karanlık mod seçeneği eklenmiştir. Basic data için preferences kullanımı sağlanmıştır. Bunun için react native de bulunan async - storage kullanılmıştır. Bunun için kullanılan eklenti şu şekilde sisteme eklendi: **npm install @react-native-async-storage/async-storage**. 
Preference kullanımı ve async-storege kullanımının incelenmesi için şu dosyaya göz atılmalıdır: DietAppCliet/context/ThemeContext.js.

---

**İlgili Branch:** develop-basic_data

--
**2- Storage Data:** Storage data için diyetisyene danışan danışmanlar(hastalar) için form takip sistemi tasarlanmıştır. Danışanlar burada sisteme mevcut form durumunu tarihiyle birlikte ekleyebilir resim olarak. Storage kapsamında app-specific  kullanıma yönelik dosya sistemi üzerine uygulamalar var. Bu uygulamada kullanıcıların yüklediği vücut fotoğrafları, cihazın uygulamaya özel (app-specific) depolama alanında saklanıyor. Bunun için **npx expo install expo-file-system** eklendi. 

**İlgili Branch:** develop-storage-data


**3- RESTFul API:** Projede Asp .NET Core Web Api 9.0 kullanılmıştır. DietTracking.API klasörü restfulu içermektedir. 

**İlgili Branch:** develop-restful-storage


**4- UI:** Projede UI olarak React Native kullanılmıştır. Expo paketi ile proje mobilde çalıştırılmıştır.

**İlgili Branch:** develop-ui

**5-Authorization:** Projede Authorization için JWT kullanılmıştır. Projede ilgili bölüm: DietTracking.API/Services/TokenService.cs 

**İlgili Branch:** develop-authorization





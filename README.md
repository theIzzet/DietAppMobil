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

---

**1-Basic/Storage Data**

**Basic Data:** Basic data için projeye karanlık mod seçeneği eklenmiştir. Basic data için preferences kullanımı sağlanmıştır. Bunun için react native de bulunan async - storage kullanılmıştır. Bunun için kullanılan eklenti şu şekilde sisteme eklendi: **npm install @react-native-async-storage/async-storage**. 
Preference kullanımı ve async-storege kullanımının incelenmesi için şu dosyaya göz atılmalıdır: DietAppCliet/context/ThemeContext.js.


**Sorumlu Kişi:** İzzet Esener

**İlgili Branch:** develop-basic_data



**Storage Data:** Storage data için diyetisyene danışan danışmanlar(hastalar) için form takip sistemi tasarlanmıştır. Danışanlar burada sisteme mevcut form durumunu tarihiyle birlikte ekleyebilir resim olarak. Storage kapsamında app-specific  kullanıma yönelik dosya sistemi üzerine uygulamalar var. Bu uygulamada kullanıcıların yüklediği vücut fotoğrafları, cihazın uygulamaya özel (app-specific) depolama alanında saklanıyor. Bunun için **npx expo install expo-file-system** eklendi. 

**Sorumlu Kişi:** İzzet Esener

**İlgili Branch:** develop-storage-data

---

**2-LocalDatabase**: Projede LocalDatabase özelliği bulunmamaktadır.

---

**3- RESTFul API (CRUD):** Projede Asp .NET Core Web Api 9.0 kullanılmıştır. DietTracking.API klasörü restfulu içermektedir. 

**Sorumlu Kişi:** Kerem Kartal

**İlgili Branch:** develop-restful-storage

---

**4- UI:** Projede UI olarak React Native kullanılmıştır. Expo paketi ile proje mobilde çalıştırılmıştır. İlgili dosyalar DietAppCliet dizini altındadır.

**api.js:** Axios tabanlı HTTP istekleri yönetimi için konfigürasyon. Tüm API çağrılarında otomatik token ekler.

**constants.js:** Uygulama genelinde kullanılan sabitler (API URL'leri gibi) burada tanımlanır.

**App.js:** Uygulamanın ana giriş noktası. Navigasyon yapısını ve temel provider'ları içerir.

**app.json:** Expo uygulamasının yapılandırma dosyası. Platforma özel ayarlar ve izinler burada tanımlı.

**package.json:** Proje bağımlılıklarını ve script'leri yönetir. Kullanılan tüm kütüphaneler burada listelenir.

**ThemeContext.js:** Karanlık/açık tema yönetimi sağlar. AsyncStorage ile kullanıcı tercihini hatırlar.

**ReminderContext.js:** Su hatırlatıcı özelliğinin durumunu yönetir. Global state sağlar.

**screens/:** Tüm ekran bileşenlerini içeren klasör. Her dosya bir uygulama ekranını temsil eder.

**components/:** Tekrar kullanılabilir UI bileşenlerini içerir (butonlar, kartlar vb.).




**Sorumlu Kişi:** İzzet Esener

**İlgili Branch:** develop-ui

---

**5- Background Process / Task:** Background Process / Task özelliği kapsamında, kullanıcıların belirli aralıklarla su içmeyi hatırlamasını sağlayan bir sistem geliştirilmiştir. Kullanıcı, hatırlatma sistemini bir butonla aktif veya pasif hale getirebilir. Bu işlem, uygulama ekranından kontrol edilebilecek bir arayüz ile desteklenmiştir.
useState ve Context API kullanılarak hatırlatma durumu (isReminderActive) global olarak yönetilir.
Kullanıcı butona bastığında isReminderActive değeri güncellenir.
UI üzerinde yeşil/kırmızı renk değişimi ile hatırlatma durumu görsel olarak belirtilir.
ReminderContext sayesinde diğer bileşenler de bu durumu okuyabilir ve arka plan görevlerini buna göre kontrol edebilir.
Arka planda çalışan hatırlatma sistemiyle kullanıcıya belirli zaman aralıklarında su içmesi gerektiği bildirilir. Sistem, ReminderContext ile global bir state yönetimi sağlar.

**Sorumlu Kişi:** Salih Can Turan

**İlgili Branch:** develop-Background_process

---

**6- Broadcast Receiver:** Broadcast Receiver için diyetisyenlerin hesaplarına yorum atıldığında diyetisyenlerin telefonuna bildirim gönderilmesi işlemi yapılmıştır. Bu işlem **expo-notifications ve expo-device** kütüphaneleriyle sağlanmıştır. Uygulamaya giriş yapan diyetisyenlerin cihazlarına özel oluşan tokenler hesaplarıyla ilişkilendirilir ve danışan bir diyetisyene yorum yaptığında bu diyetisyenin tokeni veri tabanından alınıp sunucuya bu tokene/cihaza bildirim gönderme isteği yapılır. Bu sayede diyetisyenlerin telefonuna uygulama açık olmasa dahi bildirim gönderilmiş olur. 

**İlgili işlemler** DietAppCliet/screens/DashboardScreen.js, DietAppCliet/screens/DietitianPanel.js, DietTracking.API/Controllers/NotificationController.cs, DietTracking.API/Controllers/DietTypeManagementController dosyalarında yapılmıştır.

**Sorumlu Kişi:** Volkan Mutlu

**İlgili Branch:** develop-broadcast_receiver

---

**7- Sensor (Motion / Location / Environment):** Sensor özelliği kapsamında cihazın hareket sensörü (accelerometer) kullanılarak adım sayımı yapılmakta ve buna bağlı olarak yakılan kalori hesaplanmaktadır. Bu işlem, React Native ortamında expo-sensors kütüphanesi üzerinden gerçekleştirilmiştir. expo-sensors kütüphanesinden Accelerometer kullanılarak cihazın x, y, z eksenlerindeki ivme değerleri alınır. Hareket şiddetindeki ani değişimlere göre adım sayısı artırılır. Bu, belirli bir eşik değeri (peakThreshold = 0.6) ve zaman aralığı (minStepInterval = 250ms) ile kontrol edilir.
Her adım sonrası yaklaşık kalori değeri (adım × 0.04 kcal) olarak hesaplanır. Bu değerler günlük olarak yerel veritabanı olan SQLite’a kaydedilir (steps.db). Uygulama her başlatıldığında bugünkü kayıt kontrol edilir ve kaldığı yerden devam eder.

**İlgili branch:** develop-sensor

**Sorumlu Kişi:** Salih Can Turan

---

**8- Connectivity (BLE / Wifi / Cellular Network / USB / NFC):** Connectivity için uygulamanın kalori yakım sayfasına BLE(Bluetooth Low Energy) cihazlarına bağlanma ve veri çekme işlemi eklenmiştir, bu işlem ile yakındaki akıllı saatler uygulama üzerinden algılanmakta ve bu cihazlarla bağlantı kurulabilmekte daha sonra "Adımları Senkronize Et" butonuna basılarak akıllı saatin adım sayısı bizim uygulamamıza getirilmekte ve uygulama üzerindeki adım sayısı ile akıllı saatimizin adım sayısı senkronize edilir. Bu işlem için react-native-ble-plx ve react-native-base64 kütüphaneleri kullanılmıştır.
İlgili işlemler CalorieBurnScreen.js üzerinde yapılmıştır.

**Sorumlu Kişi:** Volkan Mutlu

**İlgili Branch:** develop-connectivity

---

**9- Authorization:** Projede JWT tabanlı bir kimlik doğrulama sistemi bulunuyor. Kullanıcılar "Danışan" veya "Diyetisyen" rollerine göre yetkilendiriliyor ve her işlem için token kontrolü yapılıyor. TokenService, kullanıcı bilgilerini ve rollerini içeren token'lar oluşturuyor.

Token üretimi TokenService.cs dosyasında gerçekleştirilir. Projede ilgili bölüm: DietTracking.API/Services/TokenService.cs 

**Sorumlu Kişi:** Kerem Kartal

**İlgili Branch:** develop-authorization

---

**10- Cloud Service :** Cloud Service (AI) özelliği kapsamında yapay zeka destekli motivasyon mesajı üretimi gerçekleştirilmiştir. Kullanıcı butona bastığında, axios aracılığıyla OpenRouter üzerinden GPT-3.5-Turbo modeline POST isteği yapılır. Yapay zeka tarafından oluşturulan kısa ve duygusal bir motivasyon mesajı ile birlikte, sağlıklı yaşamla ilgili bir bilgi (örneğin bir aktivitenin kalori değeri veya bir besinin besin değeri) kullanıcıya sunulur.

**Sorumlu Kişi:** Salih Can Turan

**İlgili Branch:** develop-Cloud_service_ai


# Universitysss

**DPÜ Yazılım Mimarisi ve Tasarım Dersi Final Ödevi**

**Geliştiriciler:**
- [Gökhan Kaya](https://github.com/GkhKaya)
- [Sencer Çelik](https://github.com/sencercelik)

**Proje Kaynak Kodları:**
- [GitHub Deposu (Universitysss)](https://github.com/GkhKaya/universitysss)

Universitysss, üniversite öğrencileri ve akademisyenleri için özel olarak tasarlanmış modern, hızlı ve güvenli bir **Soru & Cevap (Q&A)** platformudur. Kullanıcıların kendi bölümleriyle veya üniversite geneliyle ilgili sorular sormasına, anonim olarak bilgi almasına ve diğer kullanıcıların sorularını yanıtlamasına olanak tanır.

## 🚀 Özellikler

- **Gelişmiş Kimlik Doğrulama:** Firebase Auth destekli, güvenli e-posta ve şifre girişi / kayıt sistemi.
- **Soru & Cevap Akışı:** 
  - Soru sorarken hedef kitle belirleyebilme (sadece belirli bir bölüm veya tüm üniversite).
  - Kimliğinizi gizleyerek anonim soru sorabilme.
  - Soruları ve cevapları oylama (Beğen / Beğenme).
- **Yönetim (Admin) Paneli:**
  - Yeni sorulan soruların platformda yayınlanmadan önce yönetici onayından geçmesi (bekleyen sorular).
  - İhtiyaç duyulduğunda soruların kapatılabilmesi (Kapalı Sorular).
  - Kategori ve bölüm yönetimi (Ekle / Sil).
  - Kullanıcı yetkilendirmesi (Kullanıcı onaylama, silme ve gelişmiş rol atama sistemi).
- **Profil Sistemi:**
  - Kullanıcı bilgilerini ve güncel bölümünü yönetebilme.
  - Kullanıcının sorduğu ve yanıtladığı tüm soruların tek bir ekranda listelenmesi.
- **Dinamik Filtreleme & Arama:**
  - Ana sayfada soruları kategorilere veya "Açık/Kapalı" durumlarına göre filtreleyebilme.
  - Hızlı arama özelliği sayesinde soru başlıklarında ve içeriklerinde kolayca arama yapabilme.
- **Modern Arayüz (UI/UX):**
  - Tamamen responsive (mobil uyumlu) modern tasarım.
  - Aydınlık (Light) ve Karanlık (Dark) tema desteği.

## 🛠 Kullanılan Teknolojiler

Bu proje güncel ve performanslı web teknolojileri kullanılarak geliştirilmiştir:

- **Frontend Framework:** [React 18](https://reactjs.org/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Derleyici / Paketleyici:** [Vite](https://vitejs.dev/)
- **Veritabanı & Backend Servisleri:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Stil & Tasarım:** Özel yazılmış Vanilla CSS (CSS Variables, Flexbox, Grid)
- **Routing:** [React Router v6](https://reactrouter.com/)

## 📂 Mimari Yaklaşım (Clean Architecture)

Proje, kodun sürdürülebilirliğini ve test edilebilirliğini artırmak amacıyla belirli tasarım kalıpları (Design Patterns) üzerine inşa edilmiştir:

1. **Presentation Layer (Görünüm):** Sadece UI bileşenlerini (React Components) içerir. İş mantığından (business logic) tamamen arındırılmıştır.
2. **ViewModel (Kanca - Hooks):** UI ile veri katmanı arasında köprü görevi görür. (Örn: `useAskQuestionViewModel`, `useAdminViewModel`) Durum yönetimini (state) ve kullanıcı etkileşimlerini işler.
3. **Data Layer (Repository):** Firebase veritabanı işlemlerinin soyutlandığı katmandır. (Örn: `question.repository.ts`, `admin.repository.ts`). Bileşenler Firestore ile doğrudan konuşmaz, repository sınıflarını kullanır.
4. **Shared (Ortak Katman):** Uygulama genelinde paylaşılan bileşenler (Sidebar, hata yönetimi), temalar, hook'lar, Firebase bağdaştırıcıları (adapters) ve TypeScript tiplerini barındırır.

## 📦 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

### 1. Gereksinimler
- [Node.js](https://nodejs.org/) (Sürüm 18 veya üzeri önerilir)
- Git

### 2. Projeyi Klonlayın
```bash
git clone https://github.com/GkhKaya/universitysss.git
cd universitysss
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```

### 4. Çevresel Değişkenleri (Environment Variables) Ayarlayın
Proje dizininde bir `.env` (veya `.env.local`) dosyası oluşturun ve Firebase yapılandırma bilgilerinizi ekleyin:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## 🔄 Geliştirme Süreci (Git Workflow)

Projenin geliştirilme süreci boyunca temel olarak **Issue (Görev) sistemi** kullanılmıştır. Karşılaşılan bug'lar, yeni eklenecek özellikler ve yapılacak iyileştirmeler için GitHub Issues (veya benzeri bir takip sistemi) üzerinden görevler açılmış ve her biri için ayrı branch'ler açılarak kodlama yapılmıştır. 

Ancak projenin teslimine çok yakın bir zamanda, son kısımdaki hızlı hata düzeltmeleri (bugfix) ve küçük arayüz/tasarım dokunuşları için süreç hızlandırılarak değişiklikler doğrudan `main` (ana) branch üzerine yapılmıştır.

## 📝 Lisans

Bu proje **DPÜ Yazılım Mimarisi ve Tasarım Dersi** kapsamında akademik kullanım amacıyla geliştirilmiştir. Daha fazla bilgi için geliştiricilerle iletişime geçebilirsiniz.

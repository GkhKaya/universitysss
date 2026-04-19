import type { AppMessages } from '../types'

export const tr: AppMessages = {
  home: {
    title: 'universitysss',
    description:
      'Üniversite ortamında soru ve cevap paylaşımı için geliştirilen uygulama. İçerik ve arayüz üzerinde çalışmaya devam ediyoruz.',
    registerCta: 'Kayıt ol',
  },
  register: {
    heroTitle: 'Bilginin Işığında Buluşalım.',
    heroSubtitle:
      'Üniversite hayatınızı kolaylaştıracak tüm cevaplar burada, küratör hassasiyetiyle hazırlandı.',
    heroImageAlt: 'Dumlupınar Üniversitesi Mühendislik Fakültesi logosu',
    formTitle: 'Aramıza Katılın',
    formSubtitle: 'Akademik dünyadaki yerinizi almak için birkaç adım uzağınızdayız.',
    roleLabel: 'Rol seçimi',
    roleStudent: 'Öğrenci',
    roleTeacher: 'Öğretmen',
    fullNameLabel: 'Ad soyad',
    fullNamePlaceholder: 'Örn. Ahmet Yılmaz',
    emailLabel: 'Üniversite e-posta adresi',
    emailPlaceholder: 'isim@ogr.dpu.edu.tr veya isim@dpu.edu.tr',
    departmentLabel: 'Bölüm',
    departmentPlaceholder: 'Liste veya arama ile seçin…',
    departmentLoading: 'Bölümler yükleniyor…',
    departmentLoadError: 'Bölüm listesi alınamadı. Sayfayı yenileyin.',
    departmentEmpty: 'Henüz kayıtlı bölüm yok. Yönetici Firestore’a bölüm eklemelidir.',
    departmentNoMatch: 'Aramanızla eşleşen bölüm yok.',
    passwordLabel: 'Şifre',
    passwordPlaceholder: '••••••••',
    passwordShowAria: 'Şifreyi göster',
    passwordHideAria: 'Şifreyi gizle',
    termsPrefix: 'Kaydol düğmesine basarak ',
    termsLink: 'Kullanım Koşullarını',
    termsMiddle: ' ve ',
    privacyLink: 'Gizlilik Politikasını',
    termsSuffix: ' kabul etmiş olursunuz.',
    submitButton: 'Hesap oluştur',
    submitLoading: 'Kaydediliyor…',
    footerPrompt: 'Zaten hesabın var mı?',
    loginLink: 'Giriş yap',
    localeSwitchLabel: 'Dil',
    errorRequired: 'Lütfen tüm alanları doldurun.',
    errorDepartmentRequired: 'Lütfen listeden bir bölüm seçin.',
    errorPasswordLength: 'Şifre en az 6 karakter olmalıdır.',
    errorEmailStudentDomain:
      'Öğrenci kaydı yalnızca tam adresi …@ogr.dpu.edu.tr olan kurumsal e-postalarla yapılabilir (@dpu.edu.tr kabul edilmez).',
    errorEmailTeacherDomain:
      'Öğretmen kaydı yalnızca tam adresi …@dpu.edu.tr olan kurumsal e-postalarla yapılabilir (@ogr.dpu.edu.tr kabul edilmez).',
    errorSignup: 'Kayıt başarısız. Bilgileri kontrol edin.',
    errorRoleNotFound:
      'Seçilen rol Firestore ile eşleşmedi. Admin panelinden userRoles kaydını kontrol edin.',
    errorDepartmentNotFound:
      'Bölüm bulunamadı. Tam adı yazın veya listedeki isimle eşleşecek şekilde arayın.',
    errorProfileWrite: 'Hesap oluştu ancak profil kaydı yazılamadı. Yöneticiyle iletişime geçin.',
    successSignup: 'Hesabınız oluşturuldu. Giriş sayfasına yönlendirileceksiniz.',
  },
}

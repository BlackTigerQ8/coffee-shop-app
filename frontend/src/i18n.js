import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          ///NAVBAR///
          pages: "Pages",
          home: "Home",
          about: "About",
          contact: "Contact",
          login: "Login",
          register: "Register",
          logout: "Logout",
          dashboard: "Dashboard",
          settings: "Settings",
          profile: "Profile",
          notifications: "Notifications",
          messages: "Messages",
          search: "Search",
          language: "Language",
          changeLanguage: "Change Language",

          ///COPY RIGHT///
          engineerName: "Eng. Abdullah Alenezi",
          rights: "All Rights Reserved",
          welcome: "Welcome",
          pageNotFound: "Page Not Found",
          backToHome: "Back to Home",
          "Coffee Shop": "Coffee Shop",
        },
      },
      ar: {
        translation: {
          ///NAVBAR///
          pages: "الصفحات",
          home: "الرئيسية",
          about: "نبذة عنا",
          contact: "تواصل معنا",
          login: "تسجيل الدخول",
          register: "تسجيل الخروج",
          logout: "تسجيل الخروج",
          dashboard: "لوحة التحكم",
          settings: "الإعدادات",
          profile: "الحساب الشخصي",
          notifications: "الإشعارات",
          messages: "الرسائل",
          search: "بحث",
          language: "اللغة",
          changeLanguage: "تغيير اللغة",

          ///COPY RIGHT///
          engineerName: "المهندس عبدالله العنزي",
          rights: "جميع الحقوق محفوظة",
          welcome: "مرحبا",
          pageNotFound: "الصفحة غير موجودة",
          backToHome: "العودة للرئيسية",
          "Coffee Shop": "Coffee Shop",
        },
      },
    },
  });

export default i18n;

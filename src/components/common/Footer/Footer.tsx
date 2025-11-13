import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { KvartalikaLogo } from "../../icons/Logo.tsx";
import { getFooterData } from "../../../services/api/pages.api.requests";
import type { FooterDto } from "../../../services/api/pages.api.types";

const DEFAULT_FOOTER: FooterDto = {
  phone: "+7 (3822) 30-99-22",
  email: "info@kvartalika.ru",
  footerDescription: "Квартиры комфорт-класса в Томске",
  title: "Кварталика",
  address: "Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310",
  description: "Отдел продаж",
  privacy: "Политика конфиденциальности",
  workingHours: "Пн-Вс: 09:00 - 21:00",
  tg: null,
  vk: null,
};

const Footer = () => {
    const [footerData, setFooterData] = useState<FooterDto>(DEFAULT_FOOTER);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await getFooterData();
                setFooterData(response.data);
            } catch (error) {
                // Silently handle error
                setFooterData(DEFAULT_FOOTER);
            } finally {
                setLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    useEffect(() => {
        const handleFooterDataSaved = () => {
            const fetchFooterData = async () => {
                try {
                    const response = await getFooterData();
                    setFooterData(response.data);
                } catch (error) {
                    console.error("Failed to fetch updated footer data:", error);
                }
            };
            fetchFooterData();
        };

        window.addEventListener("footerDataSaved", handleFooterDataSaved);
        return () => {
            window.removeEventListener("footerDataSaved", handleFooterDataSaved);
        };
    }, []);

    if (loading) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.topFooter}>
                <div className={styles.logoAndDescription}>
                    <div className={styles.logo}>
                        <KvartalikaLogo width="40px" height="40px" />
                        <span className={styles.logoTitle}>{footerData.title}</span>
                    </div>
                    
                    <span className={styles.description}>{footerData.footerDescription}</span>
                </div>
                <div className={styles.menuAndContacts}>
                    <div className={styles.menu}>
                        <div className={styles.title}>
                            <span>МЕНЮ</span>
                        </div>
                        <div className={styles.menuItems}>
                            <Link
                                to="/"
                                className={styles.menuItem}
                            >Главная</Link>
                            <Link
                                to="/complexes"
                                className={styles.menuItem}
                            >Жилые комплексы</Link>
                            <Link
                                to="/apartments"
                                className={styles.menuItem}
                            >Квартиры</Link>
                            <Link
                                to="/about"
                                className={styles.menuItem}
                            >О нас</Link>
                        </div>
                    </div>
                    <div className={styles.contacts}>
                        <div className={styles.title}>
                            <span>КОНТАКТЫ</span>
                        </div>
                        <div className={styles.contactsItems}>
                            <div className={styles.contactItem}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.4">
                                    <path d="M16.1855 15.046L12.2961 18.9354C12.126 19.1057 11.9241 19.2407 11.7017 19.3329C11.4794 19.4251 11.2411 19.4725 11.0004 19.4725C10.7598 19.4725 10.5214 19.4251 10.2991 19.3329C10.0768 19.2407 9.87481 19.1057 9.70471 18.9354L5.81438 15.046C4.78883 14.0204 4.09044 12.7137 3.80751 11.2912C3.52458 9.86868 3.66983 8.39421 4.22488 7.05424C4.77994 5.71428 5.71987 4.56899 6.92582 3.76321C8.13177 2.95743 9.54958 2.52734 11 2.52734C12.4503 2.52734 13.8682 2.95743 15.0741 3.76321C16.2801 4.56899 17.22 5.71428 17.775 7.05424C18.3301 8.39421 18.4753 9.86868 18.1924 11.2912C17.9095 12.7137 17.2111 14.0204 16.1855 15.046Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M13.75 9.86041C13.75 10.5898 13.4602 11.2892 12.9445 11.805C12.4288 12.3207 11.7293 12.6104 11 12.6104C10.2706 12.6104 9.57114 12.3207 9.05542 11.805C8.53969 11.2892 8.24996 10.5898 8.24996 9.86041C8.24996 9.13106 8.53969 8.43159 9.05542 7.91587C9.57114 7.40014 10.2706 7.11041 11 7.11041C11.7293 7.11041 12.4288 7.40014 12.9445 7.91587C13.4602 8.43159 13.75 9.13106 13.75 9.86041Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                </svg>
                                <span>{footerData.description}: {footerData.address}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.4">
                                    <path d="M2.75 4.58333C2.75 4.0971 2.94315 3.63079 3.28697 3.28697C3.63079 2.94315 4.0971 2.75 4.58333 2.75H7.59C7.78231 2.75015 7.96971 2.81077 8.12566 2.9233C8.28161 3.03582 8.39823 3.19454 8.459 3.377L9.83217 7.49558C9.90174 7.70489 9.89352 7.93227 9.80899 8.13601C9.72447 8.33974 9.56931 8.50617 9.372 8.60475L7.30308 9.64058C8.31721 11.8851 10.1149 13.6828 12.3594 14.6969L13.3953 12.628C13.4938 12.4307 13.6603 12.2755 13.864 12.191C14.0677 12.1065 14.2951 12.0983 14.5044 12.1678L18.623 13.541C18.8056 13.6018 18.9644 13.7186 19.077 13.8747C19.1895 14.0308 19.25 14.2184 19.25 14.4109V17.4167C19.25 17.9029 19.0568 18.3692 18.713 18.713C18.3692 19.0568 17.9029 19.25 17.4167 19.25H16.5C8.90633 19.25 2.75 13.0937 2.75 5.5V4.58333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                </svg>
                                <a href={`tel:${footerData.phone.replace(/\s+/g, '')}`}>{footerData.phone}</a>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.4">
                                    <path d="M2.75 7.33301L9.9825 12.1547C10.2838 12.3557 10.6378 12.4629 11 12.4629C11.3622 12.4629 11.7162 12.3557 12.0175 12.1547L19.25 7.33301M4.58333 17.4163H17.4167C17.9029 17.4163 18.3692 17.2232 18.713 16.8794C19.0568 16.5356 19.25 16.0692 19.25 15.583V6.41634C19.25 5.93011 19.0568 5.4638 18.713 5.11998C18.3692 4.77616 17.9029 4.58301 17.4167 4.58301H4.58333C4.0971 4.58301 3.63079 4.77616 3.28697 5.11998C2.94315 5.4638 2.75 5.93011 2.75 6.41634V15.583C2.75 16.0692 2.94315 16.5356 3.28697 16.8794C3.63079 17.2232 4.0971 17.4163 4.58333 17.4163Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                </svg>
                                <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="22" height="22" viewBox="0 0 22 22" opacity="0.4" fill="#ffffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.2,4.4L2.9,10.7c-1.1,0.4-1.1,1.1-0.2,1.3l4.1,1.3l1.6,4.8c0.2,0.5,0.1,0.7,0.6,0.7c0.4,0,0.6-0.2,0.8-0.4
                                        c0.1-0.1,1-1,2-2l4.2,3.1c0.8,0.4,1.3,0.2,1.5-0.7l2.8-13.1C20.6,4.6,19.9,4,19.2,4.4z M17.1,7.4l-7.8,7.1L9,17.8L7.4,13l9.2-5.8
                                        C17,6.9,17.4,7.1,17.1,7.4z"/>
                                    <rect y="0" fill="none" width="24" height="24"/>
                                </svg>
                                {footerData.tg ? (
                                    <a href={footerData.tg}>{footerData.tg}</a>
                                ) : (
                                    <a href="https://t.me/contact_kvartalika_bot">@contact_kvartalika_bot</a>
                                )}
                            </div>
                            {footerData.vk && (
                                <div className={styles.contactItem}>
                                    <svg opacity="0.4" width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <mask id="vkMask" fill="white">
                                                <rect width="48" height="48" fill="white"/>
                                                <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="black"/>
                                            </mask>
                                        </defs>
                                        <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#FFFFFF" mask="url(#vkMask)"/>
                                    </svg>
                                    <a href={footerData.vk}>{footerData.vk}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottomFooter}>
                <span className={styles.copyright}>© 2025 Кварталика</span>
                <div className={styles.termsLinks}>
                    <Link
                        to="/privacy"
                        className={styles.termsLink}
                    >Политика конфиденциальности</Link>
                    <Link
                        to="/termsofservice"
                        className={styles.termsLink}
                    >Условия использования</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
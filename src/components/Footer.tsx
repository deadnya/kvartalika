import React from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section footer-brand">
                        <Logo
                            size="md"
                            color="dark"
                            showText={true}
                            className="footer-logo"
                        />
                        <p className="footer-description">
                            Найдите идеальную квартиру для комфортной жизни в современных жилых комплексах.
                        </p>
                        <div className="social-links">
                            <a href="https://vk.com/kvartalika" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.714-1.033-1.01-1.49-.856-1.49.302v1.412c0 .302-.097.484-.876.484-2.048 0-4.314-1.214-5.918-3.468C5.467 10.618 4.8 8.027 4.8 7.362c0-.302.097-.484.876-.484h1.744c.583 0 .8.242.97.726.97 2.254 2.254 4.177 2.834 4.177.218 0 .302-.097.302-.726V9.368c-.048-1.35-.775-1.412-.775-1.896 0-.242.194-.484.484-.484h2.737c.484 0 .66.242.66.726v3.468c0 .484.218.66.356.66.218 0 .436-.097.726-.484 1.744-1.744 2.981-4.42 2.981-4.42.17-.387.436-.726.97-.726h1.744c.726 0 .582.387.387.726-.678 1.501-3.468 4.743-3.468 4.743-.218.29-.242.436 0 .726 1.744 1.744 2.981 2.737 3.274 3.468.291.726-.145.726-.145.726z" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="https://t.me/kvartalika" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.44c-.12.539-.432.672-.864.42l-2.388-1.764-1.152 1.116c-.12.12-.24.24-.48.24l.156-2.268 4.08-3.684c.18-.156-.036-.24-.276-.084l-5.04 3.18L7.8 13.92c-.54-.168-.552-.54.12-.804l9.312-3.588c.468-.168.876.108.72.828z" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="https://wa.me/+79001234567" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 7.01l-2.21 2.56c-.51.59-1.24.92-2.01.92-.77 0-1.5-.33-2.01-.92L8.12 9.01c-.59-.68-.59-1.71 0-2.39.59-.68 1.54-.68 2.13 0l1.79 2.07 1.79-2.07c.59-.68 1.54-.68 2.13 0 .59.68.59 1.71 0 2.39z" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com/kvartalika" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Навигация</h3>
                        <ul className="footer-links">
                            <li><a href="#apartments">Квартиры</a></li>
                            <li><a href="#about">О проекте</a></li>
                            <li><a href="#contacts">Контакты</a></li>
                            <li><a href="#news">Новости</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Услуги</h3>
                        <ul className="footer-links">
                            <li><a href="#selection">Подбор квартиры</a></li>
                            <li><a href="#mortgage">Ипотека</a></li>
                            <li><a href="#consultation">Консультация</a></li>
                            <li><a href="#viewing">Просмотр</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Контакты</h3>
                        <div className="contact-info">
                            <p>📞 +7 (900) 123-45-67</p>
                            <p>📧 info@kvartalika.ru</p>
                            <p>📍 г. Москва, ул. Примерная, 123</p>
                            <p>🕒 Пн-Пт: 9:00-18:00</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>&copy; 2025 Кварталика. Все права защищены.</p>
                    </div>
                    <div className="footer-legal">
                        <a href="#privacy">Политика конфиденциальности</a>
                        <a href="#terms">Пользовательское соглашение</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
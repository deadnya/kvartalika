import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { setMetaTags } from '../../utils/metaTagsManager'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import styles from "./AboutUsPage.module.css"

import image01 from "/images/01.png"
import image02 from "/images/02.png"

import Principle1Icon from "../../assets/icons/principle1.svg?react"
import Principle2Icon from "../../assets/icons/principle2.svg?react"
import Principle3Icon from "../../assets/icons/principle3.svg?react"
import Principle4Icon from "../../assets/icons/principle4.svg?react"
import SberbankIcon from "../../assets/icons/sberbank.svg?react"
import StroygroupIcon from "../../assets/icons/stroygroup.svg?react"
import MapIcon from "../../assets/icons/map.svg?react"
import PhoneIcon from "../../assets/icons/phone.svg?react"
import EmailIcon from "../../assets/icons/email.svg?react"
import CloseIcon from "../../assets/icons/close.svg?react"

import { Input } from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import BreadcrumbNav from '../../components/common/BreadcrumbNav'
import { getAboutUsPageContent } from '../../services/api/pages.api.requests'
import { getFooterData } from '../../services/api/pages.api.requests'
import type { AboutUsPageContent, ContactRequestData } from '../../services/api/pages.api.types'
import type { FooterDto } from '../../services/api/pages.api.types'
import { DEFAULT_ABOUT_US_PAGE_CONTENT } from '../../services/api/pages.api.defaults'
import AdminOverlay from '../../components/common/AdminOverlay/AdminOverlay'
import { usePageContentStore } from '../../store/pageContent.store'
import { submitContactRequest } from '../../services/contact.service'

const AboutUsPage = () => {
    const { aboutUsPageContent, homePageFooter, setAboutUsPageContent, setHomePageFooter } = usePageContentStore();
    const [content, setLocalContent] = useState<AboutUsPageContent>(aboutUsPageContent || DEFAULT_ABOUT_US_PAGE_CONTENT)
    const [footerData, setLocalFooterData] = useState<FooterDto | null>(homePageFooter)
    
    // Form state
    const [formData, setFormData] = useState<ContactRequestData>({
        name: "",
        phone: "",
        comment: "",
    });
    const [formError, setFormError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    // Intersection Observer refs
    const mottoRef = useIntersectionObserver({ threshold: 0.1 });
    const principleRefs = content.principles.map(() => useIntersectionObserver({ threshold: 0.1 }));
    const ourValuesImageRef = useIntersectionObserver({ threshold: 0.1 });
    const ourValuesHeaderRef = useIntersectionObserver({ threshold: 0.1 });
    const ourValuesElementRefs = content.values.map(() => useIntersectionObserver({ threshold: 0.1 }));
    const worksWithUsHeaderRef = useIntersectionObserver({ threshold: 0.1 });
    const worksWithUsContentRef = useIntersectionObserver({ threshold: 0.1 });
    const sendRequestRef = useIntersectionObserver({ threshold: 0.1 });

    const fetchContent = async () => {
        try {
            const data = await getAboutUsPageContent()
            setLocalContent(data)
            setAboutUsPageContent(data)
        } catch (error) {
            console.error("Error fetching about us page content:", error)
            setLocalContent(DEFAULT_ABOUT_US_PAGE_CONTENT)
        }
    }

    const fetchFooterData = async () => {
        try {
            const response = await getFooterData()
            setLocalFooterData(response.data)
            setHomePageFooter(response.data)
        } catch (error) {
            console.error("Error fetching footer data:", error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormError("");
    };

    const handleSubmitContactRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        try {
            await submitContactRequest(formData);
            setFormData({ name: "", phone: "", comment: "" });
            setShowSuccessModal(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            setFormError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchContent()
        fetchFooterData()
    }, [])

    // Set meta tags when content is loaded
    useEffect(() => {
        setMetaTags({
            metaTitle: content.metaTitle,
            metaDescription: content.metaDescription,
            metaKeywords: content.metaKeywords,
            metaImage: content.metaImage,
        });
    }, [content]);

    // Listen for custom event from AboutUsPageEditor when data is saved
    useEffect(() => {
        const handleAboutUsDataSaved = () => {
            fetchContent()
        }

        window.addEventListener("aboutUsPageDataSaved", handleAboutUsDataSaved)
        return () => {
            window.removeEventListener("aboutUsPageDataSaved", handleAboutUsDataSaved)
        }
    }, [])

    // Listen for custom event from FooterEditor when data is saved
    useEffect(() => {
        const handleFooterDataSaved = () => {
            fetchFooterData()
        }

        window.addEventListener("footerDataSaved", handleFooterDataSaved)
        return () => {
            window.removeEventListener("footerDataSaved", handleFooterDataSaved)
        }
    }, [])
    return (
        <>
            <AdminOverlay />
            <div className={styles.container}>
                <div className={styles.topContainer}>
                    <div className={styles.topImageContainer}>
                        <img src={content.hero.imageSrc}></img>
                        <div className={styles.topImageTriangleOverlay}></div>
                    </div>
                    <BreadcrumbNav currentPage="О нас" />
                    <div className={styles.mottoContainer}>
                        <div className={styles.mottoTopContainer}>
                            <span ref={mottoRef.ref} className={`${styles.motto} ${styles.motto1} ${mottoRef.isVisible ? styles.fadeInLeft : ''}`}>{content.hero.motto.partOne}</span>
                            <span className={`${styles.motto} ${styles.motto2} ${mottoRef.isVisible ? styles.fadeInRight : ''}`}>{content.hero.motto.partTwo}</span>
                            <span className={`${styles.motto} ${styles.motto3} ${mottoRef.isVisible ? styles.fadeInLeft : ''}`}>{content.hero.motto.partThree}</span>
                        </div>
                        <p className={styles.mottoBottomText}>
                            {content.hero.bottomText.split('\n').map((line, index) => (
                                <span key={index}>
                                    {line}
                                    {index < content.hero.bottomText.split('\n').length - 1 && <br/>}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                <div className={styles.imageRow}>
                    <div className={styles.imageRowTriangleOverlay}></div>
                    <img src={content.imageRow.imageSrc1}></img>
                    <img src={content.imageRow.imageSrc2}></img>
                    <img src={content.imageRow.imageSrc3}></img>
                </div>

                <div className={styles.principles}>
                    {content.principles.map((principle, index) => (
                        <div ref={principleRefs[index].ref} key={principle.id} className={`${styles.principle} ${principleRefs[index].isVisible ? styles.fadeIn : ''}`}>
                            <div className={styles.principleTitle}>
                                <img 
                                    src={principle.imageNumber === "01" ? image01 : image02} 
                                    className={styles.principleImage}
                                ></img>
                                <h2 className={styles.principleTitleText}>
                                    {principle.title}
                                </h2>
                            </div>
                            <p className={styles.principleDescription}>
                                {principle.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className={styles.ourValues}>
                    <div ref={ourValuesImageRef.ref} className={`${styles.valuesImageContainer} ${ourValuesImageRef.isVisible ? styles.fadeIn : ''}`}>
                        <img src={content.valuesImage}></img>
                        <div className={styles.valuesImageTriangleOverlay}></div>
                    </div>
                    <div className={styles.ourValuesList}>
                        <h2 ref={ourValuesHeaderRef.ref} className={`${styles.ourValuesHeader} ${ourValuesHeaderRef.isVisible ? styles.fadeIn : ''}`}>Наши ценности</h2>
                        <div className={styles.ourValuesElements}>
                            {content.values.map((value, index) => {
                                const iconMap: { [key: string]: React.ComponentType<any> } = {
                                    'principle1': Principle1Icon,
                                    'principle2': Principle2Icon,
                                    'principle3': Principle3Icon,
                                    'principle4': Principle4Icon,
                                };
                                const IconComponent = iconMap[value.iconType];
                                return (
                                    <div ref={ourValuesElementRefs[index].ref} key={value.id} className={`${styles.ourValuesElement} ${ourValuesElementRefs[index].isVisible ? styles.fadeIn : ''}`}>
                                        <div className={styles.principleIconContainer}>
                                            <IconComponent />
                                        </div>
                                        <div className={styles.ourValuesTextBlock}>
                                            <h3 className={styles.ourValuesTextBlockHeader}>{value.title}</h3>
                                            <p className={styles.ourValuesTextBlockDescription}>{value.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.worksWithUs}>
                    <h2 ref={worksWithUsHeaderRef.ref} className={`${styles.worksWithUsHeader} ${worksWithUsHeaderRef.isVisible ? styles.fadeIn : ''}`}>С нами уже работают</h2>
                    <div ref={worksWithUsContentRef.ref} className={`${styles.worksWithUsContent} ${worksWithUsContentRef.isVisible ? styles.fadeIn : ''}`}>
                        {content.partners.map((partner) => {
                            const iconMap: { [key: string]: React.ComponentType<any> } = {
                                'sberbank': SberbankIcon,
                                'stroygroup': StroygroupIcon,
                            };
                            const IconComponent = iconMap[partner.iconType];
                            return (
                                <div key={partner.id} className={styles.worksWithUsCompany}>
                                    <IconComponent />
                                    <div className={styles.worksWithUsCompanyText}>
                                        <h3 className={styles.worksWithUsCompanyHeader}>{partner.name}</h3>
                                        <span className={styles.worksWithUsCompanyDescription}>{partner.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div ref={sendRequestRef.ref} className={`${styles.sendRequestContainer} ${sendRequestRef.isVisible ? styles.fadeIn : ''}`}>
                    <div className={styles.sendRequestTriangleOverlay}></div>
                    <div className={styles.sendRequestForm}>
                        <div className={styles.sendRequestHeader}>
                            <span className={styles.sendRequestHeaderTopText}>
                                Узнайте больше о наших проектах —<br/>
                                посетите офис продаж<br/>
                                или свяжитесь с нами
                            </span>
                        </div>

                        <div className={styles.sendRequestContent}>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactInfoColumn}>
                                    <div className={styles.contactInfoBlock}>
                                        <MapIcon />
                                        <div className={styles.contactInfoContent}>
                                            <span>{footerData?.address ?? "Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310"}</span>
                                            <span>
                                                Режим работы:<br/>
                                                {footerData?.workingHours ?? "пн–пт: 9:00 –19:00\nсб: 10:00 –18:00"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.contactInfoColumn}>
                                    <div className={styles.contactInfoBlock}>
                                        <PhoneIcon />
                                        <div className={styles.contactInfoContent}>
                                            <a href={`tel:${footerData?.phone.replace(/\s+/g, '')}`}>{footerData?.phone}</a>
                                        </div>
                                    </div>
                                    <div className={styles.contactInfoBlock}>
                                        <EmailIcon />
                                        <div className={styles.contactInfoContent}>
                                            <a href={`mailto:${footerData?.email}`}>{footerData?.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form className={styles.formInputContainer} onSubmit={handleSubmitContactRequest}>
                                {formError && (
                                    <div style={{ color: "#d32f2f", marginBottom: "16px", fontSize: "14px" }}>
                                        {formError}
                                    </div>
                                )}
                                <div className={styles.formInputs}>
                                    <div className={styles.formRow}>
                                        <Input 
                                            type="text"
                                            placeholder="Имя*"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Input 
                                            type="tel"
                                            placeholder="Номер телефона*"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <Input 
                                            type="text"
                                            placeholder="Ваш комментарий"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formBottom}>
                                    <span>Нажимая "Отправить заявку", вы соглашаетесь с <Link to="/privacy" className={styles.formLink}>Политикой конфиденциальности</Link></span>
                                    <div>
                                        <Button
                                            includeArrow={true}
                                            type="submit"
                                            isDisabled={isSubmitting}
                                        >{isSubmitting ? "Отправляется..." : "Оставить заявку"}</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessModal && createPortal(
                <div className={styles.modalOverlay} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowSuccessModal(false);
                    }
                }}>
                    <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                        <button 
                            type="button"
                            className={styles.closeButton} 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowSuccessModal(false);
                            }}
                        >
                            <CloseIcon />
                        </button>
                        
                        <div className={styles.successContainer}>
                            <div className={styles.textContainer}>
                                <h3 className={styles.successTitle}>Благодарим Вас за оставленную заявку!</h3>
                                <p className={styles.successDesc}>Наши специалисты свяжутся с Вами в ближайшее время, чтобы обсудить детали Вашей заявки и ответить на все Ваши вопросы.</p>
                            </div>
                            <div className={styles.buttonContainer}>
                                <Button onClick={() => setShowSuccessModal(false)}>Продолжить</Button>  
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default AboutUsPage;
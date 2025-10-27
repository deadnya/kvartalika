import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../Button";
import { Input } from "../Input/Input";
import styles from "./FindApartmentModal.module.css"

import CloseIcon from "../../../assets/icons/close.svg?react"
import { Link } from "react-router-dom";

interface FindApartmentModalProps {
    onClose?: () => void;
}

interface FormData {
    lastName: string;
    firstName: string;
    patronymic: string;
    phone: string;
    email: string;
}

interface FormErrors {
    firstName?: string;
    phone?: string;
}

const FindApartmentModal = ({ onClose }: FindApartmentModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        lastName: "",
        firstName: "",
        patronymic: "",
        phone: "",
        email: ""
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = () => {
        onClose?.();
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Имя обязательно";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Номер телефона обязателен";
        } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = "Некорректный номер телефона";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Form submitted with data:", formData);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setFormData({
                lastName: "",
                firstName: "",
                patronymic: "",
                phone: "",
                email: ""
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                <button 
                    type="button"
                    className={styles.closeButton} 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClose();
                    }}
                >
                    <CloseIcon />
                </button>
                
                {isSuccess ? (
                    <div className={styles.successContainer}>
                        <div className={styles.textContainer}>
                            <h3 className={styles.successTitle}>Благодарим Вас за оставленную заявку!</h3>
                            <p className={styles.successDesc}>Наши специалисты свяжутся с Вами в ближайшее время, чтобы обсудить детали Вашей заявки и ответить на все Ваши вопросы.</p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button onClick={handleClose}>Продолжить</Button>  
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.topContainer}>
                        <h3 className={styles.modalTitle}>Готовы найти свою идеальную квартиру?</h3>
                        <p className={styles.modalDesc}>Оставьте заявку на просмотр квартиры и наш менеджер подберет лучшие варианты специально для вас</p>
                    </div>

                    <div className={styles.formContainer}>
                        <div className={styles.inputsContainer}>
                            <Input 
                                type="text"
                                placeholder="Фамилия"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                            />
                            <div>
                                <Input 
                                    type="text"
                                    placeholder="Имя*"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                />
                                {errors.firstName && <span style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</span>}
                            </div>
                            <Input 
                                type="text"
                                placeholder="Отчество"
                                value={formData.patronymic}
                                onChange={(e) => handleInputChange("patronymic", e.target.value)}
                            />
                            <div>
                                <Input 
                                    type="tel"
                                    placeholder="Номер телефона*"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                />
                                {errors.phone && <span style={{ color: "red", fontSize: "12px" }}>{errors.phone}</span>}
                            </div>
                            <Input 
                                type="email"
                                placeholder="Электронная почта"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </div>

                        <div className={styles.bottomContainer}>
                            <p className={styles.bottomText}>Нажимая "Отправить заявку", вы соглашаетесь с <Link to="/privacy" className={styles.bottomTextLink}>Политикой конфиденциальности</Link></p>
                            <div className={styles.buttonContainer}>
                                <Button
                                    includeArrow={true}
                                    type="submit"
                                    disabled={isSubmitting}
                                >{isSubmitting ? "Отправка..." : "Оставить заявку"}</Button>
                            </div>
                        </div>
                    </div>
                </form>
                )}
            </div>
        </div>,
        document.body
    );
};

export default FindApartmentModal;
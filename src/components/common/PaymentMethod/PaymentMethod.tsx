import React from 'react';
import styles from "./PaymentMethod.module.css"

interface PaymentMethodProps {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    title,
    description,
    icon: Icon
}) => {
    return (
        <div className={styles.paymentMethod}>
            <Icon />
            <div className={styles.paymentTextContainer}>
                <h3 className={styles.paymentTitle}>{title}</h3>
                <p className={styles.paymentDescription}>{description}</p>
            </div>
        </div>
    )
}

export default PaymentMethod;
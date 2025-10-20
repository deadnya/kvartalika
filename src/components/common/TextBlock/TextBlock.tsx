import React from 'react';
import styles from "./TextBlock.module.css"

interface TextBlockProps {
    title: string;
    children: React.ReactNode;
}

const TextBlock: React.FC<TextBlockProps> = ({ title, children }) => (
    <div className={styles.container}>
        <h2 className={styles.header}>{title}</h2>
        <div className={styles.content}>{children}</div>
    </div>
);

export default TextBlock;
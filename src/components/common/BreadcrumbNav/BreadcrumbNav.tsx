import { Link } from 'react-router-dom'
import styles from "./BreadcrumbNav.module.css"

import ChevronRightIcon from "../../../assets/icons/chevron-right.svg?react"

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbNavProps {
    currentPage?: string;
    items?: BreadcrumbItem[];
}

const BreadcrumbNav = ({ currentPage, items }: BreadcrumbNavProps) => {
    const breadcrumbs = items || (currentPage ? [{ label: currentPage }] : []);

    return (
        <nav className={styles.breadcrumbNav}>
            <Link
                to="/"
                className={styles.breadcrumbLink}
            >Главная</Link>
            {breadcrumbs.map((item, index) => (
                <div key={index} className={styles.breadcrumbItem}>
                    <ChevronRightIcon />
                    {item.path ? (
                        <Link to={item.path} className={styles.breadcrumbLink}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={styles.breadcrumbCurrent}>{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default BreadcrumbNav;

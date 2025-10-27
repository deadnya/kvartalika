import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
    items: ReactNode[];
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
}

const Carousel = ({ items, activeIndex: controlledIndex, onActiveIndexChange }: CarouselProps) => {
    const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
    const isControlled = controlledIndex !== undefined;
    const activeIndex = isControlled ? controlledIndex : uncontrolledIndex;

    const handleDotClick = (index: number) => {
        if (isControlled) {
            onActiveIndexChange?.(index);
        } else {
            setUncontrolledIndex(index);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className={styles.carousel}>
            <div className={styles.carouselContent}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.carouselItem} ${index === activeIndex ? styles.active : ''}`}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {items.length > 1 && (
                <div className={styles.dots}>
                    {items.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;

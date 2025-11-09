import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

export const useIntersectionObserver = (
    options: UseIntersectionObserverOptions = {}
) => {
    const { triggerOnce = true, threshold = 0.1, rootMargin = '0px', ...rest } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasBeenVisible = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                hasBeenVisible.current = true;
                if (triggerOnce && ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, {
            threshold,
            rootMargin,
            ...rest,
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
            observer.disconnect();
        };
    }, [triggerOnce, threshold, rootMargin]);

    return { ref, isVisible, hasBeenVisible: hasBeenVisible.current };
};

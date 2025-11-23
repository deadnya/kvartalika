import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

export const useIntersectionObserver = (
    options: UseIntersectionObserverOptions = {}
) => {
    const { triggerOnce = true, threshold = 0.1, rootMargin = '0px', ...rest } = options;
    const [ref, setRef] = useState<Element | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasBeenVisible = useRef(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                hasBeenVisible.current = true;
                if (triggerOnce) {
                    observer.unobserve(ref);
                }
            }
        }, {
            threshold,
            rootMargin,
            ...rest,
        });

        observer.observe(ref);

        return () => {
            observer.unobserve(ref);
            observer.disconnect();
        };
    }, [ref, triggerOnce, threshold, rootMargin]);

    return { ref: setRef, isVisible, hasBeenVisible: hasBeenVisible.current };
};

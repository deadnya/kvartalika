import React from 'react';
import { type ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
    const portalRoot = document.getElementById('portal-root');
    
    if (!portalRoot) {
        console.warn('Portal root element not found');
        return null;
    }
    
    return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;

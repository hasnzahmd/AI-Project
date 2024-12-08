import { useEffect } from 'react';
import Report from './Report';

const ViewReportModal = ({ isOpen, onClose, report, info }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            onClick={handleBackgroundClick}
        >   
            <Report report={report} onRequestClose={onClose} info={info}/>
        </div>
    );
};

export default ViewReportModal;

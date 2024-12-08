import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import userIcon from '../images/user-icon.png';
import copyIcon from '../images/copy-icon.png';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaTimes } from 'react-icons/fa';
import Notification from './Notification'

const Report = ({ report, onRequestClose, info }) => {

    const [showNotification, setShowNotification] = useState(false);

    const reportText = useMemo(() => `${report}\n`?.split(" \\\n")?.join("\n"), [report]);

    const processedReport = useMemo(() => {
        if (report) {
            let updatedReport = report;
            return `${updatedReport}\n`?.split(" \\\n")?.join("\n");
        }
        return '';
    }, [report]);

    const components = {
        h1: ({ children, ...props }) => <h1 style={{ fontSize: '2em', fontWeight: 'bold', margin: '20px 0 10px' }} {...props}>{children}</h1>,
        h2: ({ children, ...props }) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '15px 0 10px' }} {...props}>{children}</h2>,
        h3: ({ children, ...props }) => <h3 style={{ fontSize: '1.17em', fontWeight: 'bold', margin: '10px 0 5px' }} {...props}>{children}</h3>,
        p: ({ children, ...props }) => <p style={{ margin: '10px 0' }} {...props}>{children}</p>,
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false };
        return date.toLocaleString('en-US', options);
    };

    const handleCopyClicked = () => {
        setShowNotification(true)
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    }

    return (
        <>
            <div className="relative card-shadow no-scrollbar max-w-[764px] w-[130vw] md:w-[80vw] lg:w-[60vw] h-[95vh] sm:h-[110vh] rounded-md shadow-md overflow-auto scale-[0.85]">
                <FaTimes className="fixed top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onRequestClose} size={1} />
                <div>
                    <div className='flex justify-between border-b border-b-1 border-b-[#E5E7EC] p-[20px] sm:p-[32px]'>
                        <div className="flex w-full gap-2 sm:gap-10 lg:gap-16">
                            <div className='flex gap-2'>
                                <div className='w-[44px] h-[44px] border border-[#E2E4E9] rounded-full flex justify-center items-center md:mr-2'>
                                    <img src={userIcon} alt='user icon not found' width={20} height={20} />
                                </div>
                                <div>
                                    <p className='text-[14px] text-[#71717a] font-medium'>
                                        Patient
                                    </p>
                                    <p className='text-[14px] text-black font-medium'>{info.patientName}</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-[14px] text-[#71717a] font-medium'>
                                    Doctor
                                </p>
                                <p className='text-[14px] text-black font-medium'>{info.doctorName}</p>
                            </div>
                            <div>
                                <p className='text-[14px] text-[#71717a] font-medium'>
                                    Clinic
                                </p>
                                <p className='text-[14px] text-black font-medium'>{info.clinicName}</p>
                            </div>
                            <div>
                                <p className='text-[14px] text-[#71717a] font-medium'>Report Date</p>
                                <p className='text-[14px] text-black font-medium'>{formatDate(new Date())}</p>
                            </div>
                        </div>
                        <CopyToClipboard disabled={!report} text={report ? reportText : "N/A"} onCopy={() => { handleCopyClicked() }}>
                            <div style={{ borderRadius: '10px' }} className='border cursor-pointer md:w-[40px] w-1/2 h-[40px] hover:border-[#CED0D5] border-[#E2E4E9] md:mr-[10px] flex justify-center items-center'>
                                <img src={copyIcon} alt='copy icon not found' width={'20px'} height={'20px'} />
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className="container mx-auto px-4 mt-4 flex flex-col">
                        <div className='border-b border-b-1 border-b-[#E5E7EC] p-[20px] py-[10px] sm:px-[32px] sm:py-[16px] wg-ignore'>
                            <ReactMarkdown components={components}>{processedReport}</ReactMarkdown>
                        </div>
                    </div>
                </div>
                {showNotification && <Notification text={'Copied'} color={'bg-[#1F232E]'} />}
            </div>
        </>
    );
};

export default Report;
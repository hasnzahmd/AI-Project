import { useEffect, useRef, useCallback, useState } from 'react';
import UpoloadFile from '../images/upload.png';
import CheckCircle from '../images/check-circle.png'
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button'
import { GradientBorder } from './ui/GradientBorder';
import GeneratingIcon from '../images/generating.gif'
import Loader from './Loader';
import { toast } from 'react-toastify'
import { CardWrapper } from './ui/CardWrapper';
import RecordForm from './RecordForm';
import { fetchReport } from '../utils/apis';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [AudioDuration, setAudioDuration] = useState(0)
  const [uploadModelOpen, setUploadModelOpen] = useState(false)
  const [generateReport, setGenerateReport] = useState('')
  const [resetState, setResetState] = useState()

  const navigate = useNavigate()

  const handleResetState = useCallback(() => {
    setSelectedFile(null);
    setAudioDuration(0);
    setUploadModelOpen(false);
    setGenerateReport('');
    setResetState(prevState => !prevState); 
  }, []);

  useEffect(() => {
    const theFile = document.getElementById('fileInput');
    const initialize = () => {
      document.body.onfocus = checkIt;
    };
    const checkIt = () => {
      if (theFile.value.length === 0) {
        setUploadModelOpen(false);
      }
      document.body.onfocus = null;
    };
    theFile?.addEventListener('click', initialize);
    return () => {
      theFile?.removeEventListener('click', initialize);
    };
  }, [resetState]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadModelOpen(false)
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio?.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    return timeString.toLocaleString('en-US');
  };

  const handleDrop = (event) => {
    if (disabled) return;
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
  };

  const handleDragOver = (event) => {
    if (disabled) return;
    event.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleGenerateReport = async (data) => {
    const { reportLanguage, audioLanguage } = data;
    const file = data.selectedFile || data.recordedAudioBlob;
  
    console.log('File to upload:', file); 
  
    if (!file) {
      toast.error('No file selected for upload.');
      return;
    }
  
    try {
    
      const allowedAudioTypes = [
        'audio/flac',
        'audio/mp4',
        'video/mp4',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'video/webm',
        'audio/webm',
        'audio/x-m4a',
        'audio/x-wav',
      ];

      if (file.size / (1024 * 1024) > 90.0) {
        toast.error('The audio file is too large. The maximum size is 90 MB.');
        return;
      }
      if (!allowedAudioTypes.includes(file.type)) {
        toast.error('Please upload an audio file.');
        return;
      }
  
      localStorage.setItem('audio_language', audioLanguage);
      localStorage.setItem('report_language', reportLanguage);

      const fields = ["diagnosis", "findings", "medication", "procedure", "recipes", "therapy"];

      const formData = new FormData();
      formData.append('audio_file', file);
      formData.append('report_language', reportLanguage);
      formData.append('audio_language', audioLanguage);
      formData.append('fields', fields)

      const response = await fetchReport(formData);
      if(response){
        console.log('report:', response.report);
        setGenerateReport('upload-report-generated');
      } else
        setGenerateReport('');

    } catch (error) {
      console.log('API error ', error);
      toast.error('The report could not be created. Please try again.');
    }
  };

  const handleGoToReport = () => {
    navigate('/')
  }

  const disabled = false;

  return (
    <div>
      {
        !selectedFile && generateReport === '' && (
          <>
            <CardWrapper dashedBorder={true}>
              <div
                className={`flex flex-col items-center justify-center ${disabled && 'cursor-not-allowed'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={!disabled ? handleBrowseClick : undefined}
                data-tooltip-id='no-words' data-tooltip-content='No more words left. Please contact MPAssist.'
              >
                <GradientBorder>
                  <div className="shadow-sm bg-white rounded-full px-4 py-4">
                    {uploadModelOpen ? (
                      <img width={'24px'} src={GeneratingIcon} alt='recording mic ' loading='eager'  />
                    ):(
                      <img width={'24px'} src={UpoloadFile} alt='recording mic ' />
                    )}
                  </div>
                </GradientBorder>
                {uploadModelOpen ? (
                  <>
                    <h1 className='text-[24px] sm:w-[320px] max-w-[320px] font-medium mt-[16px]'>Selecting</h1>
                    <p className='mt-[4px] sm:w-80 font-SuisseIntlLight font-normal text-[16px] text-[#505050]'>Please wait few seconds</p>
                  </>
                ) : (
                  <>
                    <h1 className='text-[24px] font-medium mt-[16px]'>Choose a file or drag & drop it here</h1>
                      <p className='mt-[4px] sm:w-[320px] max-w-[320px] text-[16px] font-SuisseIntlLight font-normal text-[#505050]'>All standard web formats are supported and the maximum file upload size is 2 GB</p>
                  </>
                )}
                <input
                  type="file"
                  onClick={() => { setUploadModelOpen(true) }}
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                  id="fileInput"
                  accept="audio/*, video/mp4, video/webm"
                />
                <label htmlFor="fileInput">
                  <Button className={`mt-[16px] ${disabled && 'cursor-not-allowed opacity-80'}`} >
                  Browse files
                  </Button>
                </label>
              </div>
            </CardWrapper>
          </>
        )
      }
      {
        selectedFile && generateReport === '' && (
          <CardWrapper>
            <div className='flex flex-col justify-center items-center w-full'>
              <GradientBorder variant={2}>
                <div className="shadow-sm bg-white rounded-full px-4 py-4">
                  <img width={'24px'} src={CheckCircle} alt='recording mic ' />
                </div>
              </GradientBorder>
              <h1 className='font-medium mt-[16px] text-[24px]'>Selected · <span data-wg-notranslate>{formatTime(AudioDuration)} </span></h1>
              <p className='sm:w-[320px] max-w-[320px] mt-[4px] text-[16px] text-[#505050] font-SuisseIntlLight font-normal'>Click the button below to start generating the report</p>
              <RecordForm GenerateReport={setGenerateReport} HandleResetState={handleResetState} handleGenerateReport={handleGenerateReport} recordedAudioBlob={selectedFile} />
                </div>
          </CardWrapper>
        )
      }

      {
        generateReport === 'generating' && (
          <CardWrapper>
          <div className='flex flex-col justify-center items-center'>
              <GradientBorder>
                <div className="shadow-sm bg-white rounded-full px-4 py-4">
                  <Loader />
                </div>
              </GradientBorder>
              <>
                <h1 className='font-medium mt-[16px] text-[24px]'>Generating...</h1>
                  <p className='sm:w-[320px] max-w-[320px] text-[#505050] mt-[4px] font-SuisseIntlLight font-normal text-[16px]'>Please wait for a few minutes until your report is ready</p>
              </>
            </div>
          </CardWrapper>
        )
      }
      {
        generateReport === 'upload-report-generated' && (
          <CardWrapper>
          <div className='flex flex-col justify-center items-center'>
              <GradientBorder variant={2}>
                <div className="shadow-sm bg-white rounded-full px-4 py-4">
                  <img width={'24px'} src={CheckCircle} alt='recording mic ' />
                </div>
              </GradientBorder>
              <h1 className='font-medium mt-[16px] text-[24px]'>The report has been generated</h1>
              <p className='sm:w-[320px] max-w-[320px] mt-[4px] text-[#505050] font-SuisseIntlLight font-normal text-[16px]'>You can review it by clicking the button below</p>
              <div>
                <Button variant='light' className='mt-[16px]' onClick={handleGoToReport}>
                  Go to report 
                </Button>
              </div>
            </div>
          </CardWrapper>
        )
      }
    </div >
  );
};

// const UploadFile = () => {
//   return (
//     <div>
//       <h1>UploadFile</h1>
//     </div>
//   )
// }

export default UploadFile;

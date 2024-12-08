import { useState } from "react";
import UploadFile from "./components/UploadFile"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import ViewReportModal from "./components/view-report-modal";

function App() {

  const [info, setInfo] = useState({
    patientName: localStorage.getItem('patient_name') || '',
    doctorName: localStorage.getItem('doctor_name') || '',
    clinicName: localStorage.getItem('clinic_name') || ''
  })
  const [generateReport, setGenerateReport] = useState('')
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState('');

  return (
    <div className="flex h-screen justify-center items-center bg-black">
      <ToastContainer position="top-right"/>
      <div className="p-4 bg-white rounded-2xl">
        {!showReport && 
          <UploadFile 
            setReport={setReport} 
            setShowReport={setShowReport}
            generateReport={generateReport}
            setGenerateReport={setGenerateReport}
            info={info}
            setInfo={setInfo}
          />
        }
        <ViewReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          report={report}
          info={info}
        />
      </div>
    </div>
  )
}

export default App

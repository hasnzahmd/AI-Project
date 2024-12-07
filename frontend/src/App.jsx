import UploadFile from "./components/UploadFile"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <div className="flex h-screen justify-center items-center bg-black">
      <ToastContainer position="top-right"/>
      <div className="bg-white p-4 rounded-2xl">
        <UploadFile />
      </div>
    </div>
  )
}

export default App

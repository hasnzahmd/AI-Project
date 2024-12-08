import axios from 'axios'
import { toast } from 'react-toastify';

const API_URL = 'http://127.0.0.1:8000/generate-report';

export const fetchReport = async (data) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        toast.success('Report generated')
        return response.data
    } catch (error) {   
        console.log('error: ', error)
        toast.error('The report could not be created. Please try again.');
    }
}
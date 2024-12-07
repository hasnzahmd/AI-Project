import { useState, useEffect } from 'react';
// import TextInput from './ui/TextInput';
import DropDown from './ui/DropDown';
import Button from './ui/Button';
import { toast } from 'react-toastify';
import { languages, allModelsLanguageList } from '../constants/constants';

export default function RecordForm({ GenerateReport, recordedAudioBlob, handleGenerateReport }) {   

    const [formState, setFormState] = useState({
        audioLanguage: localStorage.getItem('audio_language') || 'en',
        reportLanguage: localStorage.getItem('report_language') || 'en',
    });

    useEffect(() => {
        setFormState((prev) => ({ ...prev, recordedAudioBlob }));
    }, [recordedAudioBlob]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormState((prev) => ({ ...prev, [name]: value }));
    // };
    
    const handleDropDownChange = (value) => {
        setFormState((prev)=>({...prev, [value.name]:value.value}))
    }

    const handleGenerateNewReport = async (e) => {
        e.preventDefault();
        const { audioLanguage, reportLanguage } = formState;

        if (!reportLanguage || !audioLanguage) {
            toast.error("Please fill in all fields before sending.");
            return;
        }

        const data = {
            recordedAudioBlob,
            reportLanguage,
            audioLanguage,
        };

        try {
            GenerateReport('generating');
            await handleGenerateReport(data);
        } catch (error) {
            console.error("Error generating report: ", error);
            toast.error("The report could not be created. Please try again.");
        }
    };

    const inputLanguages = allModelsLanguageList.filter(item => item.name !== "German (Switzerland)");
    const outputLanguages = languages.map(item => ({ name: item.name, value: item.name.toLowerCase() }));

    return (
        <div className='w-full'>
            <form className='text-left w-full' onSubmit={handleGenerateNewReport}>
                <div className='mt-[24px] flex flex-col gap-[24px]'>
                    <div className='flex-1'>
                        <DropDown
                            label='Audio language'
                            options={inputLanguages}
                            handleOnChange={(value) => { handleDropDownChange({ name: 'audioLanguage', value: value }) }}
                            selectedValue={formState.audioLanguage}
                        />
                    </div>
                    <div className='flex-1'>
                        <DropDown
                            label='Report language'
                            options={outputLanguages}
                            handleOnChange={(value) => { handleDropDownChange({ name: 'reportLanguage', value: value }) }}
                            selectedValue={formState.reportLanguage}
                        />
                    </div>
                </div>
                <div className="sm:flex gap-[24px] mt-[24px]">
                    <Button type='submit'>
                        Generate report
                    </Button>
                </div>
            </form>
        </div>
    );
}

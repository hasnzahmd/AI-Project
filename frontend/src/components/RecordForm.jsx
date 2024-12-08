import { useState, useEffect } from 'react';
import TextInput from './ui/TextInput';
import DropDown from './ui/DropDown';
import Button from './ui/Button';
import { toast } from 'react-toastify';
import { languages, allModelsLanguageList } from '../constants/constants';

export default function RecordForm({ GenerateReport, recordedAudioBlob, handleGenerateReport, info, setInfo }) {   

    const [formState, setFormState] = useState({
        template: localStorage.getItem('template') || '',
        audioLanguage: localStorage.getItem('audio_language') || 'en',
        reportLanguage: localStorage.getItem('report_language') || 'en',
    });

    useEffect(() => {
        setFormState((prev) => ({ ...prev, recordedAudioBlob }));
    }, [recordedAudioBlob]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleDropDownChange = (value) => {
        setFormState((prev)=>({...prev, [value.name]:value.value}))
    }

    const handleGenerateNewReport = async (e) => {
        e.preventDefault();
        const { audioLanguage, reportLanguage, template } = formState;

        if (!reportLanguage || !audioLanguage || !template || !info.patientName || !info.doctorName || !info.clinicName) {
            toast.error("Please fill in all fields.");
            return;
        }

        localStorage.setItem('patient_name', info.patientName)
        localStorage.setItem('doctor_name', info.doctorName)
        localStorage.setItem('clinic_name', info.clinicName)
        
        const data = {
            recordedAudioBlob,
            reportLanguage,
            audioLanguage,
            template
        };

        try {
            GenerateReport('generating');
            await handleGenerateReport(data);
        } catch (error) {
            console.error("Error generating report: ", error);
            toast.error("The report could not be created. Please try again.");
        }
    };

    const getTemplates = () => {
        return[{ name: 'No template', value: 'no_template' }, {name: 'AI template', value: 'ai_template'}];
    }

    const inputLanguages = allModelsLanguageList.filter(item => item.name !== "German (Switzerland)");
    const outputLanguages = languages.map(item => ({ name: item.name, value: item.name.toLowerCase() }));

    return (
        <div className='w-full'>
            <form className='text-left w-full' onSubmit={handleGenerateNewReport}>
            <div className='mt-[24px] flex flex-col sm:flex-row gap-[24px]'>
                    <TextInput required name='patientName' label='Patient name' placeholder='Enter patient name' type='text' value={info.patientName} onChange={handleChange} />
                    <TextInput required name='doctorName' label='Doctor name' placeholder='Enter doctor name' type='text' value={info.doctorName} onChange={handleChange} />
                </div>
                <div className='mt-[24px] flex flex-col sm:flex-row gap-[24px]'>
                    <TextInput required name='clinicName' label='Clinic name' placeholder='Enter clinic name' type='text' value={info.clinicName} onChange={handleChange} />
                    <DropDown
                        label='Template'
                        options={getTemplates()}
                        handleOnChange={(value) => { handleDropDownChange({ name: 'template', value: value }) }}
                        selectedValue={formState.template === 'select_template' ? null : formState.template}
                        defaultValue={"select_template"}
                    />
                </div>
                <div className='mt-[24px] flex flex-col sm:flex-row gap-[24px]'>
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

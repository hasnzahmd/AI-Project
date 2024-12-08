from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from typing import List
from utils.transcribe_audio import transcribe_audio
from utils.generate_report import generate_report
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

app = FastAPI()

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.post("/generate-report")
async def generate_medical_report(
    audio_file: UploadFile = File(...),
    template: str = Form(...),
    audio_language: str = Form(...),
    report_language: str = Form(...)
):
    try:
        # Save the uploaded file temporarily
        file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
        print('file_path:', file_path)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        transcriptions = await transcribe_audio(file_path, audio_language)
        report = await generate_report(transcriptions, report_language, template)
        
        os.remove(file_path)
        return {"message": "Medical report generated successfully", "report": report}
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error generating medical report: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
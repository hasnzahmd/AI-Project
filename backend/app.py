from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from typing import List
from utils.transcribe_audio import transcribe_audio
from utils.generate_report import generate_structured_report
import os
import shutil

app = FastAPI()

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/generate-medical-report")
async def generate_medical_report(
    file: UploadFile = File(...),
    fields: List[str] = Form(...),
    audio_language: str = Form(...),
    report_language: str = Form(...)
):
    try:
        # Save the uploaded file temporarily
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read the file in binary mode
        with open(file_path, "rb") as buffer:
            audio_buffer = buffer.read()

        transcriptions = await transcribe_audio(audio_buffer, audio_language)
        structured_report = await generate_structured_report(transcriptions, report_language, fields)
        os.remove(file_path)

        return {"message": "Medical report generated successfully", "report": structured_report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating medical report: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
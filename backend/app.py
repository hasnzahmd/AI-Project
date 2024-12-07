from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.transcribe_audio import transcribe_audio
from utils.generate_report import generate_structured_report

app = FastAPI()

class ReportRequest(BaseModel):
    audio_url: str
    fields: list[str]
    audio_language: str
    report_language: str

@app.post("/generate-medical-report")
async def generate_medical_report(request: ReportRequest):
    try:
        transcriptions = await transcribe_audio(request.audio_url, request.audio_language)
        structured_report = await generate_structured_report(transcriptions, request.report_language, request.fields)

        return structured_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating medical report: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
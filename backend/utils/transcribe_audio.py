from deepgram import DeepgramClient, PrerecordedOptions, FileSource
import assemblyai as aai
import asyncio
import os

deepgram = DeepgramClient()
aai.settings.api_key = os.getenv('ASSEMBLY_AI_API_KEY') 

async def convert_audio_to_transcript(file_path, buffer_data, model, language):
    try:
        if model in ["nova-2", "whisper-large"]:
            print(f"    Transcribing with Deepgram model - {model}")
            
            payload: FileSource = {
	            "buffer": buffer_data,
            }
            
            options = PrerecordedOptions(
                model="nova-2",
                language=language,
                smart_format=True,
                numerals=True,
                dictation=True
            )
            response = deepgram.listen.rest.v("1").transcribe_file(payload, options)
            
            transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]
            confidence = response["results"]["channels"][0]["alternatives"][0]["confidence"]
            
            print('Transcription of model:', transcript)
            return {
                "result": transcript,
                "confidence": confidence,
                "model": model,
            }
        
        elif model == "assembly-ai":
            print(f"    Transcribing with Assembly AI model - {model}")
            config = aai.TranscriptionConfig(
                language_code=language,
                format_text=False,
            )
            transcriber = aai.Transcriber(config=config)
            transcript = transcriber.transcribe(file_path)
            
            if transcript.status == aai.TranscriptStatus.error:
                raise Exception(f"Error transcribing with Assembly AI: {transcript.error}")

            print('Transcription of model:', transcript.text)
            return {
                "result": transcript.text,
                "confidence": transcript.confidence,
                "model": model,
            }
            

    except Exception as error:
        print('Error converting audio to text:', error)
        raise error

async def transcribe_audio(file_path, language):
    print('\n>>>>>> Generating transcripts from audio')
    try:
        with open(file_path, "rb") as file:
            buffer_data = file.read()
            
        nova, whisper, assembly = await asyncio.gather(
            convert_audio_to_transcript(file_path, buffer_data, "nova-2", language),
            convert_audio_to_transcript(file_path, buffer_data, "whisper-large", language),
            convert_audio_to_transcript(file_path, buffer_data, "assembly-ai", language)
        )

        print('>>>>>> Transcripts generation complete')
        transcriptions = {
            "nova_transcription": nova['result'],
            "whisper_transcription": whisper['result'],
            "assembly_transcription": assembly['result'],
        }

        return transcriptions

    except Exception as error:
        print('Error generating transcript from audio:', error)
        raise error

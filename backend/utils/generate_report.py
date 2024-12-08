import os
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from utils.contexts import generationContext, mergingContext, AIReportContext, NoTemplateContext

async def generate_from_text(transcriptions, language, template):
    nova_transcription = transcriptions['nova_transcription']
    whisper_transcription = transcriptions['whisper_transcription']
    assembly_transcription = transcriptions['assembly_transcription']

    if nova_transcription and whisper_transcription:
        try:
            # Preparing the report template with the provided fields
            if template == 'ai_template':
                report_template = AIReportContext
            elif template == 'no_template':
                report_template = NoTemplateContext

            # Create prompt templates
            merging_prompt = PromptTemplate.from_template(mergingContext)
            generation_prompt = PromptTemplate.from_template(generationContext)

            # Models based on service name
            service_name = os.getenv('SERVICE_NAME')
            if service_name == 'anthropic':
                merging_model = ChatAnthropic(model=os.getenv('ANTHROPIC_MODEL'))
                generation_model = ChatAnthropic(model=os.getenv('ANTHROPIC_MODEL'))
            else:
                merging_model = ChatOpenAI(model=os.getenv('OPENAI_MODEL'))
                generation_model = ChatOpenAI(model=os.getenv('OPENAI_MODEL'))

            # Set up Langchain chains for merging and generation
            merging_chain = merging_prompt | merging_model | StrOutputParser()
            generation_chain = generation_prompt | generation_model | StrOutputParser()
            
            
            # Merging the transcriptions
            merging_result = merging_chain.invoke({
                'nova_transcription': nova_transcription, 
                'whisper_transcription': whisper_transcription,
                'assembly_transcription': assembly_transcription, 
            })
            
            # Generating the report
            generation_result = generation_chain.invoke({
                'transcription': merging_result, 
                'language': language, 
                'template': report_template
            })
            
            print('result:', generation_result)
            return generation_result

        except Exception as error:
            raise RuntimeError(f"Error during report generation: {error}")


async def generate_report(transcriptions, language, template):
    try:
        print('\n>>>>>> Generating JSON response')
        
        print('template:', template)
        response = await generate_from_text(transcriptions, language, template)
        
        report = response
        
        print('>>>>>> Response generated successfully')

        return report

    except Exception as error: 
        print('Error generating structured report', error)
        raise error

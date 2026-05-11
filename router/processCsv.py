from fastapi import APIRouter,UploadFile,responses
import pandas as pd
from io import StringIO,BufferedWriter
from engine import csvEngine
router = APIRouter( prefix="/process-csv")

@router.post("/")
async def Handle(file  : UploadFile):
    Read = await file.read()
    print(file.content_type)
    stringData = Read.decode("utf-8")
    csv = pd.read_csv(StringIO(stringData))
    # Data Manipulation Start

    csvEngine.Data(csv,process="lowercase")

    # Data Manipulation End
    stream = StringIO()
    csv.to_csv(stream, index=False)
    stream.seek(0)
    return responses.StreamingResponse(stream,media_type="text/csv")
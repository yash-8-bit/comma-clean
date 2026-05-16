from fastapi import APIRouter,UploadFile,responses,Form,File
from typing import Annotated
import pandas as pd
from io import StringIO
from engine import csvEngine,formValidation
router = APIRouter( prefix="/process-csv")

@router.post("/")
async def Handle(OperationType: Annotated[str, Form()], process: Annotated[str, Form()],csv : Annotated[UploadFile,File()]):
    result = formValidation.Validation(csv,OperationType)
    if not result["status"]:
        return {"message" : result["message"]}
    Read = await csv.read()
    stringData = Read.decode("utf-8")
    csv = pd.read_csv(StringIO(stringData))
    
    # Data Manipulation Start
    
    if OperationType == "Header":
        csvEngine.Headers(csv,process="lowercase")
    elif OperationType == "Data":
        csvEngine.Data()     
        
    # Data Manipulation End
    
    stream = StringIO()
    csv.to_csv(stream, index=False)
    stream.seek(0)
    return responses.StreamingResponse(stream,media_type="text/csv")
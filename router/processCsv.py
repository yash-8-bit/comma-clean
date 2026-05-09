from fastapi import APIRouter,UploadFile,File,responses
import pandas as pd
from io import StringIO

router = APIRouter( prefix="/process-csv")

@router.post("/")
async def Handle(file  : UploadFile):
    Read = await file.read()
    stringData = Read.decode("utf-8")
    f = pd.read_csv(StringIO(stringData))
    print(f.columns)
    f.columns = [a.upper() for a in f.columns]
    print(f)

    return {"Recieved",file.filename}
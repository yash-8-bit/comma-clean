from fastapi import APIRouter,UploadFile,responses,Form,File
from typing import Annotated
import pandas as pd
from io import StringIO
from engine import csvEngine,formValidation
import json

router = APIRouter( prefix="/process-csv")

@router.post("/")
async def Handle(
                 OperationType: Annotated[list[str], Form()], 
                 process: Annotated[list[str], Form()],
                 csvFile : Annotated[UploadFile,File()],
                 helpers : Annotated[str,Form()] = None):
    result = formValidation.Validation(csvFile,OperationType,process)
    try :
        helpers_:dict = json.loads(helpers)
    except :
        return responses.JSONResponse({"message" : "Helper is not Valid"},status_code=400)
    try:
        if not result["status"]:
            return responses.JSONResponse({"message" : result["message"]},status_code=400)
        Read = await csvFile.read()
        stringData = Read.decode("utf-8")
        csv = pd.read_csv(StringIO(stringData))
    
       # Data Manipulation Start
    
        if "Header" in OperationType:
            csvEngine.Headers(csv,
                              process=process[0],
                              SpecialColumns=helpers_.get("SpecialColumns",[]))
        if "Data" in OperationType :
            csvEngine.Data(csv ,
                           process=process,
                           byRow=helpers_.get("byRow",True),
                           defaultValueFill=helpers_.get("defaultValueFill" , ""),
                           SpecialColumns=helpers_.get("SpecialColumns",[]))     
    
        # Data Manipulation End 
        
        stream = StringIO()  
        csv.to_csv(stream, index=False) 
        stream.seek(0)
        return responses.StreamingResponse(stream,media_type="text/csv")
    except:
         return responses.JSONResponse({"message" :"Internal Server Error"},status_code=500)
     
     
     

@router.post("/columnsName")
async def Handle(csvFile : Annotated[UploadFile,File()]):
    try :
        Read = await csvFile.read()
        print(Read)
        stringData = Read.decode("utf-8")
        csv = pd.read_csv(StringIO(stringData))
        col = [i for i in csv.columns]
        return responses.JSONResponse({"data" : ",".join((col))},status_code=200)
    except:
         return responses.JSONResponse({"message" :"Internal Server Error"},status_code=500)
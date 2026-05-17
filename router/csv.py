from fastapi import APIRouter,Request
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/submit-csv")

templates = Jinja2Templates(directory="pages")

@router.get("/")
def csv(request :Request):
    basicColumns = [{
            "name":"header",
            "label":"Header",
            "id" : "headerInput"
        },{
            "name":"data",
            "label":"Data",
            "id" : "DataInput"
        }]
    radioprocess = [{
        "id" : "_1",
        "name" : "process1",
        "labels":["Uppercase","Lowercase","Capitalize"]
    },{
        "id" : "_2",
        "name":"process2",
        "labels":["Remove Missing","Fill Default"]
    }]
   
    return  templates.TemplateResponse(
        request=request, name="submitCsv.html",
        context={"basicColumns" :basicColumns,"process":radioprocess}
        
    )
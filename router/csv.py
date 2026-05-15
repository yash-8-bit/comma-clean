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
    process = [{
            "name":"uppercase",
            "label":"Uppercase",
            "id" : "uppercaseInput"
        },{
            "name":"lowercase",
            "label":"Lowercase",
            "id" : "lowercaseInput"
        },
        {
            "name":"capitalize",
            "label":"Capitalize",
            "id" : "capitalizeInput"
        },
        {
            "name":"removeMissing",
            "label":"Remove Missing",
            "id" : "removeMissingInput"
        },
        {
            "name":"fillDefault",
            "label":"Fill Default",
            "id" : "fillDefaultInput"
        },
        
        ]
    return  templates.TemplateResponse(
        request=request, name="submitCsv.html",
        context={"basicColumns" :basicColumns,"process":process}
        
    )
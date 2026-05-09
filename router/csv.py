from fastapi import APIRouter,Request
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/submit-csv")

templates = Jinja2Templates(directory="pages")

@router.get("/")
def csv(request :Request):
    return  templates.TemplateResponse(
        request=request, name="submitCsv.html"
    )
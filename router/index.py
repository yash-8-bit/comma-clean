from fastapi import APIRouter,Request
router = APIRouter()
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="pages")

@router.get("/")
def home(request :Request):
    return  templates.TemplateResponse(
        request=request, name="home.html"
    )
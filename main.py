from fastapi import FastAPI,File, UploadFile
from fastapi.responses  import FileResponse
app = FastAPI()

@app.get("/")
def read_root():
    return FileResponse("./pages/home.html")

@app.post("/submit")
async def submit(file: UploadFile):
     return {"filetype": file.content_type}

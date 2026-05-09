from fastapi import FastAPI
from router import csv, index,processCsv
from fastapi.staticfiles import StaticFiles
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(index.router,tags=["Home"])
app.include_router(csv.router,tags=["Csv"])
app.include_router(processCsv.router,tags=["processCsv"])




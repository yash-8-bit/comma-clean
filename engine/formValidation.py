from fastapi import UploadFile

def Validation(csv : UploadFile,OperationType : str):
    validOperationType = ["Header","Data"]
    if csv.content_type not in  ["text/csv"]:
        return {"status" : False, "message" : "File must be a Csv."}
    if OperationType not in validOperationType:
        return {"status" : False, "message" : f"OperationType must be a {validOperationType}."}
    return {"status":True}
    
from fastapi import UploadFile

def Validation(csv : UploadFile,OperationType : list[str],process : list[str]):
    validOperationType = ["Header","Data"]
    validProcess = ["uppercase","lowercase","capitalize","removeMissing","fillDefault"]
    if csv.content_type not in  ["text/csv"]:
        return {"status" : False, "message" : "File must be a Csv."}
    for i in process:
        if i not in validProcess:
            return {"status" : False, "message" : f"Process must be a {",".join(validProcess)}."}
    for i in OperationType:
        if i not in validOperationType:
            return {"status" : False, "message" : f"OperationType must be a {" or ".join(validOperationType)}."}
    return {"status":True}
    
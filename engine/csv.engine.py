import pandas as pd



def Columns(csv : pd.DataFrame,process:str)-> pd.DataFrame:
    if process == "capitalize":
        csv.columns = [c.capitalize() for c in csv.columns]
    elif process == "uppercase":
        csv.columns = [c.upper() for c in csv.columns]
    elif process == "lowercase":
        csv.columns = [c.lower() for c in csv.columns]
    return csv

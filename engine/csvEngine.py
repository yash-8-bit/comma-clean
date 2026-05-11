import pandas as pd



def Headers(csv : pd.DataFrame,process:str)-> pd.DataFrame:
    if process == "capitalize":
        csv.columns = [c.capitalize() for c in csv.columns]
    elif process == "uppercase":
        csv.columns = [c.upper() for c in csv.columns]
    elif process == "lowercase":
        csv.columns = [c.lower() for c in csv.columns]
    


def Data(csv : pd.DataFrame,process:str,**helpers):
    SpecialColumns : list = helpers.get("SpecialColumns",[])
    allowedColumns = [i  for i in SpecialColumns  if i in csv.columns]
    col = allowedColumns or csv.columns
    if process == "uppercase":
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.upper()
    elif process == "lowercase":
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.lower()
    elif process == "capitalize":
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.capitalize()
    elif process == "removeMissing":
        type_ = helpers.get("byRow",True)
        csv.dropna(inplace=True,axis=type_)
    elif process == "fillDefault":
        key = "defaultValueFill"
        if(key in helpers):
            csv.fillna(helpers[key],inplace=True)
    
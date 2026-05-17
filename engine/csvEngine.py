import pandas as pd



def Headers(csv : pd.DataFrame,process:str,**helpers)-> pd.DataFrame:
    SpecialColumns : list = helpers.get("SpecialColumns",[])
    allowedColumns = [i  for i in SpecialColumns  if i in csv.columns]
    col = allowedColumns or csv.columns
    if process == "capitalize":
        func = lambda c : c.capitalize() if c in col else c
        csv.columns = [func(c) for c in csv.columns]
    elif process == "uppercase":
        func = lambda c : c.upper() if c in col else c
        csv.columns = [func(c) for c in csv.columns]
    elif process == "lowercase":
        func = lambda c : c.lower() if c in col else c
        csv.columns = [func(c) for c in csv.columns]
    


def Data(csv : pd.DataFrame,process:list[str],**helpers):
    SpecialColumns : list = helpers.get("SpecialColumns",[])
    allowedColumns = [i  for i in SpecialColumns  if i in csv.columns]
    col = allowedColumns or csv.columns
    if "uppercase" in process:
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.upper()
    elif "lowercase" in process :
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.lower()
    elif "capitalize" in process :
        for i in col : 
            if type(csv[i][0]) == type(""):
                csv[i] = csv[i].str.capitalize()
    if "removeMissing" in process:
        type_ = not helpers.get("byRow",True)
        csv.dropna(inplace=True,axis=type_)
    elif "fillDefault" in process:
        key = "defaultValueFill"
        if(key in helpers):
            csv.fillna(helpers[key],inplace=True)
    
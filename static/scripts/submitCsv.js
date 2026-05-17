let file;
const fileInput = document.getElementById("csvFileInput_");
const InputTag = document.getElementById("csvFileInput");
const filePara = document.getElementById("filePara");
const SubmitButton = document.getElementById("submit");
const dialog = document.getElementById("dialog");
const filters = document.getElementById("filters");
const process1 = document.getElementById("_1");
const process2 = document.getElementById("_2");

const dataInput = document.getElementById("DataInput");
dataInput.addEventListener("click", (e) => {
  const ele = document.querySelector("#filters #_2");
  const helper = document.getElementById("helperParent");

  if (e.target.checked) {
    ele.style.display = "block";
    if (helper) {
      helper.style.display = "block";
    }
  } else {
    ele.style.display = "none";
    if (helper) {
      helper.style.display = "none";
    }
  }
});

let col = [];

document.getElementById("clean").addEventListener("click", () => {
  window.location.reload();
});

process2.addEventListener("change", (event) => {
  const Value = event.target.value;
  document.getElementById("helperParent")?.remove();
  if (Value === "Fill Default") {
    const span = document.createElement("span");
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20;
    input.placeholder = "Enter Value";
    input.id = "FillDeafultValue";
    const div = document.createElement("div");
    div.id = "helperParent";
    span.appendChild(input);
    div.innerHTML = "<p>Fill Default :</p>";
    div.appendChild(span);

    filters.appendChild(div);
  } else if (Value === "Remove Missing") {
    const label1 = document.createElement("label");
    const label2 = document.createElement("label");
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    input1.type = input2.type = "radio";
    input1.name = input2.name = "MissingInputs";
    input1.value = "row";
    input2.value = "column";
    input1.id = label1.htmlFor = "byRowInputMissing";
    input2.id = label2.htmlFor = "byColumnInputMissing";
    label1.innerText = "By Row";
    label2.innerText = "By Column";
    input1.checked = true;
    const div = document.createElement("div");
    div.id = "helperParent";

    span1.appendChild(input1);
    span1.appendChild(label1);
    span2.appendChild(input2);
    span2.appendChild(label2);
    div.innerHTML = "<p>Remove Missing :</p>";
    div.appendChild(span1);
    div.appendChild(span2);
    filters.appendChild(div);
  }
});

const getBasicType = (row) => {
  switch (row) {
    case "headerInput":
      return "Header";
    case "DataInput":
      return "Data";
    default:
      return null;
  }
};

const getProcessType = (row) => {
  switch (row) {
    case "Uppercase":
      return "uppercase";
    case "Lowercase":
      return "lowercase";
    case "Capitalize":
      return "capitalize";
    case "Remove Missing":
      return "removeMissing";
    case "Fill Default":
      return "fillDefault";
    default:
      return null;
  }
};

function cleanDialog() {
  dialog.className = "";
  dialog.innerHTML = "";
}

function dialogMessage(message) {
  dialog.className = "dialogshown";
  dialog.innerHTML = `
    <div>${message}
    <button>Ok</button>
    </div>`;
  const action = document.querySelector("#dialog > div > button");
  action.addEventListener("click", cleanDialog);
}

async function handleCsvFile({ file, OperationType, process, helpers }) {
  const fd = new FormData();
  fd.append("csvFile", file);
  fd.append("helpers", JSON.stringify(helpers));

  for (const i of OperationType) {
    fd.append("OperationType", i);
  }
  for (const i of process) {
    fd.append("process", i);
  }
  const res = await fetch("/process-csv/", {
    body: fd,
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    dialogMessage("Something Wrong Try Again");
  } else {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "comma_clean.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
async function GetColumns({ file }) {
  const fd = new FormData();
  fd.append("csvFile", file);

  const res = await fetch("/process-csv/columnsName/", {
    body: fd,
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    dialogMessage("Something Wrong Try Again");
  } else {
    const data = await res.json();
    col = (data?.data || "").split(",");
  }
}

SubmitButton.addEventListener("click", (e) => {
  const basicIds = ["headerInput", "DataInput"];
  let OperationType = [];
  let process = [];
  if (!(file instanceof File)) {
    dialogMessage("Please Select a Csv File First");
    return;
  } else {
    for (const row of basicIds) {
      let x = document.getElementById(row);
      if (x.checked) OperationType.push(getBasicType(row));
    }
    if (OperationType.length === 0) {
      dialogMessage("Select atleast one basic filter");
      return;
    }
    const p1 = document.querySelector("#_1 input:checked")?.value || null;
    const p2 = document.querySelector("#_2 input:checked")?.value || null;

    if (p1 === null && p2 === null) {
      dialogMessage("Select atleast one process filter");
      return;
    }
    if (p1) process.push(getProcessType(p1));
    if (p2) process.push(getProcessType(p2));
  }
  const FillDefaultValue =
    document.getElementById("FillDeafultValue")?.value || null;

  const MissingInputsRadio =
    document.querySelector("#helperParent input[name='MissingInputs']:checked")
      ?.value || null;
  const Maindiv = document.createElement("div");
  Maindiv.className = "ColumnsDiv";
  const p = document.createElement("p");
  p.innerText = "Select Columns";
  Maindiv.appendChild(p);
  for (let i = 0; i < col.length; i++) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.innerText = col[i];
    label.htmlFor = `_col${i}`;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `_col${i}`;
    input.checked = true;
    div.appendChild(input);
    div.appendChild(label);
    Maindiv.appendChild(div);
  }
  const p1 = document.querySelector("#_1 input:checked")?.value || null;
  if (p1 == null) {
    handleCsvFile({
      file,
      process,
      OperationType,
      helpers: {
        byRow: MissingInputsRadio === "row",
        defaultValueFill: FillDefaultValue,
      },
    });
    return;
  }
  const div = document.createElement("div");
  const btn = document.createElement("button");
  const btn2 = document.createElement("button");
  btn.onclick = () => {
    const Selected = [];
    for (let i = 0; i < col.length; i++) {
      const isCheck = document.getElementById(`_col${i}`)?.checked;
      if (isCheck) Selected.push(col[i]);
    }
    if (Selected.length === 0) {
      dialogMessage("Atleast One Colums is Required");
      return;
    }
    handleCsvFile({
      file,
      process,
      OperationType,
      helpers: {
        byRow: MissingInputsRadio === "row",
        defaultValueFill: FillDefaultValue,
        ...(Selected.length === col.length ? {} : { SpecialColumns: Selected }),
      },
    });
  };
  btn2.onclick = cleanDialog;
  btn2.innerText = "Cancel";
  btn.innerText = "Submit";
  div.appendChild(btn);
  div.appendChild(btn2);
  Maindiv.appendChild(div);
  dialog.className = "dialogshown";
  dialog.appendChild(Maindiv);
});

fileInput.addEventListener("dragover", (e) => e.preventDefault());
fileInput.addEventListener("drop", (e) => {
  e.preventDefault();
  file = e.dataTransfer.files.item(0);
  filePara.innerText = `FileName : ${file.name} \nFileSize : ${file.size} bytes`;
  GetColumns({ file });
});

InputTag.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.files[0]) {
    file = e.target.files[0];
    filePara.innerText = `FileName : ${file.name} \nFileSize : ${file.size} bytes`;
    GetColumns({ file });
  }
});

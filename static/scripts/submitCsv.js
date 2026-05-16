let file;
const fileInput = document.getElementById("csvFileInput_");
const InputTag = document.getElementById("csvFileInput");
const filePara = document.getElementById("filePara");
const SubmitButton = document.getElementById("submit");
const dialog = document.getElementById("dialog");
const filters = document.getElementById("filters");

document.getElementById("fillDefaultInput").addEventListener("change", (e) => {
  console.log(e.target.checked);
  if (e.target.checked) {
    const label1 = document.createElement("label");
    const label2 = document.createElement("label");
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const span3 = document.createElement("span");

    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const input3 = document.createElement("input");
    input3.type = "text";
    input3.maxLength = 20;
    input3.placeholder = "Enter Value";
    input3.id = "FillDeafultValue";
    input1.type = input2.type = "radio";
    input1.value = "row";
    input2.value = "column";
    input1.name = input2.name = "FillDeafults";
    input1.id = label1.htmlFor = "byRowFillDeafult";
    input2.id = label2.htmlFor = "byColumnFillDeafult";
    label1.innerText = "By Row";
    label2.innerText = "By Column";
    input1.checked = true;
    const div = document.createElement("div");
    div.id = "helperParent";

    span1.appendChild(input1);
    span1.appendChild(label1);
    span2.appendChild(input2);
    span2.appendChild(label2);
    span3.appendChild(input3);
    div.innerHTML = "<p>Fill Default :</p>";
    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(span3);

    filters.appendChild(div);
  } else {
    document.getElementById("helperParent").remove();
  }
});

document
  .getElementById("removeMissingInput")
  .addEventListener("change", (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
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
    } else {
      document.getElementById("helperParent").remove();
    }
  });

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

async function handleCsvFile(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/process-csv", {
    body: fd,
    method: "POST",
  });
  if (!res.ok) {
    console.log("error");
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

SubmitButton.addEventListener("click", (e) => {
  if (!(file instanceof File)) {
    dialogMessage("Please Select a Csv File First");
    return;
  } else {
    const Checked = [];
    const basicIds = ["headerInput", "DataInput"];
    for (const row of basicIds) {
      let x = document.getElementById(row);
      Checked.push(x.checked);
    }
    if (!Checked[0] && !Checked[1]) {
      dialogMessage("Select atleast one basic filter");
      return;
    }
    Checked.length = 0;
    const processIds = [
      "uppercaseInput",
      "lowercaseInput",
      "capitalizeInput",
      "removeMissingInput",
      "fillDefaultInput",
    ];
    for (const row of processIds) {
      let x = document.getElementById(row);
      Checked.push(x.checked);
    }
    if (Checked.filter((m) => m === true).length === 0) {
      dialogMessage("Select atleast one process filter");
      return;
    }
  }
  const FillDefaultRadio =
    document.querySelector("#helperParent input[name='FillDeafults']:checked")
      ?.value || null;
  const FillDefaultValue =
    document.getElementById("FillDeafultValue")?.value || null;

  const MissingInputsRadio =
    document.querySelector("#helperParent input[name='MissingInputs']:checked")
      ?.value || null;

  console.log(FillDefaultRadio, MissingInputsRadio, FillDefaultValue);
});

fileInput.addEventListener("dragover", (e) => e.preventDefault());
fileInput.addEventListener("drop", (e) => {
  e.preventDefault();
  file = e.dataTransfer.files.item(0);

  filePara.innerText = `FileName : ${file.name} \nFileSize : ${file.size}`;
});

InputTag.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.files[0]) {
    file = e.target.files[0];
    filePara.innerText = `FileName : ${file.name} \nFileSize : ${file.size}`;
  }
});

let file;
const fileInput = document.getElementById("csvFileInput_");
const InputTag = document.getElementById("csvFileInput");
const filePara = document.getElementById("filePara");
const SubmitButton = document.getElementById("submit");
const dialog = document.getElementById("dialog");
const filters = document.getElementById("filters");

document.getElementById("removeMissingInput").addEventListener("change",(e)=>{
  console.log(e.target.checked)
  if(e.target.checked){
    
  }
})


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
    if ((Checked.filter((m)=> m === true).length === 0)) {
      dialogMessage("Select atleast one process filter");
    }
  }
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

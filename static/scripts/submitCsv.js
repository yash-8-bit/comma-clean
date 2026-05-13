const fileInput = document.getElementById("csvFileInput_");
const InputTag = document.getElementById("csvFileInput");
const filePara = document.getElementById("filePara");

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

fileInput.addEventListener("dragover", (e) => e.preventDefault());
fileInput.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files.item(0);

  filePara.innerText = `FileName : ${file.name}`;
});

InputTag.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.files[0]) {
    const file = e.target.files[0];
    filePara.innerText = `FileName : ${file.name}`;
  } else {
  }
});

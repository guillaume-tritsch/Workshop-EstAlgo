window.addEventListener("load", function () {
    if (document.getElementById("count") !== null)
  document.getElementById("count").innerText = getList().length + 1;
});

function result() {
  var data = [
    document.getElementById("climateO").value / 100,
    document.getElementById("climateT").value / 100,
    document.getElementById("temperatureO").value / 100,
    document.getElementById("temperatureT").value / 100,
    document.getElementById("aromaO").value / 100,
    document.getElementById("aromaT").value / 100,
    document.getElementById("soundO").value / 100,
    document.getElementById("soundT").value / 100,
  ];

  for (let index = 0; index < palette.length; index++) {
    const elementColor = palette[index];

    data.push(`${rgbToHex(elementColor.levels[0], elementColor.levels[1], elementColor.levels[2])}`)
  }

  addToList(data);

  window.location.href = "./result.html";
}

function next() {
  var data = [
    document.getElementById("climateO").value / 100,
    document.getElementById("climateT").value / 100,
    document.getElementById("temperatureO").value / 100,
    document.getElementById("temperatureT").value / 100,
    document.getElementById("aromaO").value / 100,
    document.getElementById("aromaT").value / 100,
    document.getElementById("soundO").value / 100,
    document.getElementById("soundT").value / 100,
  ];

  for (let index = 0; index < palette.length; index++) {
    const elementColor = palette[index];

    data.push(`${rgbToHex(elementColor.levels[0], elementColor.levels[1], elementColor.levels[2])}`)
  }

  addToList(data);

  window.location.href = "./pallet.html";
}

function addResultToStorage() {
  if (sessionStorage.getItem("result")) sessionStorage.setItem("result");
}

function initializeList() {
  if (!sessionStorage.getItem("resultArray")) {
    sessionStorage.setItem("resultArray", JSON.stringify([]));
  }
}

function addToList(element) {
  initializeList();
  const list = JSON.parse(sessionStorage.getItem("resultArray"));
  list.push(element);
  sessionStorage.setItem("resultArray", JSON.stringify(list));
}

function getList() {
  initializeList();
  return JSON.parse(sessionStorage.getItem("resultArray"));
}

function clearList() {
    initializeList();
    sessionStorage.removeItem("resultArray");
}


function downloadCSV(data, headers, filename = "data.csv") {
    // Vérifier que les données et les en-têtes correspondent en taille
    if (headers.length !== data[0].length) {
        console.error("Le nombre d'en-têtes ne correspond pas au nombre de colonnes dans les données.");
        return;
    }

    // Créer une chaîne pour le fichier CSV
    const csvRows = [];

    // Ajouter les en-têtes
    csvRows.push(headers.join(","));

    // Ajouter les lignes de données
    data.forEach(row => {
        csvRows.push(row.join(","));
    });

    // Créer un objet Blob avec le contenu CSV
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Créer un lien de téléchargement et déclencher le téléchargement
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var headers = ["active", "bright", "warm", "dry", "bitter", "acid", "noisy", "harmonious"];

function download() {
  let colorNumber = sessionStorage.getItem("numberOfColor") || 4;

  for (let index = 0; index < colorNumber; index++) {
    headers.push("color-"+(index + 1))
  }

  downloadCSV(getList(), headers, Date.now() + ".csv");
}

function start() {

    clearList()

    sessionStorage.setItem('numberOfColor', document.getElementById('numberOfColor').value);
    sessionStorage.setItem('generationType', document.getElementById('generation-system').value);

    window.location.href = "./pallet.html";
}
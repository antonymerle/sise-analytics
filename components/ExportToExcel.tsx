import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Button from "react-bootstrap/Button";
import { CheckedOptions } from "./TableauFTEDescendant";
import { makeSortedTable } from "../lib/siseLib";

interface Props extends CheckedOptions {
  fileName: string;
  anneeUniversitaire: string;
}

const ExportToExcel: React.FC<Props> = ({
  data,
  lBoxChecked,
  mBoxChecked,
  dBoxChecked,
  dutBoxChecked,
  lpBoxChecked,
  siteGeographique,
  fileName,
  anneeUniversitaire,
}) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportBriefing = (): string => {
    let briefing = `Année universitaire ${anneeUniversitaire}. Effectifs sélectionnés : `;
    briefing += lBoxChecked ? " licences" : null;
    briefing += mBoxChecked ? " masters" : null;
    briefing += dBoxChecked ? " doctorats" : null;
    briefing += dutBoxChecked ? " dut" : null;
    briefing += lpBoxChecked ? " licences professionnelles" : null;
    briefing += " -- Campus : ";
    briefing += siteGeographique ? siteGeographique : "Tous";

    return briefing;
  };

  const prepareData = (
    arrayOfObjects: Array<{ disc: string; effectif: number }>
  ): (string | number)[][] => {
    let resultat: (string | number)[][] = [];
    resultat.push(["Sise Analytics"]);
    resultat.push([`${exportBriefing()}`]);
    resultat.push([""]);
    resultat.push(["Discipline", "FTE"]);
    for (let obj of arrayOfObjects) {
      resultat.push([obj.disc, obj.effectif]);
    }
    resultat.push([
      "Effectifs totaux",
      arrayOfObjects
        .map((obj) => obj.effectif)
        .reduce((curr, sum) => curr + sum, 0),
    ]);

    return resultat;
  };

  const sortedTable = makeSortedTable(
    data,
    lBoxChecked,
    mBoxChecked,
    dBoxChecked,
    dutBoxChecked,
    lpBoxChecked,
    siteGeographique
  );

  const dataArray = prepareData(sortedTable);

  const exportToCSV = (dataArray: (string | number)[][], fileName: string) => {
    const ws = XLSX.utils.aoa_to_sheet(dataArray);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      className="display-button"
      variant="outline-dark"
      onClick={(e) => exportToCSV(dataArray, fileName)}
    >
      Export
    </Button>
  );
};

export default ExportToExcel;

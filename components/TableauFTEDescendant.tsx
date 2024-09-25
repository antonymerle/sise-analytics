import React from "react";
import {
  makeSortedTable,
  Records,
} from "../lib/siseLib";

export interface CheckedOptions {
  data: Records[];
  lBoxChecked: boolean;
  mBoxChecked: boolean;
  dBoxChecked: boolean;
  dutBoxChecked: boolean;
  lpBoxChecked: boolean;
  siteGeographique: string | null;
}

export const TableauFTEDescendant: React.FC<CheckedOptions> = ({
  data,
  lBoxChecked,
  mBoxChecked,
  dBoxChecked,
  dutBoxChecked,
  lpBoxChecked,
  siteGeographique,
}) => {
  const resultat = makeSortedTable(
    data,
    lBoxChecked,
    mBoxChecked,
    dBoxChecked,
    dutBoxChecked,
    lpBoxChecked,
    siteGeographique
  );

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>FTE</th>
          </tr>
          {resultat.map((element) => {
            return (
              <tr key={element.disc}>
                <td>{element.disc}</td>
                <td>{element.effectif}</td>
              </tr>
            );
          })}
        </thead>
      </table>
    </>
  );
};

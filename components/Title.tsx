import React from "react";

interface Props {
  etablissement: null | string;
  anneeUniversitaire: string;
}

export const Title: React.FC<Props> = ({
  etablissement,
  anneeUniversitaire,
}) => {
  return (
    <div className="header">
      <h1>
        Statistiques SISE {etablissement} {anneeUniversitaire}
      </h1>
      <em>
        Source :{" "}
        <a href="https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public/">
          data.enseignementsup-recherche.gouv.fr
        </a>
      </em>
    </div>
  );
};

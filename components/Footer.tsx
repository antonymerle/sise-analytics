import React from "react";

// semantic versioning : 0.XY
// X => new feature added
// Y => bug or maintenance correction (dataset change in api)

// LOG
// 0.22 : typescript, css
// 0.32 : export excel
// 0.40 : tous les établissements ESR sont intégrés
// 0.41 : intégration 2021-2022 + UPPA en haut de la liste des établissements

export const Footer: React.FC = () => {
  return (
    <>
      <p className="footer">
        <a href="https://git.univ-pau.fr/amerle001/sise-analytics">
          Sise-Analytics
        </a>{" "}
        {new Date().getFullYear()} -- v 0.5
      </p>
    </>
  );
};

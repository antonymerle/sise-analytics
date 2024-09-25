import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Title } from "./Title";
import { ChooseYear } from "./ChooseYear";
import { ChooseDiplome } from "./ChooseDiplome";
import { ChooseSite } from "./ChooseSite";
import { TableauFTEDescendant } from "./TableauFTEDescendant";
import {
  fetchData,
  Records,
  getSubTotal,
  fetchEtablissements,
  fetchCommunes,
} from "../lib/siseLib";
import ExportToExcel from "./ExportToExcel";
import ChooseEtablissement from "./ChooseEtablissement";
import { annees } from "./ChooseYear";

export default function SiseContainer() {
  const [anneeUniversitaire, setAnneUniversitaire] = useState<string>(
    annees[annees.length - 1]
  );
  const [siteGeographique, setSiteGeographique] = useState<string | null>(null);
  const [lBoxChecked, setLBoxChecked] = useState(true);
  const [mBoxChecked, setMBoxChecked] = useState(true);
  const [dBoxChecked, setDBoxChecked] = useState(true);
  const [dutBoxChecked, setDutBoxChecked] = useState(true);
  const [lpBoxChecked, setLpBoxChecked] = useState(true);
  const [fetchDataStatus, setFetchDataStatus] = useState("idle");
  const [data, setData] = useState<Array<Records>>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [listeEtablissements, setListeEtablissements] = useState<string[]>([]);
  const [etablissement, setEtablissement] = useState<null | string>(null);
  const [listeCommunes, setListeCommunes] = useState<null | string[]>(null);

  const canFetch = fetchDataStatus === "idle" && etablissement;

  const progressInstance = <ProgressBar animated now={progressPercentage} />;

  useEffect(() => {
    fetchEtablissements().then((resultat) => {
      const sorted = [
        "Université de Pau et des Pays de l'Adour",
        ...resultat.filter(
          (univ) => univ !== "Université de Pau et des Pays de l'Adour"
        ),
      ];
      setListeEtablissements(sorted);
      setEtablissement(sorted[0]);
    });
  }, []);

  useEffect(() => {
    setData([]);
  }, [etablissement]);

  useEffect(() => {
    if (fetchDataStatus === "pending") {
      setTimeout(() => setProgressPercentage(progressPercentage + 1), 100);
    }
  }, [fetchDataStatus, progressPercentage]);

  useEffect(() => {
    if (canFetch) {
      fetchData(etablissement, anneeUniversitaire);
    }
    return () => {
      console.log("cleanup");
    };
  }, [data, anneeUniversitaire, etablissement, canFetch]);

  const onFetch = async () => {
    if (canFetch) {
      try {
        setProgressPercentage(0);
        setSiteGeographique(null);
        setListeCommunes(null);
        setFetchDataStatus("pending");
        const response = await fetchData(etablissement, anneeUniversitaire);
        setData(response.records);

        const communes = fetchCommunes(response.records);
        setListeCommunes(communes);
      } catch (error) {
        console.log("echec de la récupération des données : " + error);
      } finally {
        setFetchDataStatus("idle");
      }
    }
  };

  return (
    <>
      <Title
        etablissement={etablissement}
        anneeUniversitaire={anneeUniversitaire}
      />

      <div className="formulaire">
        {" "}
        <ChooseEtablissement
          listeEtablissements={listeEtablissements}
          onChange={(ets: string) => setEtablissement(ets)}
        ></ChooseEtablissement>
        <ChooseYear
          annee={anneeUniversitaire}
          onChange={(annee: string) => setAnneUniversitaire(annee)}
        />
        <ChooseSite
          listeSites={listeCommunes}
          onChange={(site: string | null) => {
            site = site === "Tous" ? null : site;
            setSiteGeographique(site);
          }}
        />
      </div>

      <ChooseDiplome
        lBoxChecked={lBoxChecked}
        mBoxChecked={mBoxChecked}
        dBoxChecked={dBoxChecked}
        dutBoxChecked={dutBoxChecked}
        lpBoxChecked={lpBoxChecked}
        handleLCheckboxChange={() => setLBoxChecked(!lBoxChecked)}
        handleMCheckboxChange={() => setMBoxChecked(!mBoxChecked)}
        handleDCheckboxChange={() => setDBoxChecked(!dBoxChecked)}
        handleDutCheckboxChange={() => setDutBoxChecked(!dutBoxChecked)}
        handleLpCheckboxChange={() => setLpBoxChecked(!lpBoxChecked)}
      />

      <div className="chargement">
        <Button
          className="display-button"
          variant="outline-dark"
          onClick={onFetch}
          disabled={!canFetch}
        >
          Afficher les effectifs
        </Button>
        {data.length === 0 &&
        fetchDataStatus === "idle" ? null : fetchDataStatus ===
          "pending" ? null : (
          <ExportToExcel
            data={data}
            lBoxChecked={lBoxChecked}
            mBoxChecked={mBoxChecked}
            dBoxChecked={dBoxChecked}
            dutBoxChecked={dutBoxChecked}
            lpBoxChecked={lpBoxChecked}
            siteGeographique={siteGeographique}
            fileName="exportSise"
            anneeUniversitaire={anneeUniversitaire}
          />
        )}
      </div>

      {data.length === 0 &&
      fetchDataStatus === "idle" ? null : fetchDataStatus === "pending" ? (
        <div className="chargement">
          <p>chargement des données...</p>
          {progressInstance}
        </div>
      ) : (
        <>
          <div className="cssTableau">
            <h2>
              Effectifs totaux :{" "}
              {getSubTotal(
                data,
                lBoxChecked,
                mBoxChecked,
                dBoxChecked,
                dutBoxChecked,
                lpBoxChecked,
                siteGeographique
              )}
            </h2>
            <TableauFTEDescendant
              data={data}
              lBoxChecked={lBoxChecked}
              mBoxChecked={mBoxChecked}
              dBoxChecked={dBoxChecked}
              dutBoxChecked={dutBoxChecked}
              lpBoxChecked={lpBoxChecked}
              siteGeographique={siteGeographique}
            />
          </div>
        </>
      )}
    </>
  );
}

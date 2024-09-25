export interface SiseDataStructure {
  records: Records[];
}

export interface Records {
  fields: FieldsObject;
}

export interface FieldsObject {
  sect_disciplinaire_lib: string;
  cursus_lmd: string;
  diplome: string;
  implantation_commune: string;
  effectif_total: number;
}

export const fetchEtablissements = async (): Promise<Array<string>> => {
  const urlEts =
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public&q=&sort=-rentree&facet=etablissement_lib";

  const response: any = await fetch(urlEts);
  const data = await response.json();
  let etablissements = data.facet_groups[0].facets.map(
    (facet: any) => facet.name as string
  );
  return etablissements;
};

export const fetchCommunes = (records: Records[]): string[] => {
  let set: Set<string> = new Set();
  set.add("Tous");
  records
    .map((r: any) => r.fields.implantation_commune)
    .forEach((commune: string) => set.add(commune));
  return Array.from(set);
};

export const fetchData = async (
  etablissement: string,
  annee: string
): Promise<SiseDataStructure> => {
  const url = `https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public&q=&rows=4841&facet=rentree_lib&facet=etablissement_type2&facet=etablissement_type_lib&facet=etablissement_lib&facet=identifiant_eter&facet=champ_statistique&facet=operateur_lib&facet=localisation_etab&facet=localisation_ins&facet=bac_lib&facet=attrac_intern_lib&facet=dn_de_lib&facet=cursus_lmd_lib&facet=diplome_lib&facet=niveau_lib&facet=disciplines_selection&facet=gd_disciscipline_lib&facet=discipline_lib&facet=sect_disciplinaire_lib&facet=reg_etab_lib&facet=com_ins_lib&facet=uucr_ins_lib&facet=dep_ins_lib&facet=aca_ins_lib&facet=reg_ins_lib&refine.annee_universitaire=${annee}&refine.etablissement_lib=${encodeURIComponent(
    etablissement
  )}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export function fte(data: SiseDataStructure) {
  return Object.values(data)
    .map((el) => el.fields.effectif) // MaJ DataESR 2021 OK
    .reduce((sum, curr) => sum + curr, 0);
}

export function listeFields(data: SiseDataStructure) {
  let set = new Set();
  for (let el of Object.values(data)) {
    for (let f of Object.keys(el.fields)) {
      set.add(f);
    }
  }
  return Array.from(set);
}

export function listeDisciplines(data: Records[]): string[] {
  let set: Set<string> = new Set();
  Object.values(data).map((el) => set.add(el.fields.sect_disciplinaire_lib)); // MaJ DataESR 2021 OK
  return Array.from(set);
}

export function listeSite(data: SiseDataStructure) {
  let set = new Set();
  // suite au remaniement de la structure de données faite par DataESR en 2021
  // com_ins_lib devient implantation_commune
  Object.values(data).map((el) => set.add(el.fields.implantation_commune));
  return Array.from(set);
}

export function listeAllPropertiesValues(data: SiseDataStructure) {
  let resultat: { [index: string]: any } = {};
  listeFields(data).map(
    (prop) =>
      (resultat[prop as string] = listePropertyValues(data, String(prop)))
  );
  return resultat;
}

export function listePropertyValues(data: SiseDataStructure, property: string) {
  let set = new Set();
  Object.values(data).map((el) => set.add(el.fields[property]));
  return Array.from(set);
}

// filtre une discipline par critère successifs
// d'abord les diplômes, ensuite le site géographique
export function filtreDisciplinePar(
  data: Records[],
  disc: string,
  l?: boolean,
  m?: boolean,
  d?: boolean,
  dut?: boolean,
  lp?: boolean,
  siteGeographique?: string | null
): number {
  // etape 1 : filtre par diplome LMD
  let echantillonParDiplome: Array<Records> = [];

  if (l === true) {
    Object.values(data)
      .filter(
        (el) =>
          el.fields.sect_disciplinaire_lib === disc && // MaJ DataESR 2021 OK
          el.fields.cursus_lmd === "L" && // MaJ DataESR 2021 OK
          el.fields.diplome !== "DUT" && // MaJ DataESR 2021 OK
          el.fields.diplome !== "LIC_PRO" // MaJ DataESR 2021 OK
      )
      .forEach((el) => echantillonParDiplome.push(el));
  }
  if (m === true) {
    Object.values(data)
      .filter(
        (el) =>
          el.fields.sect_disciplinaire_lib === disc && // MaJ DataESR 2021 OK
          el.fields.cursus_lmd === "M" // MaJ DataESR 2021 OK
      )
      .forEach((el) => echantillonParDiplome.push(el));
  }
  if (d === true) {
    Object.values(data)
      .filter(
        (el) =>
          el.fields.sect_disciplinaire_lib === disc && // MaJ DataESR 2021 OK
          el.fields.cursus_lmd === "D" // MaJ DataESR 2021 OK
      )
      .forEach((el) => echantillonParDiplome.push(el));
  }

  if (dut === true) {
    Object.values(data)
      .filter(
        (el) =>
          el.fields.sect_disciplinaire_lib === disc && // MaJ DataESR 2021 OK
          el.fields.diplome === "DUT" // MaJ DataESR 2021 OK
      )
      .forEach((el) => echantillonParDiplome.push(el));
  }

  if (lp === true) {
    Object.values(data)
      .filter(
        (el) =>
          el.fields.sect_disciplinaire_lib === disc && // MaJ DataESR 2021 OK
          el.fields.diplome === "LIC_PRO" // MaJ DataESR 2021 OK
      )
      .forEach((el) => echantillonParDiplome.push(el));
  }

  // Etape 2 : filtre par site
  if (siteGeographique === null) {
    return countEffectif(echantillonParDiplome);
  }

  // suite au remaniement de la structure de données faite par DataESR en 2021
  // com_ins_lib devient implantation_commune
  const echantillonParSite = echantillonParDiplome.filter(
    (el) => el.fields.implantation_commune === siteGeographique // MaJ DataESR 2021 OK
  );

  return countEffectif(echantillonParSite);
}
export function countEffectif(array: Records[]): number {
  return array
    .map((el) => el.fields.effectif_total) // effectif_total = inscriptions principales + inscriptions secondaires   // MaJ DataESR 2021 OK
    .reduce((sum, current) => sum + current, 0);
}

export function printFteByDiscipline(data: Records[]) {
  console.table(
    listeDisciplines(data).map((disc) => {
      return {
        Discipline: disc,
        FTE: filtreDisciplinePar(data, disc as string),
      };
    })
  );
}

export function totalFte(data: Records[]) {
  return listeDisciplines(data)
    .map((disc) => filtreDisciplinePar(data, disc as string))
    .reduce((sum, current) => sum + current, 0);
}

export function sortFteDisciplines(data: Records[]) {
  let resultat: { discipline: string; effectif: number }[] = [];
  listeDisciplines(data).map((disc) => {
    return resultat.push({
      discipline: disc as string,
      effectif: filtreDisciplinePar(data, disc as string),
    });
  });

  resultat.forEach((element) => {
    console.log(element.discipline + " : " + element.effectif);
  });
}

export function getSubTotal(
  props: Records[],
  lBoxStatus: boolean,
  mBoxStatus: boolean,
  dBoxStatus: boolean,
  dutBoxStatus: boolean,
  lpBoxChecked: boolean,
  siteGeographique?: string | null
) {
  const test = listeDisciplines(props).map((disc) =>
    filtreDisciplinePar(
      props,
      disc as string,
      lBoxStatus,
      mBoxStatus,
      dBoxStatus,
      dutBoxStatus,
      lpBoxChecked,
      siteGeographique
    )
  );
  return test.reduce((curr, sum) => curr + sum, 0);
}

export function makeSortedTable(
  data: Records[],
  lBoxChecked?: boolean,
  mBoxChecked?: boolean,
  dBoxChecked?: boolean,
  dutBoxChecked?: boolean,
  lpBoxChecked?: boolean,
  siteGeographique?: string | null
): Array<{ disc: string; effectif: number }> {
  let resultat: { disc: string; effectif: number }[] = [];
  listeDisciplines(data).map((disc) => {
    return resultat.push({
      disc,
      effectif: filtreDisciplinePar(
        data,
        disc,
        lBoxChecked,
        mBoxChecked,
        dBoxChecked,
        dutBoxChecked,
        lpBoxChecked,
        siteGeographique
      ),
    });
  });

  return resultat.sort((a, b) => b.effectif - a.effectif);
}

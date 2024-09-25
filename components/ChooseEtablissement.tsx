import React from "react";
import { Form } from "react-bootstrap";

interface Props {
  listeEtablissements: string[];
  onChange: (etablissement: string) => void;
}

const ChooseEtablissement: React.FC<Props> = ({
  listeEtablissements,
  onChange,
}) => {
  return (
    <>
      <Form className="form-item">
        <Form.Group>
          <Form.Label>Etablissement :</Form.Label>
          <Form.Control as="select" onChange={(e) => onChange(e.target.value)}>
            {listeEtablissements.map((etablissement) => (
              <option
                value={etablissement}
                key={etablissement}
                style={
                  etablissement === "Université de Pau et des Pays de l'Adour"
                    ? { fontWeight: "bold" }
                    : { fontWeight: "normal" }
                }
              >
                {etablissement}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </>
  );
};

export default ChooseEtablissement;

import React from "react";
import { useState } from "react";
import { Form, Tooltip, OverlayTrigger } from "react-bootstrap";

interface Props {
  onChange: (site: string | null) => void;
  listeSites: null | string[];
}

export const ChooseSite: React.FC<Props> = ({ onChange, listeSites }) => {
  const [selection, setSelection] = useState("Tous");
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip id="tooltip">
          Les campus s'affichent après le chargement du jeu de données
        </Tooltip>
      }
    >
      <Form className="form-item">
        <Form.Group>
          <Form.Label>Campus :</Form.Label>
          <Form.Control
            as="select"
            value={selection}
            onChange={(e) => {
              onChange(e.target.value);
              setSelection(e.target.value);
            }}
          >
            {listeSites
              ? listeSites.map((commune) => (
                  <option value={commune} key={`${commune}${Date.now()}`}>
                    {commune}
                  </option>
                ))
              : null}
          </Form.Control>
        </Form.Group>
      </Form>
    </OverlayTrigger>
  );
};

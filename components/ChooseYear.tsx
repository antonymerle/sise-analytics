import React from "react";
import Form from "react-bootstrap/Form";

interface Props {
  annee: string;
  onChange: (annee: string) => void;
}

export const annees = [
  "2014-15",
  "2015-16",
  "2016-17",
  "2017-18",
  "2018-19",
  "2019-20",
  "2020-21",
  "2021-22",
  "2022-23",
];

export const ChooseYear: React.FC<Props> = ({ annee, onChange }) => {
  return (
    <>
      <Form className="form-item">
        <Form.Group>
          <Form.Label>Année :</Form.Label>
          <Form.Control
            as="select"
            defaultValue={annees[annees.length - 1]}
            value={annee}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          >
            {annees.map((a) => (
              <option value={a} key={a}>
                {a}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </>
  );
};

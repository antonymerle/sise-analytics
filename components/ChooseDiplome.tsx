import Form from "react-bootstrap/Form";

interface Props {
  lBoxChecked: boolean;
  mBoxChecked: boolean;
  dBoxChecked: boolean;
  dutBoxChecked: boolean;
  lpBoxChecked: boolean;
  handleLCheckboxChange: () => void;
  handleMCheckboxChange: () => void;
  handleDCheckboxChange: () => void;
  handleDutCheckboxChange: () => void;
  handleLpCheckboxChange: () => void;
}

export const ChooseDiplome: React.FC<Props> = ({
  lBoxChecked,
  mBoxChecked,
  dBoxChecked,
  dutBoxChecked,
  lpBoxChecked,
  handleLCheckboxChange,
  handleMCheckboxChange,
  handleDCheckboxChange,
  handleDutCheckboxChange,
  handleLpCheckboxChange,
}) => {
  return (
    <div className="chooseDiplome">
      <Form>
        <Form.Group>
          <Form.Label>Sélectionnez un diplôme : </Form.Label>
          {"   "}
          <Form.Check
            inline
            type="checkbox"
            checked={lBoxChecked}
            onChange={handleLCheckboxChange}
            label="L"
          />{" "}
          <Form.Check
            inline
            type="checkbox"
            checked={mBoxChecked}
            onChange={handleMCheckboxChange}
            label="M"
          />{" "}
          <Form.Check
            inline
            type="checkbox"
            checked={dBoxChecked}
            onChange={handleDCheckboxChange}
            label="D"
          />{" "}
        </Form.Group>
        <Form.Group>
          <Form.Check
            inline
            type="checkbox"
            checked={dutBoxChecked}
            onChange={handleDutCheckboxChange}
            label="DUT"
          />{" "}
          <Form.Check
            inline
            type="checkbox"
            checked={lpBoxChecked}
            onChange={handleLpCheckboxChange}
            label="Licence professionnelle"
          />{" "}
        </Form.Group>
      </Form>
    </div>
  );
};

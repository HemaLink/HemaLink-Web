import { Form } from "react-bootstrap";

const CampaignSearch = ({ onSearch, search }) => {
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <Form.Group className="mt-4 mb-2 campaign-search-group" controlId="searchCampaign">
      <Form.Control
        type="text"
        placeholder="Find campaigns..."
        onChange={handleSearch}
        value={search}
      ></Form.Control>
    </Form.Group>
  );
};

export default CampaignSearch;

import { useState, useContext, useRef } from "react";
import { campaigns } from "../../../data/campaigns.js";
import CampaignCard from "./campaignCard/CampaignCard.jsx";
import CampaignSearch from "./CampaignSearch.jsx";
import CampaignsTable from "./CampaignsTable.jsx";
import AuthContext from "../../../services/authContext/AuthContext";
import { ROLES } from "../../../services/authContext/auth.utils";
import '../donors/donors.css';

const addSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CampaignsList = () => {
  const [search, setSearch] = useState("");
  const { isAuthenticated, role } = useContext(AuthContext);
  const tableRef = useRef(null);

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
  };

  const isCrudUser = isAuthenticated && role >= ROLES.MODERATOR;

  if (isCrudUser) {
    return (
      <div className="mt-2 mx-4 campaigns-list-wrapper">
        <div className="page-title-row">
          <h1>Campaigns</h1>
          <button className="btn-add-round" onClick={() => tableRef.current?.handleAdd()}>
            {addSvg}
          </button>
        </div>
        <CampaignsTable ref={tableRef} />
        <button className="fab-add" onClick={() => tableRef.current?.handleAdd()}>
          {addSvg}
        </button>
      </div>
    );
  }

  const mappedCampaigns = campaigns
    .filter((campaign) => {
      const query = search.toLowerCase();
      return (
        campaign.entityName.toLowerCase().includes(query) ||
        campaign.location.toLowerCase().includes(query)
      );
    })
    .map((campaign) => (
      <CampaignCard
        key={campaign.id}
        entityName={campaign.entityName}
        bloodType={campaign.bloodType}
        date={campaign.date}
        location={campaign.location}
        units={campaign.units}
        status={campaign.status}
      />
    ));

  return (
    <div className="mt-2 mx-4 campaigns-list-wrapper">
      <h1>Donations</h1>
      <CampaignSearch onSearch={handleSearchChange} search={search} />
      <hr />
      <section
        style={{
          maxHeight: "calc(100dvh - 10em)",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
        className="campaigns-list-section"
      >
        <div className="d-flex flex-wrap gap-4 campaigns-list-container">
          {mappedCampaigns.length ? (
            mappedCampaigns
          ) : (
            <p>No campaigns founds.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CampaignsList;

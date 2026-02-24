import { useState, useEffect, useContext, useRef } from "react";
import CampaignCard from "./campaignCard/CampaignCard.jsx";
import CampaignSearch from "./CampaignSearch.jsx";
import CampaignsTable from "./CampaignsTable.jsx";
import AuthContext from "../../../services/authContext/AuthContext";
import { ROLES } from "../../../services/authContext/auth.utils";
import { getBloodRequests } from "./campaigns.services";
import '../donors/donors.css';

const addSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CampaignsList = () => {
  const [search, setSearch] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, role } = useContext(AuthContext);
  const tableRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBloodRequests()
      .then((data) => { if (!cancelled) { setCampaigns(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

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
    .filter((c) => {
      const query = search.toLowerCase();
      return (
        c.requesterName.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    })
    .map((c) => (
      <CampaignCard
        key={c.requestId}
        id={c.requestId}
        requesterName={c.requesterName}
        bloodTypesNeeded={c.bloodTypesNeeded}
        requestDate={c.requestDate}
        address={c.address}
        remainingUnits={c.remainingUnits}
        targetUnits={c.targetUnits}
        requestStatus={c.requestStatus}
      />
    ));

  return (
    <div className="mt-2 mx-4 campaigns-list-wrapper">
      <h1>Donations</h1>
      <CampaignSearch onSearch={handleSearchChange} search={search} />
      <hr />
      {loading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
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
            <p>No campaigns found.</p>
          )}
        </div>
      </section>
      )}
    </div>
  );
};

export default CampaignsList;

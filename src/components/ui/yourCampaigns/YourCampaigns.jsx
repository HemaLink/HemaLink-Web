import CampaignCard from "../campaignsList/campaignCard/CampaignCard.jsx";

const yourCampaigns = [
  {
    id: 101,
    entityName: "Your Hospital",
    bloodType: "O+",
    date: "2025-12-01",
    location: "Main Campus Blood Center",
    units: 20,
    status: "Open",
  },
  {
    id: 102,
    entityName: "Your Hospital",
    bloodType: "A-",
    date: "2025-12-10",
    location: "Downtown Clinic",
    units: 10,
    status: "Urgent",
  },
  {
    id: 103,
    entityName: "Your Hospital",
    bloodType: "B+",
    date: "2025-11-15",
    location: "Eastside Pavilion",
    units: 15,
    status: "Completed",
  },
];

const YourCampaigns = () => {
  const mappedCampaigns = yourCampaigns.map((campaign) => (
    <CampaignCard
      key={campaign.id}
      id={campaign.id}
      entityName={campaign.entityName}
      bloodType={campaign.bloodType}
      date={campaign.date}
      location={campaign.location}
      units={campaign.units}
      status={campaign.status}
    />
  ));

  return (
    <div className="mt-2 mx-4">
      <h1>Your Campaigns</h1>
      <hr />
      <section
        style={{
          maxHeight: "calc(100dvh - 10em)",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        <div className="d-flex flex-wrap gap-4">
          {mappedCampaigns.length ? (
            mappedCampaigns
          ) : (
            <p>You have no campaigns yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default YourCampaigns;

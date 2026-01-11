const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

export default StatCard;

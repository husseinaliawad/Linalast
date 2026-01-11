const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <span className="muted">{subtitle}</span>
    </div>
  );
};

export default EmptyState;

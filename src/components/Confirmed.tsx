interface ConfirmedProps {
  confirmed: string;
}

const Confirmed: React.FC<ConfirmedProps> = ({ confirmed }) => (
  <div>
    <strong>Confirmed:</strong>{" "}
    <span
      className={`confirmed-status ${
        confirmed === "Yes" ? "confirmed-yes" : "confirmed-no"
      }`}
    >
      {confirmed}
    </span>
  </div>
);

export default Confirmed;

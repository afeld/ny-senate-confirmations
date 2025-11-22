interface ConfirmedProps {
  confirmed: string;
}

export const confirmedClass = (confirmed: string) =>
  confirmed === "Yes" ? "confirmed-yes" : "confirmed-no";

export const ConfirmedDetail: React.FC<ConfirmedProps> = ({ confirmed }) => (
  <span className={`confirmed-status ${confirmedClass(confirmed)}`}>
    {confirmed}
  </span>
);

export const Confirmed: React.FC<ConfirmedProps> = ({ confirmed }) => (
  <div>
    <strong>Confirmed:</strong>{" "}
    <ConfirmedDetail confirmed={confirmed}></ConfirmedDetail>
  </div>
);

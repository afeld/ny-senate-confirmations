import { Positions } from "../hooks/useAirtableData";
import { linkGenerators } from "../utils/linkHelpers";

interface PositionsListProps {
  positionData: Positions;
}

const PositionsList: React.FC<PositionsListProps> = ({ positionData }) => (
  <ul>
    {positionData.map((p, index) => (
      <li
        key={index}
        dangerouslySetInnerHTML={{
          __html: linkGenerators.position(p!.id, `${p!.role}, ${p!.org}`),
        }}
      ></li>
    ))}
  </ul>
);

export default PositionsList;

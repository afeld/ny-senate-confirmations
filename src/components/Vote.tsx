interface VoteProps {
  vote: string;
}

export const Vote: React.FC<VoteProps> = ({ vote }) => (
  <span className={`vote vote-${vote.toLowerCase()}`}>{vote}</span>
);

export default Vote;

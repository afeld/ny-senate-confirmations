import React from "react";
import "../VoteBar.css";

interface VoteBarProps {
  ayes: number;
  nays: number;
  abs?: number;
  exc?: number;
}

const VoteBar: React.FC<VoteBarProps> = ({ ayes, nays, abs = 0, exc = 0 }) => {
  const total = ayes + nays + abs + exc;

  if (total === 0) {
    return null;
  }

  const ayePercent = (ayes / total) * 100;
  const nayPercent = (nays / total) * 100;
  const absPercent = (abs / total) * 100;
  const excPercent = (exc / total) * 100;

  return (
    <div className="vote-bar-container">
      <div className="vote-bar">
        {ayes > 0 && (
          <div
            className="vote-segment vote-segment-aye"
            style={{ width: `${ayePercent}%` }}
            title={`${ayes} Ayes (${ayePercent.toFixed(1)}%)`}
          />
        )}
        {nays > 0 && (
          <div
            className="vote-segment vote-segment-nay"
            style={{ width: `${nayPercent}%` }}
            title={`${nays} Nays (${nayPercent.toFixed(1)}%)`}
          />
        )}
        {abs > 0 && (
          <div
            className="vote-segment vote-segment-abs"
            style={{ width: `${absPercent}%` }}
            title={`${abs} Absent (${absPercent.toFixed(1)}%)`}
          />
        )}
        {exc > 0 && (
          <div
            className="vote-segment vote-segment-exc"
            style={{ width: `${excPercent}%` }}
            title={`${exc} Excused (${excPercent.toFixed(1)}%)`}
          />
        )}
      </div>
      <div className="vote-legend">
        {ayes > 0 && (
          <span className="vote-legend-item">
            <span className="vote-legend-color vote-legend-aye"></span>
            Aye: {ayes}
          </span>
        )}
        {nays > 0 && (
          <span className="vote-legend-item">
            <span className="vote-legend-color vote-legend-nay"></span>
            Nay: {nays}
          </span>
        )}
        {abs > 0 && (
          <span className="vote-legend-item">
            <span className="vote-legend-color vote-legend-abs"></span>
            Abs: {abs}
          </span>
        )}
        {exc > 0 && (
          <span className="vote-legend-item">
            <span className="vote-legend-color vote-legend-exc"></span>
            Exc: {exc}
          </span>
        )}
      </div>
    </div>
  );
};

export default VoteBar;

/** LeadScoreBadge.tsx — View Layer */
import React, { FC } from 'react';
import { getScoreLevel, getScoreColor, getScoreLabel } from './logic/LeadScoreBadge.logic';
import { BadgeRoot, ScoreTier, ScoreNum, ScoreLabel } from './styles/LeadScoreBadge.style';

interface Props { score: number; }

export const LeadScoreBadge: FC<Props> = ({ score }) => {
  const level = getScoreLevel(score);
  const color = getScoreColor(level);
  return (
    <BadgeRoot $color={color} data-testid="lead-score-badge">
      <ScoreTier $color={color}>{level}</ScoreTier>
      <ScoreNum>{score}</ScoreNum>
      <ScoreLabel>{getScoreLabel(level)}</ScoreLabel>
    </BadgeRoot>
  );
};
export default LeadScoreBadge;

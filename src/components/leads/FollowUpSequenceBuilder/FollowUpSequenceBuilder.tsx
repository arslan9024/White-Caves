/** FollowUpSequenceBuilder.tsx — View Layer */
import React, { FC } from 'react';
import { Trash2 } from 'lucide-react';
import { useFollowUpSequenceBuilderLogic } from './logic/FollowUpSequenceBuilder.logic';
import { Root, Title, StepList, Step, DayBadge, ChannelDot, StepText, RemoveBtn, AddBtn } from './styles/FollowUpSequenceBuilder.style';

export const FollowUpSequenceBuilder: FC = () => {
  const { steps, removeStep, addStep, CHANNEL_COLORS } = useFollowUpSequenceBuilderLogic();
  return (
    <Root data-testid="follow-up-builder">
      <Title>Follow-Up Sequence</Title>
      <StepList>
        {steps.map((step) => (
          <Step key={step.id}>
            <DayBadge>Day {step.day}</DayBadge>
            <ChannelDot $color={CHANNEL_COLORS[step.channel]} />
            <StepText><strong style={{ textTransform: 'capitalize' }}>{step.channel}</strong> — {step.message}</StepText>
            <RemoveBtn onClick={() => removeStep(step.id)} aria-label="Remove step"><Trash2 size={14} /></RemoveBtn>
          </Step>
        ))}
      </StepList>
      <AddBtn onClick={addStep}>+ Add Step</AddBtn>
    </Root>
  );
};
export default FollowUpSequenceBuilder;

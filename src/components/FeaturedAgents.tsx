import React, { FC } from 'react';
import {
  StyledFeaturedAgentsSection,
  StyledAgentsTitle,
  StyledAgentsGrid,
  StyledAgentCard,
  StyledAgentPhoto,
  StyledAgentName,
  StyledSpecialization,
  StyledExperience,
  StyledLanguagesContainer,
  StyledLanguageTag,
  StyledContactAgentButton,
} from './FeaturedAgents.styles';

interface Agent {
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  languages: string[];
}

interface FeaturedAgentsProps {}

const FeaturedAgents: FC<FeaturedAgentsProps> = () => {
  const agents: Agent[] = [
    {
      name: "Sarah Ahmed",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      specialization: "Luxury Villas",
      experience: "8 years",
      languages: ["English", "Arabic", "French"]
    },
    {
      name: "Mohammed Al-Rashid",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      specialization: "Off-Plan Properties",
      experience: "10 years",
      languages: ["English", "Arabic", "Hindi"]
    },
    {
      name: "Elena Petrov",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      specialization: "Commercial Real Estate",
      experience: "6 years",
      languages: ["English", "Russian", "German"]
    }
  ];

  return (
    <StyledFeaturedAgentsSection>
      <StyledAgentsTitle>Meet Our Expert Agents</StyledAgentsTitle>
      <StyledAgentsGrid>
        {agents.map((agent) => (
          <StyledAgentCard key={agent.name}>
            <StyledAgentPhoto src={agent.photo} alt={agent.name} />
            <StyledAgentName>{agent.name}</StyledAgentName>
            <StyledSpecialization>{agent.specialization}</StyledSpecialization>
            <StyledExperience>{agent.experience} experience</StyledExperience>
            <StyledLanguagesContainer>
              {agent.languages.map(lang => (
                <StyledLanguageTag key={lang}>{lang}</StyledLanguageTag>
              ))}
            </StyledLanguagesContainer>
            <StyledContactAgentButton>Contact Agent</StyledContactAgentButton>
          </StyledAgentCard>
        ))}
      </StyledAgentsGrid>
    </StyledFeaturedAgentsSection>
  );
};

export default FeaturedAgents;

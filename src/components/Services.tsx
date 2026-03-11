import React, { FC } from 'react';
import * as S from './Services.styles';

interface Service {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

const Services: FC = () => {
  const services: Service[] = [
    {
      icon: 'fas fa-home',
      title: 'For Tenants',
      description: 'We help tenants find and rent their ideal home by:',
      items: [
        'Property matching based on preferences',
        'Arranging property viewings',
        'Lease agreement assistance',
        'Move-in support',
      ],
    },
    {
      icon: 'fas fa-key',
      title: 'For Buyers',
      description: 'We assist buyers in purchasing their dream home through:',
      items: [
        'Property search and matching',
        'Property valuation',
        'Purchase negotiation',
        'Transaction support',
      ],
    },
  ];

  return (
    <S.ServicesSection>
      <S.SectionTitle>Our Services</S.SectionTitle>
      <S.ServicesContainer>
        {services.map((service, index) => (
          <S.ServiceCard key={`${service.title}-${index}`}>
            <S.ServiceIcon className={service.icon} />
            <S.ServiceTitle>{service.title}</S.ServiceTitle>
            <S.ServiceDescription>{service.description}</S.ServiceDescription>
            <S.ServiceList>
              {service.items.map((item, itemIndex) => (
                <S.ServiceListItem key={`${item}-${itemIndex}`}>
                  {item}
                </S.ServiceListItem>
              ))}
            </S.ServiceList>
          </S.ServiceCard>
        ))}
      </S.ServicesContainer>
    </S.ServicesSection>
  );
};

export default Services;

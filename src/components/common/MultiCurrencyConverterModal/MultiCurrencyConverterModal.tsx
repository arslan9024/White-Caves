import React, { FC } from 'react';
import { Coins, X, Check, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { MultiCurrencyConverterModalProps } from './MultiCurrencyConverterModal.types';
import { useMultiCurrencyConverterLogic } from './MultiCurrencyConverterModal.logic';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  InputSection,
  CurrencyGrid,
  CurrencyTile,
} from './MultiCurrencyConverterModal.styles';

export const MultiCurrencyConverterModal: FC<MultiCurrencyConverterModalProps> = ({
  isOpen,
  onClose,
  baseAmountAED = 18500000,
  propertyTitle,
}) => {
  const {
    inputAmountAED,
    setInputAmountAED,
    selectedTarget,
    conversionTable,
    handleSelectActiveCurrency,
  } = useMultiCurrencyConverterLogic(baseAmountAED);

  if (!isOpen) return null;

  return (
    <ModalOverlay data-testid="multi-currency-modal-overlay" onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()} data-testid="multi-currency-modal-container">
        {/* Header */}
        <ModalHeader>
          <div className="title-group">
            <Coins size={18} color="#EF4444" />
            <h3>Real-Time Multi-Currency & Crypto Escrow Converter</h3>
          </div>
          <button className="close-btn" onClick={onClose} title="Close Modal" data-testid="btn-close-currency-modal">
            <X size={18} />
          </button>
        </ModalHeader>

        {/* Input Base AED */}
        <InputSection>
          <div className="input-label">
            <span>Base Valuation (AED) — Central Bank of the UAE Peg</span>
            {propertyTitle && <span style={{ color: '#EF4444' }}>{propertyTitle}</span>}
          </div>

          <div className="amount-input-box">
            <span style={{ fontWeight: 800, color: '#EF4444' }}>AED</span>
            <input
              type="number"
              value={inputAmountAED}
              onChange={e => setInputAmountAED(Math.max(0, Number(e.target.value)))}
              data-testid="input-base-aed"
            />
          </div>
        </InputSection>

        {/* Live Grid of All Currencies */}
        <CurrencyGrid data-testid="currency-conversion-grid">
          {conversionTable.map(item => {
            const isSelected = item.code === selectedTarget;
            const isCrypto = item.code === 'BTC';
            return (
              <CurrencyTile
                key={item.code}
                type="button"
                $isSelected={isSelected}
                $isCrypto={isCrypto}
                onClick={() => handleSelectActiveCurrency(item.code)}
                data-testid={`currency-tile-${item.code}`}
              >
                <div className="top-row">
                  <div className="code-flag">
                    <span>{item.flag}</span>
                    <span>{item.code}</span>
                  </div>
                  {isSelected && <Check size={12} color="#EF4444" />}
                </div>

                <div className="converted-val">{item.formattedString}</div>

                <div className="name-text">{item.name}</div>
                <div className="rate-chip">{item.rateDisplay}</div>
              </CurrencyTile>
            );
          })}
        </CurrencyGrid>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MultiCurrencyConverterModal;


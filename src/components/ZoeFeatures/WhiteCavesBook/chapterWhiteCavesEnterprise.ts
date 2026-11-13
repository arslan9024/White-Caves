// src/components/ZoeFeatures/WhiteCavesBook/chapterWhiteCavesEnterprise.ts
import { ChapterNode } from './treeTypes';

/**
 * Chapter 01 (White Caves): Enterprise Real Estate Operations & Brokerage Divisions
 * Contains authoritative real estate business SOPs, Dubai Land Department compliance,
 * and property floor operations across White Caves Real Estate LLC.
 */
export const CHAPTER_WHITE_CAVES_ENTERPRISE: ChapterNode = {
  level: 5,
  nodeId: 'CH05-WC-01',
  chapterNumber: 1,
  chapterCode: 'CH-01-ENTERPRISE',
  title: 'Chapter 01: White Caves Real Estate Enterprise Operations',
  subtitle: 'Dubai Brokerage Operations, 12 Corporate Floors, DLD/RERA Compliance & Client Journey',
  readTimeMinutes: 35,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-WC-VISION',
      subChapterNumber: 1,
      title: 'White Caves Corporate Vision & Dubai Luxury Brokerage',
      summary:
        'White Caves Real Estate LLC operates as a premier sovereign brokerage in Dubai, UAE. Governed by Managing Director Arslan Malik Bashir Ahmad, the firm deploys a 1-12-108 organizational structure with 12 specialized departments.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-WC-MANDATE',
          sectionNumber: 1,
          title: 'Section 1.1: Brokerage Mandate & Market Footprint',
          summary:
            'Focus on ultra-luxury residential properties, prime off-plan allocations, and strategic commercial investment portfolios across Downtown Dubai, Palm Jumeirah, Dubai Hills, and DIFC.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-WC-PORTFOLIO',
              topicNumber: 1,
              title: 'Topic 1.1.1: Core Dubai Portfolios & Yield Optimization',
              summary:
                'Balancing high capital appreciation in prime off-plan corridors with stable 7%-9% net rental yields in secondary luxury communities.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-WC-PORTFOLIO-SPEC',
                  artifactNumber: 1,
                  title: 'Artifact: Prime Luxury Portfolio Guidelines',
                  type: 'DATA_CONTRACT',
                  filePath: 'src/config/propertyPortfolios.ts',
                  totalLines: 45,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-WC-P1',
                      paragraphNumber: 1,
                      header: 'Luxury Residential & Off-Plan Corridor Strategy',
                      narrative:
                        'White Caves exclusively sources and brokers Tier-1 developer inventory from Emaar, Nakheel, Meraas, and Sobha. All listings require verified Title Deeds or Oqood certificates before marketing.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'ST11-WC-S1',
                          sentenceNumber: 1,
                          statement:
                            'Every property listing must possess a validated DLD Trakheesi permit number prior to public syndication.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-L1',
                              lineNumber: 1,
                              text: 'export const REQUIRE_TRAKHEESI_PERMIT = true;',
                              tokenType: 'KEYWORD',
                            },
                          ],
                        },
                        {
                          level: 11,
                          nodeId: 'ST11-WC-S2',
                          sentenceNumber: 2,
                          statement:
                            'Off-plan Expression of Interest (EOI) token deposits are held in sovereign client escrow accounts in full compliance with RERA regulations.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-L2',
                              lineNumber: 2,
                              text: 'assertEscrowDepositVerification(eoiToken, reraEscrowAccount);',
                              tokenType: 'OPERATOR',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-WC-DLD',
      subChapterNumber: 2,
      title: 'Dubai Land Department (DLD) & RERA Regulatory Integration',
      summary:
        'Direct automated integration protocols for Oqood, Ejari tenancy contract generation, Form A/B/F generation, and trustee office conveyancing.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-WC-EJARI',
          sectionNumber: 1,
          title: 'Section 2.1: Ejari & Tenancy Contract Lifecycle',
          summary:
            'Standardized tenancy execution protocol enforcing UAE Decree No. 43 of 2013 and RERA Rental Calculator caps.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-WC-EJARI-RULES',
              topicNumber: 1,
              title: 'Topic 2.1.1: Rental Index & 90-Day Renewal Notice Rules',
              summary:
                'Statutory 90-day statutory notice requirements for any rent adjustments, strictly validated against the official Dubai Land Department Rental Index.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-WC-EJARI-SPEC',
                  artifactNumber: 1,
                  title: 'Artifact: RERA Rental Index Validation Contract',
                  type: 'LAW',
                  filePath: 'src/utils/reraRentIndexEngine.ts',
                  totalLines: 80,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-WC-EJARI-P1',
                      paragraphNumber: 1,
                      header: 'Statutory 90-Day Renewal Window Enforcement',
                      narrative:
                        'The White Caves CRM runtime monitors all active leases. Automated alerts dispatch at 120, 90, 60, and 30 days prior to lease expiry to protect landlord and tenant statutory notice rights under Dubai Law No. 26 of 2007.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'ST11-WC-EJARI-S1',
                          sentenceNumber: 1,
                          statement:
                            'Notice of rental amendment or non-renewal must be delivered in writing at least 90 days before the contract expiration date.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-EJARI-L1',
                              lineNumber: 1,
                              text: 'const RERA_MIN_NOTICE_DAYS = 90;',
                              tokenType: 'LITERAL',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-WC-FINANCE',
      subChapterNumber: 3,
      title: 'UAE FTA VAT, Corporate Tax & Escrow Finance Governance',
      summary:
        'Sovereign accounting rules: UAE 5% VAT on brokerage service commissions, 9% UAE Corporate Tax reserves, and automated Zoho Books ledger synchronization.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-WC-TAX-RULES',
          sectionNumber: 1,
          title: 'Section 3.1: Statutory 5% VAT & Commission Split Ledger',
          summary:
            'Ensures all brokerage fee invoices compute exact 5% FTA VAT, isolate agency revenue splits (60%–70% agent commission tier), and maintain zero-leakage financial audit trails.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-WC-TAX-TOPIC',
              topicNumber: 1,
              title: 'Topic 3.1.1: Invoice & Escrow Settlement Calculation',
              summary:
                'Deterministic calculation of transaction commission, VAT output tax, and escrow disbursements.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-WC-TAX-SPEC',
                  artifactNumber: 1,
                  title: 'Artifact: UAE VAT & Commission Engine',
                  type: 'DATA_CONTRACT',
                  filePath: 'src/services/finance/uaeVatAndTaxEngine.ts',
                  totalLines: 60,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-WC-TAX-P1',
                      paragraphNumber: 1,
                      header: 'UAE FTA Tax Calculation Invariant',
                      narrative:
                        'All secondary sales (2% standard brokerage) and leasing (5% annual rent fee) generate tax invoices displaying the agency TRN, gross fee, 5% VAT, and net agency split.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'ST11-WC-TAX-S1',
                          sentenceNumber: 1,
                          statement:
                            'Brokerage fee commissions are subject to mandatory 5% UAE VAT, while corporate taxable profits above AED 375,000 allocate a 9% tax buffer.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-TAX-L1',
                              lineNumber: 1,
                              text: 'const UAE_VAT_RATE = 0.05; const UAE_CORP_TAX_RATE = 0.09;',
                              tokenType: 'LITERAL',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-WC-COMMUNITIES',
      subChapterNumber: 4,
      title: 'Prime Dubai Real Estate Communities & Geographic Intelligence',
      summary:
        'Detailed market analysis, pricing per square foot, inventory velocity, and capital appreciation models for Dubai top master developments.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-WC-COMMUNITIES-OVERVIEW',
          sectionNumber: 1,
          title: 'Section 4.1: Flagship Master Developments & Price Tiers',
          summary:
            'Market profiling for Palm Jumeirah, Downtown Dubai, Dubai Marina, Dubai Hills Estate, and Emirates Hills.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-WC-PALM-DOWNTOWN',
              topicNumber: 1,
              title: 'Topic 4.1.1: Palm Jumeirah & Downtown Dubai Luxury Corridors',
              summary:
                'Ultra-luxury waterfront villas and high-floor penthouses commanding premiums above AED 4,500/sq.ft with global ultra-high-net-worth investor demand.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-WC-COMMUNITY-MATRIX',
                  artifactNumber: 1,
                  title: 'Artifact: Dubai Prime Communities Intelligence Grid',
                  type: 'DATA_CONTRACT',
                  filePath: 'src/config/communityIntelligence.ts',
                  totalLines: 110,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-WC-COMMUNITY-P1',
                      paragraphNumber: 1,
                      header: 'Waterfront & Central Business District Valuation Benchmarks',
                      narrative:
                        'Palm Jumeirah beachfront villas maintain average transaction caps of AED 85M to AED 220M with annual capital growth of 18-24%. Downtown Dubai burj-view residences average AED 3,200 to AED 5,000/sq.ft, backed by steady short-term holiday home ROI of 8.5% net.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'ST11-WC-COMMUNITY-S1',
                          sentenceNumber: 1,
                          statement:
                            'Prime waterfront listings on Palm Jumeirah and JBR must index historical sales data from the official DLD transaction registry to benchmark asking prices.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-COMMUNITY-L1',
                              lineNumber: 1,
                              text: 'export const BENCHMARK_COMMUNITIES = ["Palm Jumeirah", "Downtown Dubai", "Dubai Hills Estate", "DIFC"];',
                              tokenType: 'LITERAL',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-WC-VIP-JOURNEY',
      subChapterNumber: 5,
      title: 'Ultra-High-Net-Worth (UHNW) Buyer Journey & VIP Concierge Services',
      summary:
        'End-to-end bespoke client onboarding, private jet/chauffeur viewing coordination, sovereign KYC shielding, and trustee deed transfer assistance.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-WC-VIP-PROTOCOL',
          sectionNumber: 1,
          title: 'Section 5.1: VIP Onboarding & Confidentiality Escrow Protocol',
          summary:
            'Non-Disclosure Agreement (NDA) execution, encrypted passport handling via WebAuthn, and verified funds escrow validation prior to private viewing.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-WC-VIP-VIEWING',
              topicNumber: 1,
              title: 'Topic 5.1.1: Private Off-Market Listing Access Rules',
              summary:
                'Trophy assets above AED 50M operate under strict off-market embargo, accessible only to qualified buyers with verified proof of funds.',
              artifacts: [
                {
                  level: 9,
                  nodeId: 'A09-WC-VIP-SPEC',
                  artifactNumber: 1,
                  title: 'Artifact: UHNW Concierge & Private Client Charter',
                  type: 'LAW',
                  filePath: 'src/services/vipConciergeService.ts',
                  totalLines: 75,
                  complexity: 'O(1)',
                  paragraphs: [
                    {
                      level: 10,
                      nodeId: 'P10-WC-VIP-P1',
                      paragraphNumber: 1,
                      header: 'Off-Market Confidentiality & Trustee Transfer Escort',
                      narrative:
                        'White Caves Private Client advisors provide dedicated accompaniment to Dubai Trustee Offices (Al Twar, Barsha, or Downtown). The buyer receives simultaneous Title Deed issuance upon cashier cheque or escrow wire clearance.',
                      sentences: [
                        {
                          level: 11,
                          nodeId: 'ST11-WC-VIP-S1',
                          sentenceNumber: 1,
                          statement:
                            'Off-market trophy assets require signed buyer NDAs and bank-verified Proof of Funds (POF) prior to property inspection.',
                          statutoryInvariant: true,
                          lines: [
                            {
                              level: 12,
                              nodeId: 'LN12-WC-VIP-L1',
                              lineNumber: 1,
                              text: 'assertBuyerVerification(buyerProfile, { requireNDA: true, minPOF: 50_000_000 });',
                              tokenType: 'OPERATOR',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

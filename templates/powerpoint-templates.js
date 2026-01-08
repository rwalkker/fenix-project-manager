"use strict";
// FENIX Project Manager - PowerPoint Templates
// Pre-built PowerPoint templates for operations
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPowerPointTemplate = getPowerPointTemplate;
exports.listPowerPointTemplates = listPowerPointTemplates;
const powerpoint_types_1 = require("../models/powerpoint-types");
/**
 * Get PowerPoint template by type
 */
function getPowerPointTemplate(type, data) {
    switch (type) {
        case 'project-status':
            return getProjectStatusTemplate(data);
        case 'executive-presentation':
            return getExecutivePresentationTemplate(data);
        case 'training-deck':
            return getTrainingDeckTemplate(data);
        case 'change-management':
            return getChangeManagementTemplate(data);
        case 'technical-review':
            return getTechnicalReviewTemplate(data);
        case 'quarterly-review':
            return getQuarterlyReviewTemplate(data);
        default:
            throw new Error(`Unknown template type: ${type}`);
    }
}
/**
 * List all available templates
 */
function listPowerPointTemplates() {
    return [
        {
            id: 'project-status',
            name: 'Project Status Report',
            description: 'Comprehensive project status with timeline, risks, and metrics',
            slideCount: 8
        },
        {
            id: 'executive-presentation',
            name: 'Executive Presentation',
            description: 'High-level executive briefing with key insights and recommendations',
            slideCount: 10
        },
        {
            id: 'training-deck',
            name: 'Training Deck',
            description: 'Interactive training presentation with exercises and assessments',
            slideCount: 12
        },
        {
            id: 'change-management',
            name: 'Change Management Presentation',
            description: 'Change management communication with impact analysis and rollout plan',
            slideCount: 9
        },
        {
            id: 'technical-review',
            name: 'Technical Review',
            description: 'Technical architecture review with diagrams and implementation details',
            slideCount: 11
        },
        {
            id: 'quarterly-review',
            name: 'Quarterly Business Review',
            description: 'Quarterly business review with metrics, achievements, and goals',
            slideCount: 13
        }
    ];
}
// ============================================================================
// TEMPLATE 1: PROJECT STATUS REPORT (8 slides)
// ============================================================================
function getProjectStatusTemplate(data) {
    const projectName = data?.projectName || '[Project Name]';
    const date = data?.date || new Date().toLocaleDateString();
    const status = data?.status || 'On Track';
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: `${projectName} Status Report`,
            subtitle: `${date} | Status: ${status}`,
            notes: 'Welcome to the project status report. This presentation covers current progress, timeline, risks, and budget.'
        },
        // Slide 2: Agenda
        {
            type: 'agenda',
            title: 'Agenda',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Executive Summary' },
                        { text: 'Progress Update' },
                        { text: 'Timeline & Milestones' },
                        { text: 'Risks & Issues' },
                        { text: 'Budget Status' },
                        { text: 'Next Steps' }
                    ]
                }],
            notes: 'Today we will cover six key areas of the project status.'
        },
        // Slide 3: Executive Summary
        {
            type: 'content',
            title: 'Executive Summary',
            content: [
                {
                    type: 'bullets',
                    items: [
                        { text: `Overall Status: ${status}`, subitems: [{ text: 'Project is progressing according to plan' }] },
                        { text: 'Key Achievements:', subitems: [
                                { text: 'Completed Phase 1 deliverables' },
                                { text: 'Secured stakeholder approvals' },
                                { text: 'Team fully staffed and productive' }
                            ] },
                        { text: 'Current Focus:', subitems: [
                                { text: 'Phase 2 implementation' },
                                { text: 'Risk mitigation activities' },
                                { text: 'Stakeholder communication' }
                            ] },
                        { text: 'Completion: 65% complete', subitems: [{ text: 'On track for target completion date' }] }
                    ]
                }
            ],
            notes: 'The project is on track with 65% completion. Key achievements include Phase 1 completion and full team staffing. Current focus is on Phase 2 implementation.'
        },
        // Slide 4: Progress Update
        {
            type: 'content',
            title: 'Progress Update',
            content: [
                {
                    type: 'bullets',
                    items: [
                        { text: 'Completed This Period:', subitems: [
                                { text: 'Requirements gathering and validation' },
                                { text: 'Design documentation approved' },
                                { text: 'Development environment setup' },
                                { text: 'Initial prototype delivered' }
                            ] },
                        { text: 'In Progress:', subitems: [
                                { text: 'Core feature development (60% complete)' },
                                { text: 'Integration testing preparation' },
                                { text: 'User acceptance testing planning' }
                            ] },
                        { text: 'Upcoming:', subitems: [
                                { text: 'Complete remaining development tasks' },
                                { text: 'Begin integration testing' },
                                { text: 'Prepare deployment documentation' }
                            ] }
                    ]
                }
            ],
            notes: 'Significant progress made this period with requirements and design complete. Development is 60% complete with testing preparation underway.'
        },
        // Slide 5: Timeline Chart
        {
            type: 'chart',
            title: 'Project Timeline',
            content: [{
                    type: 'chart',
                    chartType: 'bar',
                    data: {
                        labels: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
                        datasets: [
                            { name: 'Planned', values: [100, 100, 70, 30, 10], color: '#146EB4' },
                            { name: 'Actual', values: [100, 100, 60, 20, 0], color: '#FF9900' }
                        ]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'bottom',
                        title: 'Phase Completion (%)',
                        xAxisTitle: 'Project Phase',
                        yAxisTitle: 'Completion %'
                    }
                }],
            notes: 'Timeline shows we are slightly behind in development phase but overall on track. Planning and design phases completed successfully.'
        },
        // Slide 6: Risks & Issues Table
        {
            type: 'table',
            title: 'Risks & Issues',
            content: [{
                    type: 'table',
                    headers: ['Risk/Issue', 'Impact', 'Probability', 'Mitigation', 'Owner'],
                    rows: [
                        ['Resource availability', 'Medium', 'Low', 'Cross-training team members', 'PM'],
                        ['Third-party integration delay', 'High', 'Medium', 'Parallel development track', 'Tech Lead'],
                        ['Scope creep', 'Medium', 'Medium', 'Change control process', 'PM'],
                        ['Technical complexity', 'High', 'Low', 'Architecture review & prototyping', 'Architect']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Four key risks identified with mitigation strategies in place. Highest priority is third-party integration delay with parallel development approach.'
        },
        // Slide 7: Budget Pie Chart
        {
            type: 'chart',
            title: 'Budget Status',
            content: [{
                    type: 'chart',
                    chartType: 'pie',
                    data: {
                        labels: ['Labor', 'Infrastructure', 'Software Licenses', 'Training', 'Contingency'],
                        datasets: [{
                                name: 'Budget Allocation',
                                values: [450000, 150000, 100000, 50000, 50000],
                                color: '#FF9900'
                            }]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'right',
                        showDataLabels: true,
                        title: 'Total Budget: $800,000'
                    }
                }],
            notes: 'Budget is $800K with 56% allocated to labor. Currently at 60% spend with 65% completion, indicating good budget management.'
        },
        // Slide 8: Next Steps
        {
            type: 'content',
            title: 'Next Steps',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Immediate Actions (Next 2 Weeks):', subitems: [
                                { text: 'Complete core feature development' },
                                { text: 'Begin integration testing' },
                                { text: 'Finalize deployment plan' }
                            ] },
                        { text: 'Short Term (Next Month):', subitems: [
                                { text: 'Complete all testing phases' },
                                { text: 'Conduct user acceptance testing' },
                                { text: 'Prepare production environment' }
                            ] },
                        { text: 'Key Decisions Needed:', subitems: [
                                { text: 'Approve deployment date' },
                                { text: 'Sign off on training materials' },
                                { text: 'Confirm support model' }
                            ] }
                    ]
                }],
            notes: 'Clear next steps defined with immediate focus on completing development and beginning testing. Key decisions needed from stakeholders on deployment timing.'
        }
    ];
    return {
        title: `${projectName} Status Report`,
        author: data?.author || 'Project Manager',
        subject: 'Project Status Report',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
// ============================================================================
// TEMPLATE 2: EXECUTIVE PRESENTATION (10 slides)
// ============================================================================
function getExecutivePresentationTemplate(data) {
    const topic = data?.topic || '[Initiative Name]';
    const presenter = data?.presenter || '[Presenter Name]';
    const date = data?.date || new Date().toLocaleDateString();
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: topic,
            subtitle: `Executive Briefing | ${presenter} | ${date}`,
            notes: 'Executive presentation covering strategic initiative, market opportunity, and recommendations for leadership decision.'
        },
        // Slide 2: Executive Summary
        {
            type: 'content',
            title: 'Executive Summary',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Opportunity:', subitems: [
                                { text: 'Significant market opportunity identified in [market segment]' },
                                { text: 'Estimated revenue potential: $[X]M annually' }
                            ] },
                        { text: 'Recommendation:', subitems: [
                                { text: 'Invest $[X]M over [Y] months to capture market share' },
                                { text: 'Expected ROI: [Z]% within [timeframe]' }
                            ] },
                        { text: 'Key Benefits:', subitems: [
                                { text: 'Competitive advantage in emerging market' },
                                { text: 'Revenue diversification' },
                                { text: 'Enhanced customer value proposition' }
                            ] },
                        { text: 'Decision Required: Approve funding and resources by [date]' }
                    ]
                }],
            notes: 'Clear opportunity with quantified benefits. Seeking executive approval for investment to capture market opportunity.'
        },
        // Slide 3: Current State
        {
            type: 'content',
            title: 'Current State Analysis',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Market Position:', subitems: [
                                { text: 'Current market share: [X]%' },
                                { text: 'Primary competitors: [List]' },
                                { text: 'Customer satisfaction: [Score]' }
                            ] },
                        { text: 'Operational Capabilities:', subitems: [
                                { text: 'Existing infrastructure can support [X]% growth' },
                                { text: 'Team capacity: [X] FTEs available' },
                                { text: 'Technology stack: [Status]' }
                            ] },
                        { text: 'Challenges:', subitems: [
                                { text: 'Limited presence in target segment' },
                                { text: 'Competitive pressure increasing' },
                                { text: 'Customer expectations evolving' }
                            ] }
                    ]
                }],
            notes: 'Current state shows solid foundation but limited presence in target market. Operational capabilities exist to support expansion.'
        },
        // Slide 4: Market Opportunity Chart
        {
            type: 'chart',
            title: 'Market Opportunity',
            content: [{
                    type: 'chart',
                    chartType: 'column',
                    data: {
                        labels: ['2024', '2025', '2026', '2027', '2028'],
                        datasets: [
                            { name: 'Total Market Size', values: [500, 650, 850, 1100, 1400], color: '#146EB4' },
                            { name: 'Addressable Market', values: [200, 280, 380, 520, 700], color: '#FF9900' },
                            { name: 'Target Revenue', values: [20, 45, 85, 140, 210], color: '#232F3E' }
                        ]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'bottom',
                        title: 'Market Size & Revenue Projection ($M)',
                        xAxisTitle: 'Year',
                        yAxisTitle: 'Revenue ($M)',
                        showGridlines: true
                    }
                }],
            notes: 'Market growing at 25% CAGR. Our target is to capture 30% of addressable market by 2028, representing $210M in revenue.'
        },
        // Slide 5: Proposed Solution
        {
            type: 'content',
            title: 'Proposed Solution',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Strategic Approach:', subitems: [
                                { text: 'Develop new product line targeting [segment]' },
                                { text: 'Leverage existing infrastructure and capabilities' },
                                { text: 'Partner with key industry players for market access' }
                            ] },
                        { text: 'Key Components:', subitems: [
                                { text: 'Product Development: Enhanced features for target market' },
                                { text: 'Go-to-Market: Multi-channel distribution strategy' },
                                { text: 'Customer Success: Dedicated support and services' }
                            ] },
                        { text: 'Differentiation:', subitems: [
                                { text: 'Superior technology and performance' },
                                { text: 'Integrated ecosystem approach' },
                                { text: 'Customer-centric design and support' }
                            ] }
                    ]
                }],
            notes: 'Solution leverages our strengths while addressing market needs. Three-pronged approach: product, distribution, and support.'
        },
        // Slide 6: Implementation Roadmap
        {
            type: 'content',
            title: 'Implementation Roadmap',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Phase 1: Foundation (Months 1-3)', subitems: [
                                { text: 'Secure funding and resources' },
                                { text: 'Build core team' },
                                { text: 'Complete market research and validation' }
                            ] },
                        { text: 'Phase 2: Development (Months 4-8)', subitems: [
                                { text: 'Product development and testing' },
                                { text: 'Partnership agreements' },
                                { text: 'Marketing and sales preparation' }
                            ] },
                        { text: 'Phase 3: Launch (Months 9-12)', subitems: [
                                { text: 'Beta program with select customers' },
                                { text: 'Full market launch' },
                                { text: 'Scale operations and support' }
                            ] },
                        { text: 'Phase 4: Scale (Months 13-18)', subitems: [
                                { text: 'Expand to additional markets' },
                                { text: 'Enhance product capabilities' },
                                { text: 'Optimize operations for efficiency' }
                            ] }
                    ]
                }],
            notes: '18-month roadmap with clear phases. Foundation and development in first 8 months, launch and scale in remaining 10 months.'
        },
        // Slide 7: Financial Impact Chart
        {
            type: 'chart',
            title: 'Financial Impact',
            content: [{
                    type: 'chart',
                    chartType: 'line',
                    data: {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
                        datasets: [
                            { name: 'Investment', values: [2.5, 2.5, 2.0, 2.0, 1.5, 1.5, 1.0, 1.0], color: '#FF0000' },
                            { name: 'Revenue', values: [0, 0, 0.5, 1.5, 3.0, 5.0, 7.5, 10.0], color: '#00FF00' },
                            { name: 'Net Impact', values: [-2.5, -5.0, -6.5, -7.0, -5.5, -2.0, 4.5, 13.5], color: '#FF9900' }
                        ]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'bottom',
                        title: 'Cumulative Financial Impact ($M)',
                        xAxisTitle: 'Quarter',
                        yAxisTitle: 'Amount ($M)',
                        showGridlines: true
                    }
                }],
            notes: 'Break-even expected in Q7. Total investment of $14M with cumulative positive return by Q8. Strong ROI trajectory after initial investment period.'
        },
        // Slide 8: Risk Assessment Table
        {
            type: 'table',
            title: 'Risk Assessment',
            content: [{
                    type: 'table',
                    headers: ['Risk Category', 'Description', 'Impact', 'Likelihood', 'Mitigation Strategy'],
                    rows: [
                        ['Market', 'Slower adoption than projected', 'High', 'Medium', 'Phased rollout with early feedback loops'],
                        ['Competition', 'Competitive response', 'Medium', 'High', 'Fast execution and differentiation'],
                        ['Execution', 'Resource constraints', 'Medium', 'Low', 'Dedicated team and executive sponsorship'],
                        ['Technology', 'Technical challenges', 'High', 'Low', 'Proof of concept and expert consultation'],
                        ['Financial', 'Cost overruns', 'Medium', 'Medium', 'Contingency budget and milestone reviews']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Five key risk categories identified with mitigation strategies. Market and technology risks are highest impact but manageable with proper planning.'
        },
        // Slide 9: Success Metrics
        {
            type: 'content',
            title: 'Success Metrics',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Financial Metrics:', subitems: [
                                { text: 'Revenue: $210M by Year 3' },
                                { text: 'ROI: 150% by Year 3' },
                                { text: 'Profit Margin: 35% by Year 2' }
                            ] },
                        { text: 'Market Metrics:', subitems: [
                                { text: 'Market Share: 30% of addressable market' },
                                { text: 'Customer Acquisition: 500+ enterprise customers' },
                                { text: 'Brand Recognition: Top 3 in category' }
                            ] },
                        { text: 'Operational Metrics:', subitems: [
                                { text: 'Customer Satisfaction: >90% CSAT score' },
                                { text: 'Time to Market: Launch within 12 months' },
                                { text: 'Team Productivity: >85% utilization' }
                            ] },
                        { text: 'Quarterly Reviews: Track progress against all metrics' }
                    ]
                }],
            notes: 'Clear success metrics across financial, market, and operational dimensions. Quarterly reviews ensure accountability and course correction.'
        },
        // Slide 10: Recommendations
        {
            type: 'content',
            title: 'Recommendations',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Primary Recommendation:', subitems: [
                                { text: 'Approve $14M investment over 18 months' },
                                { text: 'Authorize team of 25 FTEs' },
                                { text: 'Commit to Q3 2026 launch date' }
                            ] },
                        { text: 'Critical Success Factors:', subitems: [
                                { text: 'Executive sponsorship and support' },
                                { text: 'Dedicated resources (not shared)' },
                                { text: 'Fast decision-making authority' }
                            ] },
                        { text: 'Next Steps:', subitems: [
                                { text: 'Decision by [date]' },
                                { text: 'Kickoff meeting within 2 weeks of approval' },
                                { text: 'Monthly executive updates' }
                            ] },
                        { text: 'Alternative: Pilot program with $3M investment to validate assumptions' }
                    ]
                }],
            notes: 'Seeking approval for full investment with clear success factors. Alternative pilot option available if full commitment not feasible. Decision needed by [date] to meet timeline.'
        }
    ];
    return {
        title: `${topic} - Executive Briefing`,
        author: presenter,
        subject: 'Executive Presentation',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
// ============================================================================
// TEMPLATE 3: TRAINING DECK (12 slides)
// ============================================================================
function getTrainingDeckTemplate(data) {
    const trainingTopic = data?.topic || '[Training Topic]';
    const trainer = data?.trainer || '[Trainer Name]';
    const duration = data?.duration || '[Duration]';
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: trainingTopic,
            subtitle: `Training Session | ${trainer} | Duration: ${duration}`,
            notes: 'Welcome participants and introduce the training session. Set expectations for interactive learning.'
        },
        // Slide 2: Learning Objectives
        {
            type: 'content',
            title: 'Learning Objectives',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'By the end of this training, you will be able to:' },
                        { text: 'Understand the fundamental concepts of [topic]', level: 1 },
                        { text: 'Apply [skill/technique] in real-world scenarios', level: 1 },
                        { text: 'Identify common challenges and solutions', level: 1 },
                        { text: 'Use [tools/resources] effectively', level: 1 },
                        { text: 'Demonstrate proficiency through hands-on exercises', level: 1 }
                    ]
                }],
            notes: 'Review learning objectives with participants. Emphasize practical application and hands-on practice.'
        },
        // Slide 3: Agenda Table
        {
            type: 'table',
            title: 'Training Agenda',
            content: [{
                    type: 'table',
                    headers: ['Time', 'Topic', 'Activity', 'Duration'],
                    rows: [
                        ['9:00 AM', 'Introduction & Objectives', 'Presentation', '15 min'],
                        ['9:15 AM', 'Core Concepts - Fundamentals', 'Lecture', '30 min'],
                        ['9:45 AM', 'Core Concepts - Advanced', 'Lecture', '30 min'],
                        ['10:15 AM', 'Break', 'Break', '15 min'],
                        ['10:30 AM', 'Hands-On Exercise', 'Practice', '45 min'],
                        ['11:15 AM', 'Case Study Discussion', 'Group Work', '30 min'],
                        ['11:45 AM', 'Common Pitfalls & Best Practices', 'Discussion', '20 min'],
                        ['12:05 PM', 'Tools & Resources', 'Demo', '15 min'],
                        ['12:20 PM', 'Knowledge Check & Q&A', 'Assessment', '20 min'],
                        ['12:40 PM', 'Next Steps & Wrap-Up', 'Closing', '10 min']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Detailed agenda with timing. Total duration is approximately 3.5 hours including break. Adjust timing based on group needs.'
        },
        // Slide 4: Introduction
        {
            type: 'content',
            title: 'Introduction',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'What is [Topic]?', subitems: [
                                { text: 'Definition and context' },
                                { text: 'Why it matters in our organization' },
                                { text: 'Real-world applications' }
                            ] },
                        { text: 'Key Benefits:', subitems: [
                                { text: 'Improved efficiency and productivity' },
                                { text: 'Better decision-making capabilities' },
                                { text: 'Enhanced collaboration and communication' }
                            ] },
                        { text: 'Prerequisites:', subitems: [
                                { text: 'Basic understanding of [prerequisite]' },
                                { text: 'Access to [system/tool]' },
                                { text: 'Willingness to practice and learn' }
                            ] }
                    ]
                }],
            notes: 'Provide context and motivation for learning. Connect to participants daily work and organizational goals.'
        },
        // Slide 5: Core Concepts - Fundamentals
        {
            type: 'content',
            title: 'Core Concepts: Fundamentals',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Concept 1: [Fundamental Principle]', subitems: [
                                { text: 'Definition and explanation' },
                                { text: 'Key characteristics' },
                                { text: 'Simple example' }
                            ] },
                        { text: 'Concept 2: [Core Component]', subitems: [
                                { text: 'How it works' },
                                { text: 'Common use cases' },
                                { text: 'Best practices' }
                            ] },
                        { text: 'Concept 3: [Essential Element]', subitems: [
                                { text: 'Relationship to other concepts' },
                                { text: 'Practical applications' },
                                { text: 'Things to remember' }
                            ] }
                    ]
                }],
            notes: 'Cover fundamental concepts with clear explanations and examples. Check for understanding before moving to advanced topics.'
        },
        // Slide 6: Core Concepts - Advanced
        {
            type: 'content',
            title: 'Core Concepts: Advanced',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Advanced Technique 1: [Complex Application]', subitems: [
                                { text: 'When to use this approach' },
                                { text: 'Step-by-step process' },
                                { text: 'Expected outcomes' }
                            ] },
                        { text: 'Advanced Technique 2: [Optimization Strategy]', subitems: [
                                { text: 'Performance considerations' },
                                { text: 'Trade-offs and decisions' },
                                { text: 'Real-world scenarios' }
                            ] },
                        { text: 'Integration & Workflows:', subitems: [
                                { text: 'How concepts work together' },
                                { text: 'End-to-end process flow' },
                                { text: 'Troubleshooting tips' }
                            ] }
                    ]
                }],
            notes: 'Build on fundamentals with advanced concepts. Use real examples from your organization. Encourage questions and discussion.'
        },
        // Slide 7: Hands-On Exercise
        {
            type: 'content',
            title: 'Hands-On Exercise',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Exercise Objective:', subitems: [
                                { text: 'Apply concepts learned to solve a practical problem' },
                                { text: 'Practice using tools and techniques' },
                                { text: 'Build confidence through hands-on experience' }
                            ] },
                        { text: 'Scenario:', subitems: [
                                { text: '[Describe realistic work scenario]' },
                                { text: '[Provide context and constraints]' },
                                { text: '[Define success criteria]' }
                            ] },
                        { text: 'Instructions:', subitems: [
                                { text: 'Step 1: [Action]' },
                                { text: 'Step 2: [Action]' },
                                { text: 'Step 3: [Action]' },
                                { text: 'Step 4: [Action]' }
                            ] },
                        { text: 'Time: 45 minutes | Work in pairs | Ask questions anytime' }
                    ]
                }],
            notes: 'Facilitate hands-on practice. Circulate to provide guidance. Encourage collaboration and problem-solving.'
        },
        // Slide 8: Case Study
        {
            type: 'content',
            title: 'Case Study: Real-World Application',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Background:', subitems: [
                                { text: 'Company: [Organization name]' },
                                { text: 'Challenge: [Problem they faced]' },
                                { text: 'Context: [Relevant details]' }
                            ] },
                        { text: 'Approach:', subitems: [
                                { text: 'Applied [concept/technique] to address challenge' },
                                { text: 'Implemented [solution] over [timeframe]' },
                                { text: 'Involved [stakeholders/teams]' }
                            ] },
                        { text: 'Results:', subitems: [
                                { text: 'Achieved [quantifiable outcome]' },
                                { text: 'Improved [metric] by [percentage]' },
                                { text: 'Reduced [cost/time] by [amount]' }
                            ] },
                        { text: 'Key Lessons:', subitems: [
                                { text: 'Lesson 1: [Insight]' },
                                { text: 'Lesson 2: [Insight]' },
                                { text: 'Lesson 3: [Insight]' }
                            ] }
                    ]
                }],
            notes: 'Discuss case study and draw parallels to participants situations. Facilitate group discussion on lessons learned and applicability.'
        },
        // Slide 9: Common Pitfalls Table
        {
            type: 'table',
            title: 'Common Pitfalls & How to Avoid Them',
            content: [{
                    type: 'table',
                    headers: ['Pitfall', 'Why It Happens', 'Impact', 'Prevention Strategy'],
                    rows: [
                        ['Skipping fundamentals', 'Rushing to advanced topics', 'Weak foundation', 'Master basics before advancing'],
                        ['Not practicing enough', 'Time constraints', 'Limited proficiency', 'Schedule regular practice time'],
                        ['Ignoring best practices', 'Unaware or shortcuts', 'Technical debt', 'Follow established guidelines'],
                        ['Working in isolation', 'Lack of collaboration', 'Missed learning', 'Engage with community/team'],
                        ['Avoiding documentation', 'Seems time-consuming', 'Knowledge loss', 'Document as you go']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Review common mistakes and how to avoid them. Share experiences and encourage participants to learn from others mistakes.'
        },
        // Slide 10: Tools & Resources
        {
            type: 'content',
            title: 'Tools & Resources',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Essential Tools:', subitems: [
                                { text: '[Tool 1]: [Purpose and access link]' },
                                { text: '[Tool 2]: [Purpose and access link]' },
                                { text: '[Tool 3]: [Purpose and access link]' }
                            ] },
                        { text: 'Learning Resources:', subitems: [
                                { text: 'Documentation: [Link to official docs]' },
                                { text: 'Video Tutorials: [Link to video library]' },
                                { text: 'Practice Exercises: [Link to exercises]' }
                            ] },
                        { text: 'Support & Community:', subitems: [
                                { text: 'Internal Slack Channel: #[channel-name]' },
                                { text: 'Office Hours: [Schedule and location]' },
                                { text: 'Expert Contacts: [Names and emails]' }
                            ] },
                        { text: 'Additional Materials:', subitems: [
                                { text: 'Cheat Sheet: [Link]' },
                                { text: 'Quick Reference Guide: [Link]' },
                                { text: 'FAQ Document: [Link]' }
                            ] }
                    ]
                }],
            notes: 'Provide comprehensive list of resources. Demonstrate key tools if time permits. Ensure all links are accessible to participants.'
        },
        // Slide 11: Knowledge Check
        {
            type: 'content',
            title: 'Knowledge Check',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Question 1: What are the three fundamental concepts we covered?', subitems: [
                                { text: 'Answer: [Concept 1, Concept 2, Concept 3]' }
                            ] },
                        { text: 'Question 2: When should you use [advanced technique]?', subitems: [
                                { text: 'Answer: [Appropriate scenarios and conditions]' }
                            ] },
                        { text: 'Question 3: What is the most common pitfall and how do you avoid it?', subitems: [
                                { text: 'Answer: [Pitfall and prevention strategy]' }
                            ] },
                        { text: 'Question 4: Name two tools you will use in your daily work.', subitems: [
                                { text: 'Answer: [Tool 1 and Tool 2 with use cases]' }
                            ] },
                        { text: 'Question 5: What is your key takeaway from this training?', subitems: [
                                { text: 'Open discussion - share with the group' }
                            ] }
                    ]
                }],
            notes: 'Interactive knowledge check. Ask questions and facilitate discussion. Clarify any remaining confusion before closing.'
        },
        // Slide 12: Next Steps
        {
            type: 'content',
            title: 'Next Steps & Wrap-Up',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Immediate Actions:', subitems: [
                                { text: 'Complete post-training survey: [Link]' },
                                { text: 'Access training materials: [Link to shared folder]' },
                                { text: 'Join community channel: #[channel-name]' }
                            ] },
                        { text: 'Practice & Application:', subitems: [
                                { text: 'Apply concepts to your current project' },
                                { text: 'Complete additional exercises (optional)' },
                                { text: 'Share learnings with your team' }
                            ] },
                        { text: 'Continued Learning:', subitems: [
                                { text: 'Advanced training session: [Date]' },
                                { text: 'Office hours: Every [day] at [time]' },
                                { text: 'Certification program: [Link]' }
                            ] },
                        { text: 'Questions? Contact: [trainer email]' },
                        { text: 'Thank you for participating!' }
                    ]
                }],
            notes: 'Summarize key points and provide clear next steps. Thank participants and encourage continued learning and practice.'
        }
    ];
    return {
        title: `${trainingTopic} - Training Deck`,
        author: trainer,
        subject: 'Training Presentation',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
// ============================================================================
// TEMPLATE 4: CHANGE MANAGEMENT (9 slides)
// ============================================================================
function getChangeManagementTemplate(data) {
    const changeName = data?.changeName || '[Change Initiative]';
    const changeOwner = data?.owner || '[Change Owner]';
    const effectiveDate = data?.effectiveDate || '[Effective Date]';
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: changeName,
            subtitle: `Change Management Plan | ${changeOwner} | Effective: ${effectiveDate}`,
            notes: 'Introduction to change initiative. Set positive tone and emphasize benefits while acknowledging challenges.'
        },
        // Slide 2: Why Change?
        {
            type: 'content',
            title: 'Why Change?',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Current Challenges:', subitems: [
                                { text: 'Inefficient processes causing delays' },
                                { text: 'Customer satisfaction declining' },
                                { text: 'Competitive pressure increasing' },
                                { text: 'Technology becoming outdated' }
                            ] },
                        { text: 'Business Drivers:', subitems: [
                                { text: 'Need to improve operational efficiency by 30%' },
                                { text: 'Requirement to meet new regulatory standards' },
                                { text: 'Strategic initiative to enhance customer experience' },
                                { text: 'Cost reduction targets for next fiscal year' }
                            ] },
                        { text: 'Cost of Not Changing:', subitems: [
                                { text: 'Continued loss of market share' },
                                { text: 'Increased operational costs' },
                                { text: 'Risk of non-compliance penalties' },
                                { text: 'Employee frustration and turnover' }
                            ] }
                    ]
                }],
            notes: 'Clearly articulate why change is necessary. Connect to business outcomes and individual impact. Address the "what happens if we dont change" question.'
        },
        // Slide 3: Current vs Future State
        {
            type: 'two-column',
            title: 'Current State vs. Future State',
            content: [
                {
                    type: 'bullets',
                    items: [
                        { text: 'CURRENT STATE' },
                        { text: 'Manual, paper-based processes', level: 1 },
                        { text: 'Average processing time: 5 days', level: 1 },
                        { text: 'Error rate: 12%', level: 1 },
                        { text: 'Limited visibility and tracking', level: 1 },
                        { text: 'Siloed teams and information', level: 1 },
                        { text: 'Customer satisfaction: 72%', level: 1 }
                    ]
                },
                {
                    type: 'bullets',
                    items: [
                        { text: 'FUTURE STATE' },
                        { text: 'Automated, digital workflows', level: 1 },
                        { text: 'Average processing time: 1 day', level: 1 },
                        { text: 'Error rate: <2%', level: 1 },
                        { text: 'Real-time dashboards and reporting', level: 1 },
                        { text: 'Integrated systems and collaboration', level: 1 },
                        { text: 'Customer satisfaction: >90%', level: 1 }
                    ]
                }
            ],
            notes: 'Clear comparison of current and future states. Quantify improvements where possible. Paint compelling vision of future state.'
        },
        // Slide 4: Impact Analysis
        {
            type: 'content',
            title: 'Impact Analysis',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'People Impact:', subitems: [
                                { text: 'All team members will need training on new system' },
                                { text: 'Role changes for 15% of staff' },
                                { text: 'New skills required: [list key skills]' },
                                { text: 'Estimated learning curve: 2-4 weeks' }
                            ] },
                        { text: 'Process Impact:', subitems: [
                                { text: '8 major processes being redesigned' },
                                { text: 'New approval workflows and authorities' },
                                { text: 'Updated policies and procedures' },
                                { text: 'Integration with 3 existing systems' }
                            ] },
                        { text: 'Technology Impact:', subitems: [
                                { text: 'New software platform implementation' },
                                { text: 'Data migration from legacy systems' },
                                { text: 'Infrastructure upgrades required' },
                                { text: 'Mobile access capabilities added' }
                            ] },
                        { text: 'Timeline Impact:', subitems: [
                                { text: 'Phased rollout over 6 months' },
                                { text: 'Temporary dual operations during transition' },
                                { text: 'Increased workload during implementation' }
                            ] }
                    ]
                }],
            notes: 'Comprehensive impact analysis across all dimensions. Be transparent about challenges and temporary disruptions.'
        },
        // Slide 5: Communication Plan Table
        {
            type: 'table',
            title: 'Communication Plan',
            content: [{
                    type: 'table',
                    headers: ['Audience', 'Message', 'Channel', 'Frequency', 'Owner'],
                    rows: [
                        ['Executive Leadership', 'Strategic updates & decisions', 'Executive briefing', 'Monthly', 'Change Owner'],
                        ['All Employees', 'Change overview & benefits', 'Town Hall', 'Quarterly', 'Leadership Team'],
                        ['Affected Teams', 'Detailed changes & training', 'Team meetings', 'Weekly', 'Team Leads'],
                        ['Customers', 'Service improvements', 'Email newsletter', 'As needed', 'Comms Team'],
                        ['Project Team', 'Implementation status', 'Standup meetings', 'Daily', 'Project Manager'],
                        ['Stakeholders', 'Progress & issues', 'Status reports', 'Bi-weekly', 'Change Owner']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Structured communication plan for all stakeholder groups. Tailor messages to each audience. Maintain consistent and transparent communication.'
        },
        // Slide 6: Training Plan
        {
            type: 'content',
            title: 'Training Plan',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Training Approach:', subitems: [
                                { text: 'Blended learning: Online modules + instructor-led sessions' },
                                { text: 'Role-based training paths' },
                                { text: 'Hands-on practice in sandbox environment' },
                                { text: 'Train-the-trainer model for sustainability' }
                            ] },
                        { text: 'Training Modules:', subitems: [
                                { text: 'Module 1: System Overview (2 hours, online)' },
                                { text: 'Module 2: Core Workflows (4 hours, instructor-led)' },
                                { text: 'Module 3: Advanced Features (3 hours, instructor-led)' },
                                { text: 'Module 4: Troubleshooting (1 hour, online)' }
                            ] },
                        { text: 'Schedule:', subitems: [
                                { text: 'Pilot group training: Weeks 1-2' },
                                { text: 'Wave 1 (Team A & B): Weeks 3-4' },
                                { text: 'Wave 2 (Team C & D): Weeks 5-6' },
                                { text: 'Wave 3 (Remaining teams): Weeks 7-8' }
                            ] },
                        { text: 'Support:', subitems: [
                                { text: 'Help desk available during business hours' },
                                { text: 'Quick reference guides and job aids' },
                                { text: 'Champions network for peer support' }
                            ] }
                    ]
                }],
            notes: 'Comprehensive training plan with multiple delivery methods. Phased approach allows for feedback and adjustments. Ongoing support critical for success.'
        },
        // Slide 7: Rollout Timeline
        {
            type: 'content',
            title: 'Rollout Timeline',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Phase 1: Preparation (Months 1-2)', subitems: [
                                { text: 'Finalize system configuration' },
                                { text: 'Develop training materials' },
                                { text: 'Identify and train champions' },
                                { text: 'Communication campaign launch' }
                            ] },
                        { text: 'Phase 2: Pilot (Month 3)', subitems: [
                                { text: 'Deploy to pilot group (50 users)' },
                                { text: 'Intensive support and monitoring' },
                                { text: 'Gather feedback and refine' },
                                { text: 'Validate success metrics' }
                            ] },
                        { text: 'Phase 3: Rollout (Months 4-5)', subitems: [
                                { text: 'Wave 1: Department A (200 users)' },
                                { text: 'Wave 2: Department B (300 users)' },
                                { text: 'Wave 3: Remaining departments (500 users)' },
                                { text: 'Parallel operations during transition' }
                            ] },
                        { text: 'Phase 4: Stabilization (Month 6)', subitems: [
                                { text: 'Decommission legacy systems' },
                                { text: 'Optimize processes based on usage' },
                                { text: 'Measure and report on benefits' },
                                { text: 'Transition to steady-state support' }
                            ] }
                    ]
                }],
            notes: 'Six-month rollout with phased approach. Pilot phase critical for validation and refinement. Build in time for stabilization before declaring success.'
        },
        // Slide 8: Support Resources
        {
            type: 'content',
            title: 'Support Resources',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Help Desk:', subitems: [
                                { text: 'Email: changehelp@amazon.com' },
                                { text: 'Phone: 1-800-XXX-XXXX' },
                                { text: 'Hours: 8 AM - 6 PM EST, Monday-Friday' },
                                { text: 'SLA: Response within 4 hours' }
                            ] },
                        { text: 'Self-Service Resources:', subitems: [
                                { text: 'Knowledge base: [URL]' },
                                { text: 'Video tutorials: [URL]' },
                                { text: 'FAQs: [URL]' },
                                { text: 'Quick reference guides: [URL]' }
                            ] },
                        { text: 'Champions Network:', subitems: [
                                { text: '25 trained champions across all departments' },
                                { text: 'Peer support and guidance' },
                                { text: 'Feedback channel to project team' },
                                { text: 'Directory: [URL]' }
                            ] },
                        { text: 'Office Hours:', subitems: [
                                { text: 'Weekly drop-in sessions' },
                                { text: 'Tuesdays & Thursdays, 2-3 PM' },
                                { text: 'Virtual meeting link: [URL]' }
                            ] }
                    ]
                }],
            notes: 'Multiple support channels to meet different needs. Champions network provides peer support. Self-service resources reduce help desk load.'
        },
        // Slide 9: Success Metrics
        {
            type: 'content',
            title: 'Success Metrics',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Adoption Metrics:', subitems: [
                                { text: 'User adoption rate: >95% within 3 months' },
                                { text: 'Training completion: 100% of affected staff' },
                                { text: 'System usage: >80% of transactions in new system' },
                                { text: 'Legacy system decommissioned by Month 6' }
                            ] },
                        { text: 'Performance Metrics:', subitems: [
                                { text: 'Processing time reduced from 5 days to 1 day' },
                                { text: 'Error rate reduced from 12% to <2%' },
                                { text: 'Customer satisfaction improved to >90%' },
                                { text: 'Operational costs reduced by 25%' }
                            ] },
                        { text: 'Change Management Metrics:', subitems: [
                                { text: 'Employee satisfaction with change process: >75%' },
                                { text: 'Help desk tickets declining after Month 2' },
                                { text: 'Champions network engagement: >80%' },
                                { text: 'Communication effectiveness: >70% awareness' }
                            ] },
                        { text: 'Measurement Approach:', subitems: [
                                { text: 'Weekly dashboards during rollout' },
                                { text: 'Monthly reviews with leadership' },
                                { text: 'Surveys at 30, 60, and 90 days post-rollout' },
                                { text: 'Final benefits realization report at 6 months' }
                            ] }
                    ]
                }],
            notes: 'Comprehensive metrics covering adoption, performance, and change management. Regular measurement and reporting ensures accountability and enables course correction.'
        }
    ];
    return {
        title: `${changeName} - Change Management Plan`,
        author: changeOwner,
        subject: 'Change Management',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
// ============================================================================
// TEMPLATE 5: TECHNICAL REVIEW (11 slides)
// ============================================================================
function getTechnicalReviewTemplate(data) {
    const systemName = data?.systemName || '[System Name]';
    const architect = data?.architect || '[Technical Architect]';
    const reviewDate = data?.date || new Date().toLocaleDateString();
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: `${systemName} Technical Review`,
            subtitle: `Architecture & Implementation | ${architect} | ${reviewDate}`,
            notes: 'Technical review for architecture approval. Focus on design decisions, trade-offs, and implementation approach.'
        },
        // Slide 2: Agenda
        {
            type: 'agenda',
            title: 'Agenda',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'System Overview' },
                        { text: 'Architecture Design' },
                        { text: 'Technical Requirements' },
                        { text: 'Implementation Approach' },
                        { text: 'Technology Stack' },
                        { text: 'Security Considerations' },
                        { text: 'Performance & Scalability' },
                        { text: 'Deployment Strategy' },
                        { text: 'Q&A' }
                    ]
                }],
            notes: 'Comprehensive technical review covering all aspects of system design and implementation.'
        },
        // Slide 3: System Overview
        {
            type: 'content',
            title: 'System Overview',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Purpose:', subitems: [
                                { text: 'Modernize legacy order processing system' },
                                { text: 'Support 10x transaction volume growth' },
                                { text: 'Enable real-time analytics and reporting' }
                            ] },
                        { text: 'Scope:', subitems: [
                                { text: 'Order management and fulfillment' },
                                { text: 'Inventory tracking and allocation' },
                                { text: 'Customer notifications and updates' },
                                { text: 'Integration with payment and shipping systems' }
                            ] },
                        { text: 'Key Requirements:', subitems: [
                                { text: 'Process 100,000 orders per day' },
                                { text: '99.9% uptime SLA' },
                                { text: '<2 second response time' },
                                { text: 'Support for 50 concurrent users' }
                            ] },
                        { text: 'Constraints:', subitems: [
                                { text: 'Must integrate with existing ERP system' },
                                { text: 'Budget: $2M for development' },
                                { text: 'Timeline: 9 months to production' }
                            ] }
                    ]
                }],
            notes: 'Clear system purpose and scope. Quantified requirements and constraints provide context for design decisions.'
        },
        // Slide 4: Architecture Diagram Placeholder
        {
            type: 'content',
            title: 'System Architecture',
            content: [{
                    type: 'text',
                    text: '[ARCHITECTURE DIAGRAM]',
                    style: { size: 24, bold: true, align: 'center' }
                }, {
                    type: 'bullets',
                    items: [
                        { text: 'Key Components:' },
                        { text: 'API Gateway: Entry point for all requests', level: 1 },
                        { text: 'Order Service: Core business logic (microservice)', level: 1 },
                        { text: 'Inventory Service: Stock management (microservice)', level: 1 },
                        { text: 'Notification Service: Customer communications', level: 1 },
                        { text: 'Database: PostgreSQL with read replicas', level: 1 },
                        { text: 'Message Queue: RabbitMQ for async processing', level: 1 },
                        { text: 'Cache Layer: Redis for performance', level: 1 }
                    ]
                }],
            notes: 'Microservices architecture with clear separation of concerns. API Gateway provides single entry point. Message queue enables async processing and decoupling.'
        },
        // Slide 5: Technical Requirements
        {
            type: 'content',
            title: 'Technical Requirements',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Functional Requirements:', subitems: [
                                { text: 'Order creation, modification, and cancellation' },
                                { text: 'Real-time inventory checking and allocation' },
                                { text: 'Automated customer notifications (email, SMS)' },
                                { text: 'Integration with payment gateway' },
                                { text: 'Shipping label generation and tracking' }
                            ] },
                        { text: 'Non-Functional Requirements:', subitems: [
                                { text: 'Performance: <2s response time for 95th percentile' },
                                { text: 'Scalability: Support 10x growth without redesign' },
                                { text: 'Availability: 99.9% uptime (8.76 hours downtime/year)' },
                                { text: 'Security: PCI DSS compliance for payment data' },
                                { text: 'Maintainability: Modular design, comprehensive docs' }
                            ] },
                        { text: 'Integration Requirements:', subitems: [
                                { text: 'REST APIs for all external integrations' },
                                { text: 'Real-time sync with ERP system' },
                                { text: 'Webhook support for event notifications' },
                                { text: 'Batch processing for reporting' }
                            ] }
                    ]
                }],
            notes: 'Comprehensive requirements covering functional, non-functional, and integration needs. Quantified NFRs enable objective validation.'
        },
        // Slide 6: Implementation Approach
        {
            type: 'content',
            title: 'Implementation Approach',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Development Methodology:', subitems: [
                                { text: 'Agile/Scrum with 2-week sprints' },
                                { text: 'CI/CD pipeline for automated testing and deployment' },
                                { text: 'Code reviews and pair programming' },
                                { text: 'Test-driven development (TDD) for critical paths' }
                            ] },
                        { text: 'Phased Delivery:', subitems: [
                                { text: 'Phase 1: Core order processing (Months 1-3)' },
                                { text: 'Phase 2: Inventory integration (Months 4-5)' },
                                { text: 'Phase 3: Notifications and reporting (Months 6-7)' },
                                { text: 'Phase 4: Performance optimization (Months 8-9)' }
                            ] },
                        { text: 'Quality Assurance:', subitems: [
                                { text: 'Unit tests: >80% code coverage' },
                                { text: 'Integration tests for all APIs' },
                                { text: 'Load testing to validate performance' },
                                { text: 'Security testing and penetration testing' },
                                { text: 'User acceptance testing with business users' }
                            ] },
                        { text: 'Risk Mitigation:', subitems: [
                                { text: 'Proof of concept for complex integrations' },
                                { text: 'Parallel run with legacy system' },
                                { text: 'Rollback plan for each deployment' }
                            ] }
                    ]
                }],
            notes: 'Agile methodology with phased delivery reduces risk. Comprehensive testing strategy ensures quality. Parallel run provides safety net during transition.'
        },
        // Slide 7: Technology Stack Table
        {
            type: 'table',
            title: 'Technology Stack',
            content: [{
                    type: 'table',
                    headers: ['Layer', 'Technology', 'Version', 'Justification'],
                    rows: [
                        ['Frontend', 'React', '18.x', 'Modern UI framework, large ecosystem'],
                        ['API Gateway', 'Kong', '3.x', 'Enterprise-grade, plugin architecture'],
                        ['Backend', 'Node.js', '20 LTS', 'High performance, async I/O'],
                        ['Framework', 'Express', '4.x', 'Mature, well-documented'],
                        ['Database', 'PostgreSQL', '15.x', 'ACID compliance, JSON support'],
                        ['Cache', 'Redis', '7.x', 'In-memory performance, pub/sub'],
                        ['Message Queue', 'RabbitMQ', '3.12', 'Reliable message delivery'],
                        ['Container', 'Docker', '24.x', 'Consistent environments'],
                        ['Orchestration', 'Kubernetes', '1.28', 'Scalability, self-healing'],
                        ['Monitoring', 'Datadog', 'Latest', 'Comprehensive observability'],
                        ['CI/CD', 'GitHub Actions', 'Latest', 'Integrated with repository']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Modern, proven technology stack. All components are enterprise-grade with strong community support. Justifications provided for each choice.'
        },
        // Slide 8: Security Considerations
        {
            type: 'content',
            title: 'Security Considerations',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Authentication & Authorization:', subitems: [
                                { text: 'OAuth 2.0 / OpenID Connect for authentication' },
                                { text: 'Role-based access control (RBAC)' },
                                { text: 'JWT tokens with short expiration' },
                                { text: 'Multi-factor authentication for admin access' }
                            ] },
                        { text: 'Data Protection:', subitems: [
                                { text: 'Encryption at rest (AES-256)' },
                                { text: 'Encryption in transit (TLS 1.3)' },
                                { text: 'PII data masking in logs' },
                                { text: 'Secure key management (AWS KMS)' }
                            ] },
                        { text: 'Application Security:', subitems: [
                                { text: 'Input validation and sanitization' },
                                { text: 'SQL injection prevention (parameterized queries)' },
                                { text: 'XSS protection (Content Security Policy)' },
                                { text: 'CSRF tokens for state-changing operations' },
                                { text: 'Rate limiting to prevent abuse' }
                            ] },
                        { text: 'Compliance:', subitems: [
                                { text: 'PCI DSS for payment data' },
                                { text: 'GDPR for customer data privacy' },
                                { text: 'SOC 2 Type II certification' },
                                { text: 'Regular security audits and penetration testing' }
                            ] }
                    ]
                }],
            notes: 'Comprehensive security approach covering authentication, data protection, and compliance. Defense in depth strategy with multiple layers of security.'
        },
        // Slide 9: Performance Metrics
        {
            type: 'content',
            title: 'Performance & Scalability',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Performance Targets:', subitems: [
                                { text: 'API response time: <200ms (p50), <2s (p95)' },
                                { text: 'Database query time: <50ms average' },
                                { text: 'Page load time: <3s (p95)' },
                                { text: 'Throughput: 1000 requests/second' }
                            ] },
                        { text: 'Scalability Strategy:', subitems: [
                                { text: 'Horizontal scaling of microservices' },
                                { text: 'Database read replicas for query distribution' },
                                { text: 'Redis cache for frequently accessed data' },
                                { text: 'CDN for static assets' },
                                { text: 'Auto-scaling based on CPU and memory metrics' }
                            ] },
                        { text: 'Optimization Techniques:', subitems: [
                                { text: 'Database indexing strategy' },
                                { text: 'Query optimization and connection pooling' },
                                { text: 'Lazy loading and pagination' },
                                { text: 'Async processing for non-critical operations' },
                                { text: 'Compression for API responses' }
                            ] },
                        { text: 'Monitoring:', subitems: [
                                { text: 'Real-time performance dashboards' },
                                { text: 'Alerting on SLA violations' },
                                { text: 'Distributed tracing for debugging' },
                                { text: 'Regular load testing' }
                            ] }
                    ]
                }],
            notes: 'Clear performance targets with strategies to achieve them. Scalability built into architecture. Comprehensive monitoring ensures issues are detected early.'
        },
        // Slide 10: Deployment Strategy
        {
            type: 'content',
            title: 'Deployment Strategy',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Environments:', subitems: [
                                { text: 'Development: Individual developer environments' },
                                { text: 'Integration: Automated testing and integration' },
                                { text: 'Staging: Production-like environment for UAT' },
                                { text: 'Production: Live environment with HA setup' }
                            ] },
                        { text: 'CI/CD Pipeline:', subitems: [
                                { text: 'Automated build on code commit' },
                                { text: 'Unit and integration tests run automatically' },
                                { text: 'Security scanning (SAST, dependency check)' },
                                { text: 'Automated deployment to dev/integration' },
                                { text: 'Manual approval for staging/production' }
                            ] },
                        { text: 'Deployment Approach:', subitems: [
                                { text: 'Blue-green deployment for zero downtime' },
                                { text: 'Canary releases for gradual rollout' },
                                { text: 'Feature flags for controlled feature activation' },
                                { text: 'Automated rollback on health check failures' }
                            ] },
                        { text: 'Release Schedule:', subitems: [
                                { text: 'Development: Continuous deployment' },
                                { text: 'Staging: Daily deployments' },
                                { text: 'Production: Weekly releases (Thursdays)' },
                                { text: 'Hotfixes: As needed with expedited process' }
                            ] }
                    ]
                }],
            notes: 'Robust deployment strategy with multiple environments. CI/CD pipeline automates testing and deployment. Blue-green and canary deployments minimize risk.'
        },
        // Slide 11: Q&A
        {
            type: 'content',
            title: 'Questions & Discussion',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Key Discussion Points:' },
                        { text: 'Architecture design decisions and trade-offs', level: 1 },
                        { text: 'Technology stack choices', level: 1 },
                        { text: 'Security and compliance approach', level: 1 },
                        { text: 'Performance and scalability strategy', level: 1 },
                        { text: 'Implementation timeline and risks', level: 1 },
                        { text: '' },
                        { text: 'Next Steps:' },
                        { text: 'Architecture approval from review board', level: 1 },
                        { text: 'Finalize technology selections', level: 1 },
                        { text: 'Begin detailed design phase', level: 1 },
                        { text: 'Set up development environment', level: 1 },
                        { text: 'Kickoff sprint planning', level: 1 }
                    ]
                }],
            notes: 'Open floor for questions and discussion. Address concerns and gather feedback. Confirm next steps and approvals needed.'
        }
    ];
    return {
        title: `${systemName} - Technical Review`,
        author: architect,
        subject: 'Technical Architecture Review',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
// ============================================================================
// TEMPLATE 6: QUARTERLY REVIEW (13 slides)
// ============================================================================
function getQuarterlyReviewTemplate(data) {
    const quarter = data?.quarter || 'Q4 2025';
    const department = data?.department || '[Department Name]';
    const presenter = data?.presenter || '[Presenter Name]';
    const slides = [
        // Slide 1: Title
        {
            type: 'title',
            title: `${quarter} Quarterly Business Review`,
            subtitle: `${department} | ${presenter}`,
            notes: 'Quarterly business review covering performance, achievements, challenges, and plans for next quarter.'
        },
        // Slide 2: Agenda
        {
            type: 'agenda',
            title: 'Agenda',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Quarter Highlights' },
                        { text: 'Financial Performance' },
                        { text: 'Key Metrics' },
                        { text: 'Major Achievements' },
                        { text: 'Challenges & Lessons Learned' },
                        { text: 'Customer Feedback' },
                        { text: 'Team Updates' },
                        { text: 'Market Analysis' },
                        { text: 'Next Quarter Goals' },
                        { text: 'Budget Allocation' }
                    ]
                }],
            notes: 'Comprehensive quarterly review covering all aspects of business performance and planning.'
        },
        // Slide 3: Quarter Highlights
        {
            type: 'content',
            title: `${quarter} Highlights`,
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Top Achievements:', subitems: [
                                { text: 'Exceeded revenue target by 15% ($12.5M vs $10.9M target)' },
                                { text: 'Launched 3 major product features ahead of schedule' },
                                { text: 'Improved customer satisfaction score to 92% (up from 87%)' },
                                { text: 'Reduced operational costs by 18%' }
                            ] },
                        { text: 'Key Milestones:', subitems: [
                                { text: 'Completed digital transformation initiative' },
                                { text: 'Expanded to 2 new markets' },
                                { text: 'Achieved ISO 27001 certification' },
                                { text: 'Hired 25 new team members' }
                            ] },
                        { text: 'Recognition:', subitems: [
                                { text: 'Industry award for innovation' },
                                { text: 'Featured in [Publication]' },
                                { text: 'Customer success story published' }
                            ] }
                    ]
                }],
            notes: 'Strong quarter with revenue exceeding target and major milestones achieved. Customer satisfaction improvement particularly noteworthy.'
        },
        // Slide 4: Financial Performance Chart
        {
            type: 'chart',
            title: 'Financial Performance',
            content: [{
                    type: 'chart',
                    chartType: 'column',
                    data: {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                        datasets: [
                            { name: 'Revenue', values: [9.2, 10.5, 11.8, 12.5], color: '#FF9900' },
                            { name: 'Target', values: [9.0, 10.0, 11.0, 10.9], color: '#146EB4' },
                            { name: 'Costs', values: [6.5, 7.2, 7.8, 7.5], color: '#232F3E' }
                        ]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'bottom',
                        title: 'Quarterly Financial Performance ($M)',
                        xAxisTitle: 'Quarter',
                        yAxisTitle: 'Amount ($M)',
                        showGridlines: true
                    }
                }],
            notes: 'Consistent revenue growth throughout the year. Q4 exceeded target significantly. Cost reduction in Q4 improved margins.'
        },
        // Slide 5: Key Metrics Table
        {
            type: 'table',
            title: 'Key Performance Metrics',
            content: [{
                    type: 'table',
                    headers: ['Metric', 'Q3 Actual', 'Q4 Target', 'Q4 Actual', 'vs Target', 'Trend'],
                    rows: [
                        ['Revenue ($M)', '11.8', '10.9', '12.5', '+15%', '↑'],
                        ['Customer Acquisition', '1,250', '1,500', '1,680', '+12%', '↑'],
                        ['Customer Retention', '89%', '90%', '93%', '+3%', '↑'],
                        ['CSAT Score', '87%', '90%', '92%', '+2%', '↑'],
                        ['NPS', '45', '50', '52', '+4%', '↑'],
                        ['Operational Efficiency', '72%', '75%', '78%', '+4%', '↑'],
                        ['Employee Satisfaction', '81%', '85%', '84%', '-1%', '→'],
                        ['Time to Market (days)', '45', '40', '38', '+5%', '↑']
                    ],
                    style: {
                        headerBackground: '#232F3E',
                        headerStyle: { color: '#FFFFFF', bold: true },
                        alternateRows: true,
                        alternateRowColor: '#F5F5F5'
                    }
                }],
            notes: 'Exceeded targets on most metrics. Customer acquisition and retention both strong. Employee satisfaction slightly below target - area for focus.'
        },
        // Slide 6: Achievements
        {
            type: 'content',
            title: 'Major Achievements',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Product & Innovation:', subitems: [
                                { text: 'Launched AI-powered recommendation engine' },
                                { text: 'Released mobile app with 50K+ downloads' },
                                { text: 'Implemented real-time analytics dashboard' },
                                { text: 'Filed 3 patent applications' }
                            ] },
                        { text: 'Operational Excellence:', subitems: [
                                { text: 'Reduced incident response time by 40%' },
                                { text: 'Achieved 99.95% system uptime' },
                                { text: 'Automated 60% of manual processes' },
                                { text: 'Completed SOC 2 Type II audit' }
                            ] },
                        { text: 'Customer Success:', subitems: [
                                { text: 'Onboarded 15 enterprise customers' },
                                { text: 'Expanded 8 existing accounts (avg +35% ARR)' },
                                { text: 'Launched customer advisory board' },
                                { text: 'Published 12 customer success stories' }
                            ] },
                        { text: 'Team Development:', subitems: [
                                { text: 'Completed leadership training for 15 managers' },
                                { text: 'Launched mentorship program (40 participants)' },
                                { text: 'Achieved 95% training completion rate' }
                            ] }
                    ]
                }],
            notes: 'Significant achievements across all areas. Product innovation driving customer acquisition. Operational improvements enhancing efficiency and reliability.'
        },
        // Slide 7: Challenges
        {
            type: 'content',
            title: 'Challenges & Lessons Learned',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Challenges Faced:', subitems: [
                                { text: 'Supply chain disruptions delayed hardware rollout by 3 weeks' },
                                { text: 'Competitive pricing pressure in key market segment' },
                                { text: 'Integration complexity with legacy systems' },
                                { text: 'Talent acquisition in specialized roles' }
                            ] },
                        { text: 'How We Addressed Them:', subitems: [
                                { text: 'Diversified supplier base and increased buffer inventory' },
                                { text: 'Enhanced value proposition with bundled services' },
                                { text: 'Allocated additional resources to integration team' },
                                { text: 'Expanded recruiting channels and referral program' }
                            ] },
                        { text: 'Lessons Learned:', subitems: [
                                { text: 'Need for better risk assessment in planning phase' },
                                { text: 'Importance of early stakeholder engagement' },
                                { text: 'Value of cross-functional collaboration' },
                                { text: 'Benefits of iterative approach vs. big bang' }
                            ] },
                        { text: 'Actions for Next Quarter:', subitems: [
                                { text: 'Implement enhanced risk management process' },
                                { text: 'Establish regular stakeholder forums' },
                                { text: 'Create cross-functional tiger teams for key initiatives' }
                            ] }
                    ]
                }],
            notes: 'Transparent about challenges and how they were addressed. Lessons learned inform improvements for next quarter. Proactive action plans in place.'
        },
        // Slide 8: Customer Feedback
        {
            type: 'content',
            title: 'Customer Feedback',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'What Customers Love:', subitems: [
                                { text: '"Intuitive interface and easy onboarding" - 87% positive mentions' },
                                { text: '"Responsive customer support" - 92% satisfaction' },
                                { text: '"Powerful features that solve real problems" - Top feedback theme' },
                                { text: '"Reliable performance and uptime" - 95% satisfaction' }
                            ] },
                        { text: 'Areas for Improvement:', subitems: [
                                { text: 'Mobile app needs more features (mentioned by 45% of users)' },
                                { text: 'Reporting capabilities could be more flexible (38%)' },
                                { text: 'Integration with [Tool X] requested (32%)' },
                                { text: 'Pricing transparency for add-ons (28%)' }
                            ] },
                        { text: 'Customer Quotes:', subitems: [
                                { text: '"This platform has transformed how we work" - Fortune 500 CIO' },
                                { text: '"Best investment we made this year" - Mid-market CFO' },
                                { text: '"Support team goes above and beyond" - Enterprise Customer' }
                            ] },
                        { text: 'Actions Taken:', subitems: [
                                { text: 'Mobile app enhancement roadmap created' },
                                { text: 'Advanced reporting module in development' },
                                { text: '[Tool X] integration scheduled for Q1' },
                                { text: 'Pricing page redesign completed' }
                            ] }
                    ]
                }],
            notes: 'Strong positive feedback on core product and support. Clear themes in improvement requests. Already taking action on top requests.'
        },
        // Slide 9: Team Updates
        {
            type: 'content',
            title: 'Team Updates',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Team Growth:', subitems: [
                                { text: 'Started quarter: 125 FTEs' },
                                { text: 'New hires: 25 (Engineering: 12, Sales: 8, Support: 5)' },
                                { text: 'Departures: 5 (4.0% attrition, below industry avg)' },
                                { text: 'Ending quarter: 145 FTEs' }
                            ] },
                        { text: 'Key Appointments:', subitems: [
                                { text: 'VP of Engineering: [Name] - from [Company]' },
                                { text: 'Director of Customer Success: [Name] - internal promotion' },
                                { text: 'Senior Architect: [Name] - from [Company]' }
                            ] },
                        { text: 'Team Development:', subitems: [
                                { text: 'Launched quarterly hackathon (85% participation)' },
                                { text: 'Completed diversity & inclusion training' },
                                { text: 'Introduced flexible work policy' },
                                { text: 'Enhanced benefits package' }
                            ] },
                        { text: 'Recognition:', subitems: [
                                { text: '12 employees received spot bonuses' },
                                { text: '3 teams won innovation awards' },
                                { text: 'Employee of the Quarter: [Name]' }
                            ] }
                    ]
                }],
            notes: 'Strong team growth with quality hires. Low attrition indicates good retention. Investment in team development and recognition paying off.'
        },
        // Slide 10: Market Analysis
        {
            type: 'content',
            title: 'Market Analysis',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Market Trends:', subitems: [
                                { text: 'Overall market growing at 22% CAGR' },
                                { text: 'Shift toward cloud-based solutions accelerating' },
                                { text: 'AI/ML capabilities becoming table stakes' },
                                { text: 'Increased focus on data privacy and security' }
                            ] },
                        { text: 'Competitive Landscape:', subitems: [
                                { text: 'Market share: #3 position (12% share, up from 10%)' },
                                { text: 'Competitor A: Acquired by [Company], integration challenges' },
                                { text: 'Competitor B: Launched competing product, limited traction' },
                                { text: 'New entrant: [Startup] raised $50M Series B' }
                            ] },
                        { text: 'Our Position:', subitems: [
                                { text: 'Strengths: Product quality, customer support, innovation' },
                                { text: 'Opportunities: Market expansion, strategic partnerships' },
                                { text: 'Challenges: Pricing pressure, talent competition' },
                                { text: 'Differentiators: AI capabilities, integration ecosystem' }
                            ] },
                        { text: 'Strategic Implications:', subitems: [
                                { text: 'Accelerate AI/ML feature development' },
                                { text: 'Expand partner ecosystem' },
                                { text: 'Consider strategic acquisition targets' },
                                { text: 'Invest in brand awareness' }
                            ] }
                    ]
                }],
            notes: 'Growing market with strong tailwinds. Improving competitive position. Clear strategic priorities emerging from market analysis.'
        },
        // Slide 11: Next Quarter Goals
        {
            type: 'content',
            title: 'Q1 2026 Goals & Priorities',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Financial Targets:', subitems: [
                                { text: 'Revenue: $13.5M (8% growth)' },
                                { text: 'New customer acquisition: 1,800' },
                                { text: 'Customer retention: >94%' },
                                { text: 'Operating margin: 42%' }
                            ] },
                        { text: 'Product Priorities:', subitems: [
                                { text: 'Launch advanced AI analytics module' },
                                { text: 'Release mobile app v2.0 with offline capabilities' },
                                { text: 'Complete [Tool X] integration' },
                                { text: 'Beta launch of enterprise reporting suite' }
                            ] },
                        { text: 'Operational Goals:', subitems: [
                                { text: 'Achieve 99.99% uptime SLA' },
                                { text: 'Reduce support ticket resolution time by 25%' },
                                { text: 'Complete ISO 27001 surveillance audit' },
                                { text: 'Implement automated testing framework' }
                            ] },
                        { text: 'Team & Culture:', subitems: [
                                { text: 'Hire 15 additional team members' },
                                { text: 'Launch employee wellness program' },
                                { text: 'Achieve 90% employee satisfaction score' },
                                { text: 'Complete manager effectiveness training' }
                            ] }
                    ]
                }],
            notes: 'Ambitious but achievable goals for Q1. Balanced across financial, product, operational, and team dimensions. Clear priorities for execution.'
        },
        // Slide 12: Budget Allocation Chart
        {
            type: 'chart',
            title: 'Q1 2026 Budget Allocation',
            content: [{
                    type: 'chart',
                    chartType: 'pie',
                    data: {
                        labels: ['Engineering & Product', 'Sales & Marketing', 'Customer Success', 'Operations', 'G&A'],
                        datasets: [{
                                name: 'Budget Allocation',
                                values: [4200000, 2800000, 1500000, 1200000, 800000],
                                color: '#FF9900'
                            }]
                    },
                    options: {
                        showLegend: true,
                        legendPosition: 'right',
                        showDataLabels: true,
                        title: 'Total Q1 Budget: $10.5M'
                    }
                }],
            notes: 'Q1 budget of $10.5M allocated strategically. 40% to Engineering & Product for innovation. 27% to Sales & Marketing for growth. Balanced investment across all functions.'
        },
        // Slide 13: Thank You
        {
            type: 'thank-you',
            title: 'Thank You',
            subtitle: 'Questions & Discussion',
            content: [{
                    type: 'bullets',
                    items: [
                        { text: 'Contact Information:' },
                        { text: `${presenter}`, level: 1 },
                        { text: 'Email: [email@amazon.com]', level: 1 },
                        { text: 'Slack: @[username]', level: 1 },
                        { text: '' },
                        { text: 'Resources:' },
                        { text: 'Full QBR Report: [Link]', level: 1 },
                        { text: 'Detailed Metrics Dashboard: [Link]', level: 1 },
                        { text: 'Q1 Planning Documents: [Link]', level: 1 }
                    ]
                }],
            notes: 'Thank participants for their time. Open floor for questions and discussion. Provide links to detailed resources for follow-up.'
        }
    ];
    return {
        title: `${quarter} Quarterly Business Review - ${department}`,
        author: presenter,
        subject: 'Quarterly Business Review',
        company: 'Amazon',
        theme: powerpoint_types_1.AMAZON_POWERPOINT_THEME,
        slides
    };
}
//# sourceMappingURL=powerpoint-templates.js.map
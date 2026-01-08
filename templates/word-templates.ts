// FENIX Project Manager - Word Templates
// Pre-built Word document templates
// Created: January 5, 2026

import type { WordDocumentOptions } from '../models/word-types';
import { WordTemplateType } from '../models/word-types';

/**
 * Get Word template by type
 */
export function getWordTemplate(
  type: WordTemplateType,
  data?: Record<string, any>
): WordDocumentOptions {
  switch (type) {
    case 'white-paper':
      return getWhitePaperTemplate(data);
    case 'change-management':
      return getChangeManagementTemplate(data);
    case 'project-charter':
      return getProjectCharterTemplate(data);
    case 'sop':
      return getSOPTemplate(data);
    case 'meeting-minutes':
      return getMeetingMinutesTemplate(data);
    case 'executive-summary':
      return getExecutiveSummaryTemplate(data);
    default:
      throw new Error(`Unknown template type: ${type}`);
  }
}

/**
 * List all available templates
 */
export function listWordTemplates(): Array<{ id: WordTemplateType; name: string; description: string }> {
  return [
    {
      id: 'white-paper' as WordTemplateType,
      name: 'White Paper',
      description: 'Technical white paper with executive summary, problem statement, and solution overview'
    },
    {
      id: 'change-management' as WordTemplateType,
      name: 'Change Management Document',
      description: 'Change management plan with impact analysis, communication, and training plans'
    },
    {
      id: 'project-charter' as WordTemplateType,
      name: 'Project Charter',
      description: 'Project charter with objectives, scope, stakeholders, timeline, and budget'
    },
    {
      id: 'sop' as WordTemplateType,
      name: 'Standard Operating Procedure (SOP)',
      description: 'SOP document with purpose, scope, responsibilities, and procedures'
    },
    {
      id: 'meeting-minutes' as WordTemplateType,
      name: 'Meeting Minutes',
      description: 'Meeting minutes with attendees, agenda, discussion points, and action items'
    },
    {
      id: 'executive-summary' as WordTemplateType,
      name: 'Executive Summary',
      description: 'Executive summary with overview, key findings, recommendations, and next steps'
    }
  ];
}

/**
 * White Paper Template
 */
function getWhitePaperTemplate(data?: Record<string, any>): WordDocumentOptions {
  const title = data?.title || 'White Paper';
  const author = data?.author || 'Operations Team';
  const topic = data?.topic || '[Topic]';

  return {
    title,
    author,
    subject: 'Technical White Paper',
    keywords: ['white paper', 'technical', 'analysis'],
    tableOfContents: true,
    pageNumbers: true,
    sections: [
      {
        heading: 'Executive Summary',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: `This white paper examines ${topic} and provides recommendations for implementation.`
          }
        ]
      },
      {
        heading: 'Problem Statement',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Current challenges and opportunities in the domain.'
          }
        ]
      },
      {
        heading: 'Solution Overview',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Proposed solution and approach.'
          }
        ]
      },
      {
        heading: 'Implementation Plan',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Steps for implementing the proposed solution.'
          }
        ]
      },
      {
        heading: 'Conclusion',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Summary and recommendations.'
          }
        ]
      }
    ]
  };
}

/**
 * Change Management Template
 */
function getChangeManagementTemplate(data?: Record<string, any>): WordDocumentOptions {
  const title = data?.title || 'Change Management Plan';
  const changeName = data?.changeName || '[Change Name]';

  return {
    title,
    author: data?.author || 'Change Management Team',
    subject: 'Change Management',
    keywords: ['change', 'management', 'implementation'],
    tableOfContents: true,
    sections: [
      {
        heading: 'Change Overview',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: `This document outlines the change management plan for ${changeName}.`
          },
          {
            type: 'paragraph',
            text: 'Change Description: [Describe the change]'
          },
          {
            type: 'paragraph',
            text: 'Change Rationale: [Why this change is needed]'
          }
        ]
      },
      {
        heading: 'Impact Analysis',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Analysis of the impact on people, processes, and systems.'
          },
          {
            type: 'list',
            items: [
              'People Impact: [Describe impact on staff]',
              'Process Impact: [Describe impact on workflows]',
              'System Impact: [Describe impact on technology]'
            ]
          }
        ]
      },
      {
        heading: 'Communication Plan',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Strategy for communicating the change to stakeholders.'
          },
          {
            type: 'table',
            headers: ['Audience', 'Message', 'Channel', 'Timing'],
            rows: [
              ['Leadership', 'Strategic overview', 'Email', 'Week 1'],
              ['Staff', 'Detailed changes', 'Town Hall', 'Week 2'],
              ['Customers', 'Service updates', 'Newsletter', 'Week 3']
            ]
          }
        ]
      },
      {
        heading: 'Training Plan',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Training approach to support the change.'
          }
        ]
      },
      {
        heading: 'Success Metrics',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Metrics to measure change adoption and success.'
          }
        ]
      }
    ]
  };
}

/**
 * Project Charter Template
 */
function getProjectCharterTemplate(data?: Record<string, any>): WordDocumentOptions {
  const projectName = data?.projectName || '[Project Name]';

  return {
    title: `${projectName} - Project Charter`,
    author: data?.author || 'Project Team',
    subject: 'Project Charter',
    keywords: ['project', 'charter', 'planning'],
    tableOfContents: true,
    sections: [
      {
        heading: 'Project Overview',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: `Project Name: ${projectName}`
          },
          {
            type: 'paragraph',
            text: 'Project Description: [Brief description of the project]'
          },
          {
            type: 'paragraph',
            text: 'Project Sponsor: [Sponsor name]'
          }
        ]
      },
      {
        heading: 'Objectives',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Key objectives this project aims to achieve:'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Objective 1: [Description]',
              'Objective 2: [Description]',
              'Objective 3: [Description]'
            ]
          }
        ]
      },
      {
        heading: 'Scope',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'In Scope:'
          },
          {
            type: 'list',
            items: ['Item 1', 'Item 2', 'Item 3']
          },
          {
            type: 'paragraph',
            text: 'Out of Scope:'
          },
          {
            type: 'list',
            items: ['Item 1', 'Item 2', 'Item 3']
          }
        ]
      },
      {
        heading: 'Stakeholders',
        headingLevel: 1,
        content: [
          {
            type: 'table',
            headers: ['Name', 'Role', 'Responsibility'],
            rows: [
              ['[Name]', 'Project Sponsor', 'Overall accountability'],
              ['[Name]', 'Project Manager', 'Day-to-day management'],
              ['[Name]', 'Team Lead', 'Technical delivery']
            ]
          }
        ]
      },
      {
        heading: 'Timeline',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Project Start Date: [Date]'
          },
          {
            type: 'paragraph',
            text: 'Project End Date: [Date]'
          },
          {
            type: 'paragraph',
            text: 'Key Milestones:'
          },
          {
            type: 'list',
            items: [
              'Milestone 1: [Date]',
              'Milestone 2: [Date]',
              'Milestone 3: [Date]'
            ]
          }
        ]
      },
      {
        heading: 'Budget',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Total Budget: $[Amount]'
          },
          {
            type: 'table',
            headers: ['Category', 'Amount'],
            rows: [
              ['Labor', '$[Amount]'],
              ['Equipment', '$[Amount]'],
              ['Other', '$[Amount]']
            ]
          }
        ]
      }
    ]
  };
}

/**
 * SOP Template
 */
function getSOPTemplate(data?: Record<string, any>): WordDocumentOptions {
  const sopTitle = data?.title || 'Standard Operating Procedure';

  return {
    title: sopTitle,
    author: data?.author || 'Operations Team',
    subject: 'Standard Operating Procedure',
    keywords: ['sop', 'procedure', 'operations'],
    tableOfContents: true,
    sections: [
      {
        heading: 'Purpose',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'This SOP defines the standard procedure for [process name].'
          }
        ]
      },
      {
        heading: 'Scope',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'This procedure applies to [departments/roles/situations].'
          }
        ]
      },
      {
        heading: 'Responsibilities',
        headingLevel: 1,
        content: [
          {
            type: 'table',
            headers: ['Role', 'Responsibility'],
            rows: [
              ['Manager', 'Approve exceptions'],
              ['Operator', 'Execute procedure'],
              ['Quality', 'Verify compliance']
            ]
          }
        ]
      },
      {
        heading: 'Procedures',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Follow these steps to complete the procedure:'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Step 1: [Description]',
              'Step 2: [Description]',
              'Step 3: [Description]',
              'Step 4: [Description]',
              'Step 5: [Description]'
            ]
          }
        ]
      },
      {
        heading: 'Safety Considerations',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Important safety considerations:'
          },
          {
            type: 'list',
            items: [
              'Safety item 1',
              'Safety item 2',
              'Safety item 3'
            ]
          }
        ]
      },
      {
        heading: 'References',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Related documents and references:'
          },
          {
            type: 'list',
            items: [
              'Reference 1',
              'Reference 2',
              'Reference 3'
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Meeting Minutes Template
 */
function getMeetingMinutesTemplate(data?: Record<string, any>): WordDocumentOptions {
  const meetingTitle = data?.title || 'Meeting Minutes';
  const date = data?.date || new Date().toLocaleDateString();

  return {
    title: meetingTitle,
    author: data?.author || 'Meeting Organizer',
    subject: 'Meeting Minutes',
    keywords: ['meeting', 'minutes', 'notes'],
    sections: [
      {
        heading: 'Meeting Details',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: `Date: ${date}`
          },
          {
            type: 'paragraph',
            text: 'Time: [Start Time] - [End Time]'
          },
          {
            type: 'paragraph',
            text: 'Location: [Location/Virtual]'
          }
        ]
      },
      {
        heading: 'Attendees',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Present:'
          },
          {
            type: 'list',
            items: ['[Name 1]', '[Name 2]', '[Name 3]']
          },
          {
            type: 'paragraph',
            text: 'Absent:'
          },
          {
            type: 'list',
            items: ['[Name 1]', '[Name 2]']
          }
        ]
      },
      {
        heading: 'Agenda',
        headingLevel: 1,
        content: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Agenda item 1',
              'Agenda item 2',
              'Agenda item 3'
            ]
          }
        ]
      },
      {
        heading: 'Discussion Points',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Topic 1: [Discussion summary]'
          },
          {
            type: 'paragraph',
            text: 'Topic 2: [Discussion summary]'
          },
          {
            type: 'paragraph',
            text: 'Topic 3: [Discussion summary]'
          }
        ]
      },
      {
        heading: 'Decisions Made',
        headingLevel: 1,
        content: [
          {
            type: 'list',
            items: [
              'Decision 1: [Description]',
              'Decision 2: [Description]',
              'Decision 3: [Description]'
            ]
          }
        ]
      },
      {
        heading: 'Action Items',
        headingLevel: 1,
        content: [
          {
            type: 'table',
            headers: ['Action', 'Owner', 'Due Date'],
            rows: [
              ['Action 1', '[Name]', '[Date]'],
              ['Action 2', '[Name]', '[Date]'],
              ['Action 3', '[Name]', '[Date]']
            ]
          }
        ]
      },
      {
        heading: 'Next Meeting',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Date: [Next meeting date]'
          },
          {
            type: 'paragraph',
            text: 'Time: [Time]'
          },
          {
            type: 'paragraph',
            text: 'Location: [Location]'
          }
        ]
      }
    ]
  };
}

/**
 * Executive Summary Template
 */
function getExecutiveSummaryTemplate(data?: Record<string, any>): WordDocumentOptions {
  const title = data?.title || 'Executive Summary';
  const topic = data?.topic || '[Topic]';

  return {
    title,
    author: data?.author || 'Leadership Team',
    subject: 'Executive Summary',
    keywords: ['executive', 'summary', 'overview'],
    sections: [
      {
        heading: 'Overview',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: `This executive summary provides an overview of ${topic}.`
          },
          {
            type: 'paragraph',
            text: 'Purpose: [Brief purpose statement]'
          },
          {
            type: 'paragraph',
            text: 'Scope: [Brief scope statement]'
          }
        ]
      },
      {
        heading: 'Key Findings',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'The following key findings emerged from the analysis:'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Finding 1: [Description and impact]',
              'Finding 2: [Description and impact]',
              'Finding 3: [Description and impact]',
              'Finding 4: [Description and impact]'
            ]
          }
        ]
      },
      {
        heading: 'Recommendations',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Based on the findings, we recommend the following actions:'
          },
          {
            type: 'table',
            headers: ['Recommendation', 'Priority', 'Timeline'],
            rows: [
              ['Recommendation 1', 'High', 'Q1 2026'],
              ['Recommendation 2', 'Medium', 'Q2 2026'],
              ['Recommendation 3', 'Low', 'Q3 2026']
            ]
          }
        ]
      },
      {
        heading: 'Expected Outcomes',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Implementation of these recommendations will result in:'
          },
          {
            type: 'list',
            items: [
              'Outcome 1: [Description]',
              'Outcome 2: [Description]',
              'Outcome 3: [Description]'
            ]
          }
        ]
      },
      {
        heading: 'Next Steps',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Immediate next steps:'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Step 1: [Action and owner]',
              'Step 2: [Action and owner]',
              'Step 3: [Action and owner]'
            ]
          }
        ]
      },
      {
        heading: 'Conclusion',
        headingLevel: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Summary statement and call to action.'
          }
        ]
      }
    ]
  };
}


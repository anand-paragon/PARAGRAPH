import { IIntegrationConfig } from '@useparagon/core/integration';

import { default as NewWorkflow } from './workflows/newWorkflow';

/**
 * configuration for a imanage
 */
const config: IIntegrationConfig = {
  description: 'Sync files and documents with iManage',
  overviewText: `Connect to your iManage account to manage your files and documents in iManage. Increase your team’s productivity by keeping your iManage account up to date - without manual data entry.
                      
Our iManage integration enables you to:
       
• Save files and documents in iManage   
• Sync files and documents from iManage`,
  showWatermark: false,
  workflowDisplayOrder: [NewWorkflow],
};

export default config;

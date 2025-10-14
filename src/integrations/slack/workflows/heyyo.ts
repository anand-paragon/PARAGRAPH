import {
  CronStep,
  FanOutStep,
  FunctionStep,
  RequestStep,
  Workflow,
} from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  createInputs,
  InputResultMap,
  ISlackIntegration,
} from '@useparagon/integrations/slack';

import personaMeta from '../../../persona.meta';

/**
 * heyyo Workflow implementation
 */
export default class extends Workflow<
  ISlackIntegration,
  IPersona<typeof personaMeta>,
  InputResultMap
> {
  /**
   * Define workflow steps and orchestration.
   */
  define(
    integration: ISlackIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    const triggerStep = new CronStep({
      cron: '0 0 9 * * 3',
      timeZone: 'America/Los_Angeles',
    });

    const functionStep = new FunctionStep({
      autoRetry: false,
      description: 'Find start and end date',
      code: function yourFunction(parameters, libraries) {
        const end = Date.now();
        const start = end - 7 * 24 * 60 * 60 * 1000;
        return {
          start,
          end,
        };
      },
      parameters: {},
    });

    const functionStep1 = new FunctionStep({
      autoRetry: false,
      description: 'list repositories which needs to be monitored',
      code: function yourFunction(parameters, libraries) {
        return [
          'paragon',
          // "connect",
          // "paragraph",
          // "managed-sync",
          // "health-checker",
          // "inner-circle",
          // "atlas-v2-poc",
          // "on-prem",
          // "enterprise",
        ];
      },
      parameters: {},
    });

    const mapStep = new FanOutStep({
      description: 'Iterate each repository',
      iterator: functionStep1.output.result,
    });

    const requestStep = new RequestStep({
      autoRetry: false,
      continueWorkflowOnError: false,
      description: 'List pull requests',
      url: `https://api.github.com/repos/useparagon/${mapStep.output.instance}/pulls`,
      method: 'GET',
      params: {},
      headers: { Authorization: `Bearer ` },
    });

    triggerStep
      .nextStep(functionStep)
      .nextStep(functionStep1)
      .nextStep(mapStep.branch(requestStep));

    /**
     * Pass all steps used in the workflow to the `.register()`
     * function. The keys used in this function must remain stable.
     */
    return this.register({
      triggerStep,
      functionStep,
      functionStep1,
      mapStep,
      requestStep,
    });
  }

  /**
   * The name of the workflow, used in the Dashboard and Connect Portal.
   */
  name: string = 'heyyo';

  /**
   * A user-facing description of the workflow shown in the Connect Portal.
   */
  description: string = '';

  /**
   * Define workflow-level User Settings. For integration-level User
   * Settings, see ../config.ts.
   * https://docs.useparagon.com/connect-portal/workflow-user-settings
   */
  inputs = createInputs({});

  /**
   * If set to true, the workflow will appear as enabled by default once
   * a user connects their account to the integration.
   * https://docs.useparagon.com/connect-portal/displaying-workflows#default-to-enabled
   */
  defaultEnabled: boolean = false;

  /**
   * If set to true, the workflow will be hidden from all users from the
   * Connect Portal.
   * https://docs.useparagon.com/connect-portal/displaying-workflows#hide-workflow-from-portal-for-all-users
   */
  hidden: boolean = false;

  /**
   * You can restrict the visibility of this workflow to specific users
   * with Workflow Permissions.
   * https://docs.useparagon.com/connect-portal/workflow-permissions
   */
  definePermissions(
    connectUser: IPermissionContext<IPersona<typeof personaMeta>>,
  ): ConditionalInput | undefined {
    return undefined;
  }

  /**
   * This property is maintained by Paragon. Do not edit this property.
   */
  readonly id: string = '7b4483bd-7103-462e-a4ba-8d4cf7b04d5b';
}

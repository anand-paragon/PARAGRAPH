import { IEventInit } from '@useparagon/core/event';

export type EventSchema = {};

const event: IEventInit<EventSchema> = {
  /**
   *  name of event
   */
  name: 'archive-sev-channels',

  /**
   * schema of event payload
   */
  schema: {},
};

export default event;

import Automation from '../models/Automation.js';
import Notification from '../models/Notification.js';
import Badge from '../models/Badge.js';
import User from '../models/User.js';

export async function checkAndTriggerAutomations({ projectId, event, task, user }) {
  const automations = await Automation.find({ project: projectId, trigger: event });
  for (const automation of automations) {
    if (event === 'status_change' && automation.condition.status === task.status) {
      if (automation.action.type === 'assign_badge') {
        await Badge.create({ user: task.assignee, name: automation.action.badge });
      }
      if (automation.action.type === 'send_notification') {
        await Notification.create({
          user: task.assignee,
          message: automation.action.message || 'Task updated!',
        });
      }
    }
  }
}
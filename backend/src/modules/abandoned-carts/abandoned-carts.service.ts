import { abandonedCartsRepository } from "./abandoned-carts.repository";
import { emailService } from "../email/email.service";

const DEFAULT_THRESHOLD_HOURS = 24;
const MS_PER_HOUR = 60 * 60 * 1000;

export type CartGroup = {
  user_id: number;
  email: string;
  name: string;
  items: number;
  total: number;
  abandoned_at: Date;
  reminded_count: number;
  flagged: boolean;
};

function groupCartsByUser(
  rows: Awaited<ReturnType<typeof abandonedCartsRepository.findActiveCartRows>>,
  thresholdHours: number,
) {
  const byUser = new Map<number, CartGroup>();
  const now = Date.now();

  for (const row of rows) {
    const existing = byUser.get(row.user_id);
    const lineTotal = row.price * row.quantity;
    if (existing) {
      existing.items += 1;
      existing.total += lineTotal;
      if (row.created_at < existing.abandoned_at) existing.abandoned_at = row.created_at;
    } else {
      byUser.set(row.user_id, {
        user_id: row.user_id,
        email: row.email,
        name: row.name,
        items: 1,
        total: lineTotal,
        abandoned_at: row.created_at,
        reminded_count: 0,
        flagged: false,
      });
    }
  }

  for (const group of byUser.values()) {
    const ageHours = (now - group.abandoned_at.getTime()) / MS_PER_HOUR;
    group.flagged = ageHours >= thresholdHours;
  }

  return [...byUser.values()].sort((a, b) => b.abandoned_at.getTime() - a.abandoned_at.getTime());
}

export const abandonedCartsService = {
  async getSummary(thresholdHours: number = DEFAULT_THRESHOLD_HOURS) {
    const [rows, reminders] = await Promise.all([
      abandonedCartsRepository.findActiveCartRows(),
      abandonedCartsRepository.findAllReminders(),
    ]);

    const reminderMap = new Map(reminders.map((r) => [r.user_id, r]));
    const carts = groupCartsByUser(rows, thresholdHours).map((group) => ({
      ...group,
      reminded_count: reminderMap.get(group.user_id)?.remindedCount ?? 0,
    }));

    const flaggedCount = carts.filter((c) => c.flagged).length;
    const remindedTotal = reminders.length;

    let recoveredCount = 0;
    let revenueRecovered = 0;
    for (const reminder of reminders) {
      if (!reminder.lastRemindedAt) continue;
      const order = await abandonedCartsRepository.findFirstSuccessfulOrderAfter(
        reminder.user_id,
        reminder.lastRemindedAt,
      );
      if (order) {
        recoveredCount += 1;
        revenueRecovered += order.total_amount;
      }
    }

    return {
      flagged: flaggedCount,
      reminded: remindedTotal,
      recovered: recoveredCount,
      recoveredPercent: remindedTotal > 0 ? Math.round((recoveredCount / remindedTotal) * 100) : 0,
      revenueRecovered,
      carts,
    };
  },

  async processReminders(thresholdHours: number = DEFAULT_THRESHOLD_HOURS) {
    const rows = await abandonedCartsRepository.findActiveCartRows();
    const groups = groupCartsByUser(rows, thresholdHours).filter((g) => g.flagged);

    for (const group of groups) {
      await emailService.sendEmail({
        to: group.email,
        subject: "You left something in your cart",
        body: `Hi ${group.name}, you have ${group.items} item(s) worth ₦${(group.total / 100).toLocaleString()} waiting in your cart. Come back and complete your order!`,
      });
      await abandonedCartsRepository.upsertReminder(group.user_id);
    }

    return { sent: groups.length };
  },

  async removeCart(userId: number) {
    return abandonedCartsRepository.clearUserCart(userId);
  },
};

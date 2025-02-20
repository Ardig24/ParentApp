import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { parseISO, addHours, addDays } from 'date-fns';
import { Medication } from '../lib/store';

export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medications', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C3AED',
    });
  }

  return true;
}

export async function scheduleMedicationReminders(medication: Medication) {
  if (!medication.reminders || !medication.active) {
    return;
  }

  const startDate = parseISO(medication.startDate);
  const endDate = medication.endDate ? parseISO(medication.endDate) : null;
  const now = new Date();

  // Parse frequency to determine reminder schedule
  const frequency = medication.frequency.toLowerCase();
  let interval: number;
  let intervalUnit: 'hours' | 'days';

  if (frequency.includes('hour')) {
    const hours = parseInt(frequency.match(/\d+/)?.[0] || '8');
    interval = hours;
    intervalUnit = 'hours';
  } else if (frequency.includes('daily') || frequency.includes('day')) {
    const times = frequency.includes('twice') ? 2 : 1;
    interval = 24 / times;
    intervalUnit = 'hours';
  } else {
    // Default to once daily
    interval = 24;
    intervalUnit = 'hours';
  }

  // Schedule notifications
  const triggers = [];
  let currentDate = startDate > now ? startDate : now;

  while (!endDate || currentDate <= endDate) {
    const trigger = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medication Reminder',
        body: `Time to take ${medication.name} (${medication.dosage})`,
        data: { medicationId: medication.id },
      },
      trigger: {
        channelId: Platform.OS === 'android' ? 'medications' : undefined,
        date: currentDate,
      },
    });
    
    triggers.push(trigger);
    currentDate = intervalUnit === 'hours' 
      ? addHours(currentDate, interval)
      : addDays(currentDate, interval);

    // Limit to 64 notifications (Expo limit)
    if (triggers.length >= 64) break;
  }

  return triggers;
}

export async function cancelMedicationReminders(medicationId: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.medicationId === medicationId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

export async function handleMedicationUpdate(medication: Medication) {
  // Cancel existing reminders
  await cancelMedicationReminders(medication.id);
  
  // Schedule new reminders if needed
  if (medication.reminders && medication.active) {
    await scheduleMedicationReminders(medication);
  }
}

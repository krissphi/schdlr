import { useEffect, useRef } from 'react';
import { useContentStore } from '../store/useContentStore';
import { useConfigStore } from '../store/useConfigStore';
import { useToastStore } from '../store/useToastStore';
import { sendLocalNotification } from '../utils/notifications';
import { getTodayString } from '../utils/dateUtils';

export const useUploadReminder = () => {
  const contentItems = useContentStore((state) => state.contentItems);
  const platforms = useConfigStore((state) => state.platforms);
  const showToast = useToastStore((state) => state.showToast);

  // Keep track of alerted items today in a ref
  const alertedItemsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkUpcomingUploads = () => {
      const todayStr = getTodayString(0);
      const now = new Date();
      const currentMinutesToday = now.getHours() * 60 + now.getMinutes();

      contentItems.forEach((item) => {
        if (item.targetDate !== todayStr || item.stage === 'published' || !item.uploadTime) {
          return;
        }

        const alertKey = `${todayStr}-${item.id}`;
        if (alertedItemsRef.current.has(alertKey)) {
          return;
        }

        const [h, m] = item.uploadTime.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return;

        const targetMinutes = h * 60 + m;
        const diffMinutes = targetMinutes - currentMinutesToday;

        // Trigger notification when within 15 minutes (between 0 and 15 minutes before target)
        if (diffMinutes <= 15 && diffMinutes >= 0) {
          alertedItemsRef.current.add(alertKey);

          const platform = platforms.find((p) => p.id === item.platformId);
          const platformName = platform?.name || 'Social Media';

          const title = `Scheduled Upload in ${diffMinutes === 0 ? 'Less than a minute' : `${diffMinutes}m`}!`;
          const body = `"${item.title}" is scheduled to go live on ${platformName} at ${item.uploadTime}.`;

          // 1. Desktop / Mobile system notification (PWA / browser)
          sendLocalNotification(title, body);

          // 2. In-app toast banner
          showToast({
            message: `⏰ Upload in ${diffMinutes}m: "${item.title}" (${platformName})`,
            type: 'warning',
            durationMs: 8000,
          });
        }
      });
    };

    // Run check immediately on mount, then every 30 seconds
    checkUpcomingUploads();
    const interval = setInterval(checkUpcomingUploads, 30000);

    return () => clearInterval(interval);
  }, [contentItems, platforms, showToast]);
};

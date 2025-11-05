"use client";

import { useState } from "react";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import type { ActivityLog } from "@/types/dashboard.types";

export default function ActivityPage() {
  const [activityLogs] = useState([] as ActivityLog[]);

  return <ActivityLogsPanel logs={activityLogs} />;
}


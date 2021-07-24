export interface Session {
  id: string;
  name: string;
  endTime?: Date;
  scheduledStartTime: Date;
  startTime?: Date;
}

export interface LaunchedEvent {
  id: string;
}

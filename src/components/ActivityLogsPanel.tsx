import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Activity, Upload, Edit, Trash2, UserPlus, Download } from 'lucide-react';
import { ActivityLog } from '../App';

interface ActivityLogsPanelProps {
  logs: ActivityLog[];
}

const getActionIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case 'data import':
      return Upload;
    case 'contact added':
    case 'company added':
    case 'user added':
      return UserPlus;
    case 'contact updated':
    case 'company updated':
    case 'user updated':
      return Edit;
    case 'contact deleted':
    case 'company deleted':
    case 'user deleted':
      return Trash2;
    case 'data export':
      return Download;
    default:
      return Activity;
  }
};

const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'data import':
      return 'bg-green-100 text-green-800';
    case 'contact added':
    case 'company added':
    case 'user added':
      return 'bg-blue-100 text-blue-800';
    case 'contact updated':
    case 'company updated':
    case 'user updated':
      return 'bg-yellow-100 text-yellow-800';
    case 'contact deleted':
    case 'company deleted':
    case 'user deleted':
      return 'bg-red-100 text-red-800';
    case 'data export':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ActivityLogsPanel({ logs }: ActivityLogsPanelProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
      
      {/* Decorative Background Orbs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon Badge with Gradient */}
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              
              {/* Icon Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 blur-lg" />
            </div>
            
            <div>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Activity Logs
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">Real-time system activity tracking</p>
            </div>
          </div>
          
          {/* Activity Count Badge */}
          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {logs.length} {logs.length === 1 ? 'Activity' : 'Activities'}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => {
                const Icon = getActionIcon(log.action);
                const colorClass = getActionColor(log.action);
                
                return (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <Badge variant="outline" className="text-xs">
                          {log.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>by {log.user}</span>
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activity logs yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </Card>
  );
}
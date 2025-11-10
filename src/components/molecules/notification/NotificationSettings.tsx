'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/atoms/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/ui/dialog';
import { Switch } from '@/components/atoms/ui/switch';
import { Label } from '@/components/atoms/ui/label';
import { Separator } from '@/components/atoms/ui/separator';

interface NotificationSettingsProps {
  children?: React.ReactNode;
}

export default function NotificationSettings({ children }: NotificationSettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [autoMarkRead, setAutoMarkRead] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const soundSetting = localStorage.getItem('notificationSoundEnabled');
    const desktopSetting = localStorage.getItem('desktopNotificationsEnabled');
    const autoMarkSetting = localStorage.getItem('autoMarkReadEnabled');
    
    if (soundSetting !== null) {
      setSoundEnabled(soundSetting === 'true');
    }
    if (desktopSetting !== null) {
      setDesktopNotifications(desktopSetting === 'true');
    }
    if (autoMarkSetting !== null) {
      setAutoMarkRead(autoMarkSetting === 'true');
    }
  }, []);

  // Save settings to localStorage
  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
    localStorage.setItem('adminSoundEnabled', enabled.toString()); // For admin too
  };

  const handleDesktopToggle = async (enabled: boolean) => {
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setDesktopNotifications(false);
        return;
      }
    }
    setDesktopNotifications(enabled);
    localStorage.setItem('desktopNotificationsEnabled', enabled.toString());
  };

  const handleAutoMarkToggle = (enabled: boolean) => {
    setAutoMarkRead(enabled);
    localStorage.setItem('autoMarkReadEnabled', enabled.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt thông báo
          </DialogTitle>
          <DialogDescription>
            Tùy chỉnh cách bạn nhận thông báo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sound notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound" className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-gray-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
                Âm thanh thông báo
              </Label>
              <p className="text-sm text-gray-500">
                Phát âm thanh khi có thông báo mới
              </p>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          <Separator />

          {/* Desktop notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="desktop" className="flex items-center gap-2">
                {desktopNotifications ? (
                  <Bell className="h-4 w-4 text-gray-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
                Thông báo desktop
              </Label>
              <p className="text-sm text-gray-500">
                Hiển thị thông báo trên màn hình desktop
              </p>
              {!('Notification' in window) && (
                <p className="text-xs text-red-500 mt-1">
                  Trình duyệt không hỗ trợ thông báo desktop
                </p>
              )}
            </div>
            <Switch
              id="desktop"
              checked={desktopNotifications}
              onCheckedChange={handleDesktopToggle}
              disabled={!('Notification' in window)}
            />
          </div>

          <Separator />

          {/* Auto mark as read */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-mark" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                Tự động đánh dấu đã đọc
              </Label>
              <p className="text-sm text-gray-500">
                Tự động đánh dấu thông báo là đã đọc sau khi xem
              </p>
            </div>
            <Switch
              id="auto-mark"
              checked={autoMarkRead}
              onCheckedChange={handleAutoMarkToggle}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


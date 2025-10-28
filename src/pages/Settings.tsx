import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
} from 'lucide-react';

interface AccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
}

interface SecuritySettings {
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  failedLoginAttempts: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  portfolioAlerts: boolean;
  priceAlerts: boolean;
  dailyNewsDigest: boolean;
  weeklyReport: boolean;
}

interface GeneralSettings {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'account' | 'security' | 'notifications' | 'general'
  >('account');
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    dateOfBirth: '1990-01-15',
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    lastPasswordChange: '2024-08-15',
    failedLoginAttempts: 0,
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    portfolioAlerts: true,
    priceAlerts: false,
    dailyNewsDigest: true,
    weeklyReport: false,
  });
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    theme: 'light',
    currency: 'USD',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);

  const sections = [
    {
      id: 'account' as const,
      label: 'Account Settings',
      icon: User,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'security' as const,
      label: 'Security',
      icon: Lock,
      color: 'from-red-500 to-rose-600',
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'general' as const,
      label: 'General',
      icon: SettingsIcon,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  const handleAccountChange = (key: keyof AccountSettings, value: string) => {
    setAccountSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: string | boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGeneralChange = (key: keyof GeneralSettings, value: string | boolean) => {
    setGeneralSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingAccount(false);
    alert('Account settings saved!');
  };

  const handleSaveSecurity = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setSavingSecurity(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingSecurity(false);
    setSecuritySettings((prev) => ({
      ...prev,
      newPassword: '',
      confirmPassword: '',
    }));
    alert('Security settings updated!');
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingNotifications(false);
    alert('Notification preferences saved!');
  };

  const handleSaveGeneral = async () => {
    setSavingGeneral(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingGeneral(false);
    alert('General settings saved!');
  };

  const handleResetGeneral = () => {
    setGeneralSettings({
      theme: 'light',
      currency: 'USD',
      language: 'English',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
          <div className="relative p-3">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
            <div className="relative flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <SettingsIcon className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-[10px] text-gray-500">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Layout - Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm h-fit">
            <div className="p-2 space-y-1.5">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${section.color} shadow-lg text-white`
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{section.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              {/* Account Settings */}
              {activeSection === 'account' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
                    <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        First Name
                      </label>
                      <Input
                        value={accountSettings.firstName}
                        onChange={(e) => handleAccountChange('firstName', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Last Name
                      </label>
                      <Input
                        value={accountSettings.lastName}
                        onChange={(e) => handleAccountChange('lastName', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => handleAccountChange('email', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Phone
                      </label>
                      <Input
                        value={accountSettings.phone}
                        onChange={(e) => handleAccountChange('phone', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Country
                      </label>
                      <Input
                        value={accountSettings.country}
                        onChange={(e) => handleAccountChange('country', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={accountSettings.dateOfBirth}
                        onChange={(e) => handleAccountChange('dateOfBirth', e.target.value)}
                        className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-gray-200">
                    <Button
                      onClick={handleSaveAccount}
                      disabled={savingAccount}
                      className="h-9 px-4 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingAccount ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Security</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage your password and security options
                    </p>
                  </div>

                  {/* Change Password */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-3 border border-red-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.newPassword}
                            onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                            className="h-9 text-sm border-red-200 focus:ring-red-500 pr-9"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={securitySettings.confirmPassword}
                            onChange={(e) =>
                              handleSecurityChange('confirmPassword', e.target.value)
                            }
                            className="h-9 text-sm border-red-200 focus:ring-red-500 pr-9"
                          />
                          <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleSaveSecurity}
                        disabled={savingSecurity}
                        className="h-9 px-4 text-sm bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {savingSecurity ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        Last Password Change
                      </span>
                      <span className="text-xs text-gray-600">
                        {securitySettings.lastPasswordChange}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        Failed Login Attempts
                      </span>
                      <span className="text-xs text-gray-600">
                        {securitySettings.failedLoginAttempts}
                      </span>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleSecurityChange(
                            'twoFactorEnabled',
                            !securitySettings.twoFactorEnabled,
                          )
                        }
                        className={`w-12 h-6 rounded-full transition-all ${
                          securitySettings.twoFactorEnabled
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gray-300'
                        } relative`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                            securitySettings.twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose how you want to receive updates
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'emailNotifications' as const,
                        label: 'Email Notifications',
                        desc: 'Receive email updates about your account',
                      },
                      {
                        key: 'pushNotifications' as const,
                        label: 'Push Notifications',
                        desc: 'Get push notifications on your devices',
                      },
                      {
                        key: 'portfolioAlerts' as const,
                        label: 'Portfolio Alerts',
                        desc: 'Be notified of significant portfolio changes',
                      },
                      {
                        key: 'priceAlerts' as const,
                        label: 'Price Alerts',
                        desc: 'Get alerts when watched stocks hit price targets',
                      },
                      {
                        key: 'dailyNewsDigest' as const,
                        label: 'Daily News Digest',
                        desc: 'Receive daily market news summary',
                      },
                      {
                        key: 'weeklyReport' as const,
                        label: 'Weekly Report',
                        desc: 'Get a weekly summary of your portfolio',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 transition-all"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(item.key)}
                          className={`w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                            notificationSettings[item.key]
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                              : 'bg-gray-300'
                          } relative`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                              notificationSettings[item.key] ? 'right-0.5' : 'left-0.5'
                            }`}
                          ></div>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-gray-200">
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={savingNotifications}
                      className="h-9 px-4 text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingNotifications ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeSection === 'general' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">General</h2>
                    <p className="text-xs text-gray-500 mt-1">Customize your app experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Theme
                      </label>
                      <Select
                        value={generalSettings.theme}
                        onValueChange={(value) =>
                          handleGeneralChange('theme', value as 'light' | 'dark' | 'auto')
                        }
                      >
                        <SelectTrigger className="h-9 text-sm border-green-200 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Currency
                      </label>
                      <Select
                        value={generalSettings.currency}
                        onValueChange={(value) => handleGeneralChange('currency', value)}
                      >
                        <SelectTrigger className="h-9 text-sm border-green-200 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Language
                      </label>
                      <Select
                        value={generalSettings.language}
                        onValueChange={(value) => handleGeneralChange('language', value)}
                      >
                        <SelectTrigger className="h-9 text-sm border-green-200 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Date Format
                      </label>
                      <Select
                        value={generalSettings.dateFormat}
                        onValueChange={(value) => handleGeneralChange('dateFormat', value)}
                      >
                        <SelectTrigger className="h-9 text-sm border-green-200 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                        Time Format
                      </label>
                      <Select
                        value={generalSettings.timeFormat}
                        onValueChange={(value) =>
                          handleGeneralChange('timeFormat', value as '12h' | '24h')
                        }
                      >
                        <SelectTrigger className="h-9 text-sm border-green-200 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-Hour</SelectItem>
                          <SelectItem value="24h">24-Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-gray-200">
                    <Button
                      onClick={handleSaveGeneral}
                      disabled={savingGeneral}
                      className="h-9 px-4 text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingGeneral ? 'Saving...' : 'Save Settings'}
                    </Button>
                    <Button
                      onClick={handleResetGeneral}
                      variant="outline"
                      className="h-9 px-4 text-sm border-gray-300 hover:bg-gray-100 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

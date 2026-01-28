import React, { useState } from 'react';
import { 
  User, Shield, CreditCard, Users, Key, Settings, 
  Camera, Check, X, AlertTriangle, LogOut, Download, 
  Copy, Trash2, Plus, Bell, Moon, Globe, Eye, EyeOff, Lock, Github, Puzzle, ExternalLink
} from 'lucide-react';
import { Button } from './Button';

type SettingTab = 'profile' | 'security' | 'billing' | 'team' | 'api' | 'integrations' | 'preferences';

export const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);

  // Mock User Data
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    username: '@alex_creates',
    email: 'alex.rivera@example.com',
    country: 'United States',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    plan: 'Team Pro',
    credits: 850,
    maxCredits: 1200
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, name: 'Marcus Johnson', email: 'marcus@example.com', role: 'Content Manager', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, name: 'David Smith', email: 'david@example.com', role: 'Billing Admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ]);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production App', key: 'bk_live_59283...9283', created: 'Oct 24, 2023', lastUsed: '2 mins ago' },
    { id: 'key_2', name: 'Dev Environment', key: 'bk_test_19283...1029', created: 'Nov 12, 2023', lastUsed: '5 days ago' },
  ]);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGitHubConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsGitHubConnected(!isGitHubConnected);
        setIsLoading(false);
    }, 800);
  };

  const tabs: { id: SettingTab; label: string; icon: React.FC<any> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Subscription', icon: CreditCard },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-800 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-gray-400 text-sm">Manage your personal details, security, and preferences.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-gray-800 bg-[#0f172a]/30 hidden md:block overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-lg shadow-yellow-500/5'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 mt-8 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Current Plan</p>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{user.plan}</span>
                <span className="text-xs bg-yellow-500 text-gray-900 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(user.credits / user.maxCredits) * 100}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-500">{user.credits} / {user.maxCredits} credits remaining</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* PROFILE SECTION */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="text-yellow-500" size={24} /> Public Profile
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-yellow-500 transition-colors">
                          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={20} className="text-white" />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">JPG or PNG. Max 1MB.</span>
                    </div>

                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue={user.name}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <input 
                          type="text" 
                          defaultValue={user.username}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={user.email}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                        <input 
                          type="text" 
                          defaultValue={user.country}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-700">
                    <Button variant="ghost">Discard</Button>
                    <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="text-blue-500" size={24} /> Login & Security
                  </h3>

                  <div className="space-y-6 max-w-2xl">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-300">Change Password</label>
                      <input 
                        type="password" 
                        placeholder="Current Password"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="password" 
                          placeholder="New Password"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input 
                          type="password" 
                          placeholder="Confirm New Password"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <Button variant="secondary" className="w-fit">Update Password</Button>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
                          <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all"></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <h4 className="font-bold text-white mb-4">Active Sessions</h4>
                      <div className="bg-[#0f172a] rounded-lg p-4 flex items-center justify-between border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            <Settings size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Chrome on macOS</p>
                            <p className="text-xs text-green-400">Current Session • 192.168.1.1</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <LogOut size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BILLING SECTION */}
            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Plan Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <CreditCard size={100} />
                      </div>
                      <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-2">Current Plan</p>
                      <h3 className="text-3xl font-bold text-white mb-1">Team Pro</h3>
                      <p className="text-gray-400 text-sm mb-6">24,999 FCFA / month</p>
                      <Button className="w-full">Upgrade Plan</Button>
                   </div>

                   <div className="md:col-span-2 bg-[#1e293b] border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-white">Credit Usage</h4>
                        <span className="text-sm text-gray-400">Resets in 12 days</span>
                      </div>
                      <div className="mb-2 flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{user.credits}</span>
                        <span className="text-gray-500 mb-1">/ {user.maxCredits} used</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full relative" style={{ width: `${(user.credits / user.maxCredits) * 100}%` }}>
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex-1 bg-[#0f172a] p-3 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">Bambee Basic Gens</p>
                            <p className="font-bold text-white">432</p>
                         </div>
                         <div className="flex-1 bg-[#0f172a] p-3 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">Pro Gens (4K)</p>
                            <p className="font-bold text-white">128</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Billing History */}
                <div className="bg-[#1e293b] border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">Billing History</h3>
                    <Button variant="ghost" className="text-xs"><Download size={14} className="mr-2" /> Download All</Button>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#0f172a] text-gray-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Invoice</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Amount</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                       {[1, 2, 3].map((i) => (
                         <tr key={i} className="hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 font-medium text-white">INV-2024-00{i}</td>
                           <td className="px-6 py-4 text-gray-400">Oct {24 - i}, 2024</td>
                           <td className="px-6 py-4 text-white">24,999 FCFA</td>
                           <td className="px-6 py-4"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold">PAID</span></td>
                           <td className="px-6 py-4 text-right text-yellow-500 hover:text-white cursor-pointer">Download</td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INTEGRATIONS SECTION */}
            {activeTab === 'integrations' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <h3 className="text-xl font-bold text-white">Workflow Integrations</h3>
                  <p className="text-sm text-gray-400">Connect Bambee to your favorite developer tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GitHub Integration */}
                    <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10">
                                <Github size={28} />
                            </div>
                            {isGitHubConnected ? (
                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                    <Check size={14} /> Connected
                                </span>
                            ) : (
                                <span className="text-gray-500 text-xs font-medium">Not connected</span>
                            )}
                        </div>
                        <h4 className="font-bold text-white mb-2">GitHub</h4>
                        <p className="text-sm text-gray-400 mb-6 flex-1 leading-relaxed">
                            Sync generated images to your repositories, use GitHub SSO, and automate assets via Actions.
                        </p>
                        <Button 
                            variant={isGitHubConnected ? 'secondary' : 'primary'} 
                            onClick={handleGitHubConnect}
                            isLoading={isLoading}
                        >
                            {isGitHubConnected ? 'Disconnect GitHub' : 'Connect GitHub'}
                        </Button>
                    </div>

                    {/* Figma (Mock) */}
                    <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 flex flex-col opacity-60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 border border-pink-500/20">
                                <Puzzle size={28} />
                            </div>
                            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Coming Soon</span>
                        </div>
                        <h4 className="font-bold text-white mb-2">Figma Plugin</h4>
                        <p className="text-sm text-gray-400 mb-6 flex-1 leading-relaxed">
                            Generate and edit images directly inside Figma. Sync components effortlessly.
                        </p>
                        <Button variant="secondary" disabled className="border-gray-700 bg-gray-800/50">Notify Me</Button>
                    </div>
                </div>

                {isGitHubConnected && (
                    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6 animate-in slide-in-from-bottom-2 duration-300">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Settings size={16} className="text-gray-500"/> GitHub Preferences
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#1e293b]/50 rounded-lg border border-gray-700">
                                <div>
                                    <p className="text-sm font-bold text-gray-200">Auto-Sync to Repo</p>
                                    <p className="text-xs text-gray-500">Automatically push all 4K generations to a specific repo.</p>
                                </div>
                                <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#1e293b]/50 rounded-lg border border-gray-700">
                                <div>
                                    <p className="text-sm font-bold text-gray-200">Default Repository</p>
                                    <p className="text-xs text-blue-400 flex items-center gap-1 cursor-pointer hover:underline">alex-creates/bambee-assets <ExternalLink size={10}/></p>
                                </div>
                                <Button variant="ghost" className="text-xs h-8">Change</Button>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            )}

            {/* PREFERENCES SECTION */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings className="text-gray-400" size={24} /> App Preferences
                    </h3>

                    {/* Appearance */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg text-white"><Moon size={20} /></div>
                          <div>
                             <p className="font-bold text-white">Theme</p>
                             <p className="text-sm text-gray-400">Customize the interface appearance.</p>
                          </div>
                       </div>
                       <select className="bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-yellow-500">
                          <option>Dark Mode</option>
                          <option>Light Mode</option>
                          <option>System Default</option>
                       </select>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg text-white"><Globe size={20} /></div>
                          <div>
                             <p className="font-bold text-white">Language</p>
                             <p className="text-sm text-gray-400">Select your preferred language.</p>
                          </div>
                       </div>
                       <select className="bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-yellow-500">
                          <option>English (US)</option>
                          <option>French (FR)</option>
                          <option>Spanish (ES)</option>
                          <option>German (DE)</option>
                       </select>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg text-white"><Bell size={20} /></div>
                          <div>
                             <p className="font-bold text-white">Email Notifications</p>
                             <p className="text-sm text-gray-400">Receive updates about your credits and new features.</p>
                          </div>
                       </div>
                       <div className="w-12 h-6 bg-yellow-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
                       </div>
                    </div>

                     {/* Privacy */}
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg text-white"><Eye size={20} /></div>
                          <div>
                             <p className="font-bold text-white">Public Inspiration</p>
                             <p className="text-sm text-gray-400">Allow your generations to appear in the Inspiration Gallery.</p>
                          </div>
                       </div>
                       <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all"></div>
                       </div>
                    </div>

                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
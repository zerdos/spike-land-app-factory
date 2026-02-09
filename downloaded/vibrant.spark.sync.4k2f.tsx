import React, { useState } from "react";
import { Home, Settings, User, Save, Edit2, X } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  
  // User profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Software developer passionate about creating amazing apps",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    autoSave: true,
    language: "en"
  });
  
  // Dashboard stats
  const stats = [
    { label: "Total Projects", value: "24", color: "bg-blue-500" },
    { label: "Active Tasks", value: "12", color: "bg-green-500" },
    { label: "Completed", value: "156", color: "bg-purple-500" },
    { label: "Team Members", value: "8", color: "bg-orange-500" }
  ];

  const handleProfileSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleProfileCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSettingToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const NavButton = ({ page, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        currentPage === page
          ? "bg-indigo-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const DashboardPage = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <div className="text-white font-bold text-xl">{stat.value}</div>
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "Completed task: Update homepage design", time: "2 hours ago" },
            { action: "New team member joined: Sarah Wilson", time: "5 hours ago" },
            { action: "Project milestone reached: v2.0 released", time: "1 day ago" },
            { action: "Meeting scheduled: Sprint planning", time: "2 days ago" }
          ].map((activity, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-700">{activity.action}</span>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
        <p className="text-indigo-100">You have 3 tasks due today and 2 upcoming meetings.</p>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium text-gray-800">Enable Notifications</div>
              <div className="text-sm text-gray-500">Receive push notifications for updates</div>
            </div>
            <button
              onClick={() => handleSettingToggle("notifications")}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.notifications ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                settings.notifications ? "translate-x-7" : "translate-x-1"
              } mt-1`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium text-gray-800">Dark Mode</div>
              <div className="text-sm text-gray-500">Toggle dark mode theme</div>
            </div>
            <button
              onClick={() => handleSettingToggle("darkMode")}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.darkMode ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                settings.darkMode ? "translate-x-7" : "translate-x-1"
              } mt-1`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium text-gray-800">Email Updates</div>
              <div className="text-sm text-gray-500">Receive weekly email summaries</div>
            </div>
            <button
              onClick={() => handleSettingToggle("emailUpdates")}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.emailUpdates ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                settings.emailUpdates ? "translate-x-7" : "translate-x-1"
              } mt-1`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-800">Auto-save</div>
              <div className="text-sm text-gray-500">Automatically save changes</div>
            </div>
            <button
              onClick={() => handleSettingToggle("autoSave")}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.autoSave ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                settings.autoSave ? "translate-x-7" : "translate-x-1"
              } mt-1`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Language & Region</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleProfileSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={handleProfileCancel}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.location}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.bio}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-indigo-600">MyApp</div>
            <div className="flex gap-2">
              <NavButton page="dashboard" icon={Home} label="Dashboard" />
              <NavButton page="profile" icon={User} label="Profile" />
              <NavButton page="settings" icon={Settings} label="Settings" />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {currentPage === "dashboard" && <DashboardPage />}
        {currentPage === "settings" && <SettingsPage />}
        {currentPage === "profile" && <ProfilePage />}
      </div>
    </div>
  );
}
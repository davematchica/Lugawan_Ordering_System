import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Settings = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  const handleExportData = () => {
    // TODO: Implement data export functionality
    alert('Export functionality will be implemented soon!');
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL orders, expenses, and menu items. This action cannot be undone. Are you absolutely sure?')) {
      if (window.confirm('Final confirmation: Delete all data permanently?')) {
        // TODO: Implement clear data functionality
        alert('Clear data functionality will be implemented soon!');
      }
    }
  };

  return (
    <>
      <Header title="Settings" showBack />
      <PageContainer>
        <div className="p-4 space-y-6 pb-24">
          {/* Business Info */}
          <div>
            <h3 className="font-bold text-neutral-800 mb-3">Business Information</h3>
            <Card>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-neutral-800">Business Name</div>
                    <div className="text-sm text-neutral-600">Matchica Family Lugawan</div>
                  </div>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="font-semibold text-neutral-800">Location</div>
                  <div className="text-sm text-neutral-600">Gigaquit</div>
                </div>
              </div>
            </Card>
          </div>

          {/* App Settings */}
          <div>
            <h3 className="font-bold text-neutral-800 mb-3">App Settings</h3>
            <div className="space-y-3">
              <Card hover className="cursor-pointer" onClick={() => alert('Theme settings coming soon!')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎨</div>
                    <div>
                      <div className="font-semibold text-neutral-800">Theme</div>
                      <div className="text-sm text-neutral-600">Customize app appearance</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>

              <Card hover className="cursor-pointer" onClick={() => alert('Currency settings coming soon!')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💱</div>
                    <div>
                      <div className="font-semibold text-neutral-800">Currency</div>
                      <div className="text-sm text-neutral-600">Philippine Peso (₱)</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="font-bold text-neutral-800 mb-3">Data Management</h3>
            <div className="space-y-3">
              <Card hover className="cursor-pointer" onClick={() => setShowDataModal(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💾</div>
                    <div>
                      <div className="font-semibold text-neutral-800">Backup & Restore</div>
                      <div className="text-sm text-neutral-600">Export or import your data</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>

              <Card className="border-2 border-red-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <div className="font-semibold text-red-800">Danger Zone</div>
                    <div className="text-sm text-red-600 mb-3">
                      Irreversible actions - use with caution
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearData}
                      className="border-red-300 text-red-600 hover:bg-red-100"
                    >
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-bold text-neutral-800 mb-3">Support & Information</h3>
            <div className="space-y-3">
              <Card hover className="cursor-pointer" onClick={() => setShowAboutModal(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">ℹ️</div>
                    <div>
                      <div className="font-semibold text-neutral-800">About</div>
                      <div className="text-sm text-neutral-600">App version and info</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>

              <Card hover className="cursor-pointer" onClick={() => alert('Help documentation coming soon!')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">❓</div>
                    <div>
                      <div className="font-semibold text-neutral-800">Help & Guide</div>
                      <div className="text-sm text-neutral-600">How to use the app</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-neutral-500 pt-6">
            <p>Made with ❤️ for Matchica Family</p>
            <p className="mt-1">Gigaquit Lugawan Order Management System</p>
          </div>
        </div>
      </PageContainer>

      {/* About Modal */}
      <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} size="sm">
        <div className="py-4 text-center">
          <div className="text-6xl mb-4">🍜</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Lugawan Order Manager
          </h2>
          <p className="text-neutral-600 mb-4">Version 1.0.0</p>
          
          <div className="bg-cream-100 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-bold text-neutral-800 mb-2">Features:</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Order Management</li>
              <li>✓ Expense Tracking</li>
              <li>✓ Menu Management</li>
              <li>✓ Sales Reports</li>
              <li>✓ Profit/Loss Analysis</li>
              <li>✓ Offline-First PWA</li>
            </ul>
          </div>

          <div className="text-sm text-neutral-600 mb-6">
            <p className="font-semibold mb-1">Developed for:</p>
            <p>Matchica Family Lugawan</p>
            <p>Gigaquit, Surigao del Norte</p>
          </div>

          <Button variant="primary" fullWidth onClick={() => setShowAboutModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Data Management Modal */}
      <Modal isOpen={showDataModal} onClose={() => setShowDataModal(false)} size="sm">
        <div className="py-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Backup & Restore
          </h2>

          <div className="space-y-4">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💾</div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-800 mb-2">Export Data</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Download all your orders, expenses, and menu data as a backup file.
                  </p>
                  <Button variant="primary" size="sm" onClick={handleExportData}>
                    Download Backup
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-green-50 border-2 border-green-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📥</div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-800 mb-2">Import Data</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Restore your data from a previously exported backup file.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => alert('Import functionality coming soon!')}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            </Card>

            <div className="pt-4">
              <Button variant="outline" fullWidth onClick={() => setShowDataModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Settings;
'use client';

import { useState } from 'react';
import { FiSave, FiImage } from 'react-icons/fi';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState({
    siteName: 'モダンECサイト',
    siteDescription: '最新のファッションと電子機器を提供するオンラインストア',
    contactEmail: 'contact@example.com',
    phoneNumber: '03-1234-5678',
    address: '東京都渋谷区〇〇町1-2-3',
    facebookUrl: 'https://facebook.com/modernec',
    twitterUrl: 'https://twitter.com/modernec',
    instagramUrl: 'https://instagram.com/modernec',
    shippingFee: 550,
    freeShippingThreshold: 10000,
    taxRate: 10,
    currencyCode: 'JPY',
    logoUrl: 'https://placehold.co/200x60/png',
    faviconUrl: 'https://placehold.co/32x32/png',
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: Number(value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 実際の実装では、APIを呼び出して設定を保存します
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('設定が正常に保存されました');
      
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">サイト設定</h1>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">基本設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">サイト名</label>
              <input
                type="text"
                name="siteName"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.siteName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">サイト説明</label>
              <textarea
                name="siteDescription"
                rows="3"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.siteDescription}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">連絡先メールアドレス</label>
              <input
                type="email"
                name="contactEmail"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">電話番号</label>
              <input
                type="text"
                name="phoneNumber"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">住所</label>
              <input
                type="text"
                name="address"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.address}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">SNS設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebookUrl"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.facebookUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">Twitter URL</label>
              <input
                type="url"
                name="twitterUrl"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.twitterUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagramUrl"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.instagramUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">ショップ設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">送料（円）</label>
              <input
                type="number"
                name="shippingFee"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.shippingFee}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">送料無料の閾値（円）</label>
              <input
                type="number"
                name="freeShippingThreshold"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.freeShippingThreshold}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">税率（%）</label>
              <input
                type="number"
                name="taxRate"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.taxRate}
                onChange={handleNumberChange}
                min="0"
                max="100"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">通貨コード</label>
              <select
                name="currencyCode"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.currencyCode}
                onChange={handleChange}
              >
                <option value="JPY">JPY (日本円)</option>
                <option value="USD">USD (米ドル)</option>
                <option value="EUR">EUR (ユーロ)</option>
                <option value="GBP">GBP (英ポンド)</option>
              </select>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">メディア設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">ロゴ</label>
              <div className="flex items-center space-x-4 mb-2">
                <img src={settings.logoUrl} alt="サイトロゴ" className="h-10 border border-border rounded" />
                <button type="button" className="flex items-center text-primary hover:text-primary/80">
                  <FiImage className="mr-1" />
                  <span>変更</span>
                </button>
              </div>
              <input
                type="url"
                name="logoUrl"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.logoUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1">ファビコン</label>
              <div className="flex items-center space-x-4 mb-2">
                <img src={settings.faviconUrl} alt="ファビコン" className="h-8 w-8 border border-border rounded" />
                <button type="button" className="flex items-center text-primary hover:text-primary/80">
                  <FiImage className="mr-1" />
                  <span>変更</span>
                </button>
              </div>
              <input
                type="url"
                name="faviconUrl"
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={settings.faviconUrl}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>保存中...</span>
              </>
            ) : (
              <>
                <FiSave />
                <span>設定を保存</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
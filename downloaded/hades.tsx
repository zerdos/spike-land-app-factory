import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  ExternalLink, 
  Shield, 
  GitBranch, 
  BookOpen, 
  Calculator, 
  Search, 
  Server,
  Info,
  CheckCircle2
} from 'lucide-react';

/**
 * Hades Developer Hub
 * A helper tool for VMO2 Next-Gen Developers
 * 
 * Sources used:
 * - Environment URLs
 * - Access Requirements
 * - Git Strategy
 * - RGU/Bundle Logic
 * - Glossary
 */

// --- TYPES ---

type Tab = 'mission-control' | 'knowledge-base';

interface LinkGroup {
  env: string;
  xsus: string;
  ils: string;
  cancel: string;
}

interface Term {
  term: string;
  meaning: string;
}

// --- DATA CONSTANTS ---

const ENV_LINKS: LinkGroup[] = [
  {
    env: 'Production',
    xsus: 'https://www.virginmedia.com/support/help/change-my-package/my-current-package',
    ils: 'https://www.virginmedia.com/support/help/change-my-package/manage-my-package',
    cancel: 'https://www.virginmedia.com/help/leaving'
  },
  {
    env: 'Staging (Flag: 1)',
    xsus: 'https://whoosh.stage.virginmediao2.co.uk/support/help/change-my-package/my-current-package/offers',
    ils: 'https://whoosh.stage.virginmediao2.co.uk/support/help/change-my-package/manage-my-package',
    cancel: 'https://stg.red.vmo2digital.co.uk/help/leaving'
  },
  {
    env: 'Integration (Flag: 0)',
    xsus: 'https://whoosh.int.virginmediao2.co.uk/support/help/change-my-package/my-current-package/offers',
    ils: 'https://whoosh.int.virginmediao2.co.uk/support/help/change-my-package/manage-my-package',
    cancel: 'https://int.red.vmo2digital.co.uk/help/leaving'
  }
];

const ACCESS_CHECKLIST = [
  { id: 1, system: 'OKTA', note: 'SSO for all systems. Provided at setup.' },
  { id: 2, system: 'GitLab', note: 'Request via DFE Confluence.' },
  { id: 3, system: 'Jira/Confluence', note: 'Request via DFE Confluence.' },
  { id: 4, system: 'Storyblok', note: 'Contact FE Lead (@Elizabeth Maduka).' },
  { id: 5, system: 'Test Accounts', note: 'Contact @Adam or @Beth Mash.' },
];

const GLOSSARY_TERMS: Term[] = [
  { term: 'BPO', meaning: 'Best Price Online - promotional pricing.' },
  { term: 'CIS', meaning: 'Contract Information Sheet - legally required document.' },
  { term: 'CSS', meaning: 'Contract Summary Sheet - legally required document.' },
  { term: 'EDF', meaning: 'Early Disconnection Fee - penalty for early termination.' },
  { term: 'EOC', meaning: 'End of Contract - customer within 150 days of end date.' },
  { term: 'IC', meaning: 'In Contract - customer within fixed term (more than 150 days left).' },
  { term: 'ICOMS', meaning: 'Internal billing/product management system.' },
  { term: 'RGU', meaning: 'Revenue Generating Unit - determines bundle type.' },
  { term: 'Solus', meaning: 'Single-service bundle (1 RGU).' },
  { term: 'Dual', meaning: 'Two-service bundle (2 RGUs).' },
  { term: 'Triple', meaning: 'Three+ service bundle (3+ RGUs).' },
  { term: 'XSUS', meaning: 'Cross-Sell/Up-Sell application (Store).' },
  { term: 'Volt', meaning: 'Virgin Media fiber + O2 Sim bundle branding.' },
];

const SERVICE_CODES = [
  { code: 'D', service: 'Broadband (Data)', examples: 'Gig1, M500, M125' },
  { code: 'C', service: 'TV (Cable)', examples: 'Mixit TV, Mega TV' },
  { code: 'T', service: 'Telephone', examples: 'Weekend Calls' },
  { code: 'W', service: 'WiFi Booster', examples: 'WiFi Max, Plume Pods' },
  { code: 'S', service: 'O2 SIM', examples: 'O2 SIM Plans' },
];

// --- COMPONENTS ---

const Card = ({ children, title, icon: Icon, className = '' }: { children: React.ReactNode, title: string, icon?: any, className?: string }) => (
  <div className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
      {Icon && <Icon className="w-5 h-5 text-red-600" />}
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
    </div>
    {children}
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
    {children}
  </span>
);

export default function HadesDevHub() {
  const [activeTab, setActiveTab] = useState<Tab>('mission-control');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleService = (code: string) => {
    setSelectedServices(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const rguCount = selectedServices.length;
  const bundleType = rguCount === 1 ? 'Solus' : rguCount === 2 ? 'Dual' : rguCount >= 3 ? 'Triple' : 'None';

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(t => 
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-red-900 selection:text-white">
      {/* Header */}
      <header className="bg-black border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">V</div>
            <h1 className="text-xl font-bold text-white tracking-tight">Hades <span className="text-zinc-500 font-normal">Dev Hub</span></h1>
          </div>
          <nav className="flex gap-1">
            <button 
              onClick={() => setActiveTab('mission-control')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mission-control' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Mission Control
            </button>
            <button 
              onClick={() => setActiveTab('knowledge-base')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'knowledge-base' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Domain Knowledge
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- VIEW 1: MISSION CONTROL --- */}
        {activeTab === 'mission-control' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <Card title="Environment Launchpad" icon={Server}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-md">Environment</th>
                        <th className="px-4 py-3">XSUS (Store)</th>
                        <th className="px-4 py-3">ILS (Manage)</th>
                        <th className="px-4 py-3 rounded-r-md">Cancellation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {ENV_LINKS.map((link) => (
                        <tr key={link.env} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{link.env}</td>
                          <td className="px-4 py-3"><a href={link.xsus} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400 flex items-center gap-1">Launch <ExternalLink size={12}/></a></td>
                          <td className="px-4 py-3"><a href={link.ils} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400 flex items-center gap-1">Launch <ExternalLink size={12}/></a></td>
                          <td className="px-4 py-3"><a href={link.cancel} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400 flex items-center gap-1">Launch <ExternalLink size={12}/></a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded text-xs text-blue-200 flex gap-2">
                  <Info size={16} />
                  <span>Remember: Feature flags are index-based. 0=INT, 1=Stage, 2=Prod.</span>
                </div>
              </Card>

              <Card title="Git Strategy and Deployment" icon={GitBranch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Branch Naming</h4>
                    <code className="block bg-black p-2 rounded border border-zinc-800 text-green-400 text-sm mb-2">
                      feature/TICKET-ID-description
                    </code>
                    <p className="text-xs text-zinc-500">Also: hotfix/...</p>
                    
                    <h4 className="text-sm font-semibold text-white mt-4 mb-2">Commit Format</h4>
                    <code className="block bg-black p-2 rounded border border-zinc-800 text-green-400 text-sm mb-2">
                      yarn run cz
                    </code>
                    <p className="text-xs text-zinc-500">Follows Conventional Commits.</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white">Deployment Pipeline</h4>
                    <ol className="relative border-l border-zinc-800 ml-2 space-y-4">
                      <li className="ml-4">
                        <div className="absolute w-2 h-2 bg-red-600 rounded-full -left-1.5 mt-1.5"></div>
                        <h5 className="text-sm text-white">Merge to Main</h5>
                        <p className="text-xs">PR Approved and Merged</p>
                      </li>
                      <li className="ml-4">
                        <div className="absolute w-2 h-2 bg-zinc-700 rounded-full -left-1.5 mt-1.5"></div>
                        <h5 className="text-sm text-white">Deploy to Stage</h5>
                        <p className="text-xs">Manual trigger in GitLab Pipeline</p>
                      </li>
                      <li className="ml-4">
                        <div className="absolute w-2 h-2 bg-zinc-700 rounded-full -left-1.5 mt-1.5"></div>
                        <h5 className="text-sm text-white">Create Release Tag</h5>
                        <p className="text-xs">After QA. Semantic ver (e.g., 1.0.0)</p>
                      </li>
                    </ol>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Access Checklist" icon={Shield}>
                <div className="space-y-3">
                  {ACCESS_CHECKLIST.map(item => (
                    <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-zinc-800/50 rounded cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-600 focus:ring-offset-zinc-900" />
                      <div>
                        <span className="block text-sm font-medium text-white group-hover:text-red-400 transition-colors">{item.system}</span>
                        <span className="block text-xs text-zinc-500">{item.note}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <a href="#" className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 justify-center">
                     Go to DFE Confluence for Requests <ExternalLink size={10}/>
                  </a>
                </div>
              </Card>

              <Card title="Quick Commands" icon={Terminal}>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Start Dev Server</span>
                      <span className="text-zinc-600">yarn start</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Run Tests</span>
                      <span className="text-zinc-600">yarn test</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Lint Check</span>
                      <span className="text-zinc-600">yarn lint</span>
                    </div>
                 </div>
              </Card>
            </div>
          </div>
        )}

        {/* --- VIEW 2: DOMAIN KNOWLEDGE --- */}
        {activeTab === 'knowledge-base' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-1 space-y-6">
                <Card title="RGU Calculator" icon={Calculator}>
                  <p className="text-xs text-zinc-400 mb-4">Select Core products to calculate Bundle Type.</p>
                  
                  <div className="space-y-2 mb-6">
                    {SERVICE_CODES.map((s) => (
                      <label key={s.code} className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer ${selectedServices.includes(s.code) ? 'bg-red-900/10 border-red-900/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                         <div className="flex items-center gap-3">
                           <input 
                              type="checkbox" 
                              checked={selectedServices.includes(s.code)}
                              onChange={() => toggleService(s.code)}
                              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-600 focus:ring-offset-zinc-900"
                           />
                           <div>
                             <span className={`block text-sm font-bold ${selectedServices.includes(s.code) ? 'text-red-400' : 'text-zinc-300'}`}>
                               [{s.code}] {s.service}
                             </span>
                             <span className="text-xs text-zinc-600">{s.examples}</span>
                           </div>
                         </div>
                      </label>
                    ))}
                  </div>

                  <div className="bg-black rounded p-4 text-center border border-zinc-800">
                    <span className="block text-xs text-zinc-500 uppercase tracking-widest mb-1">Bundle Type</span>
                    <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                      {bundleType}
                      {bundleType !== 'None' && <CheckCircle2 className="text-green-500 w-5 h-5"/>}
                    </div>
                    <span className="text-xs text-zinc-600">RGU Count: {rguCount}</span>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card title="Jargon Buster and Codes" icon={BookOpen}>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search terms (e.g. EDF, Volt, OOC)..." 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 placeholder:text-zinc-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredTerms.length > 0 ? (
                      filteredTerms.map((t) => (
                        <div key={t.term} className="p-3 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-red-500">{t.term}</span>
                          </div>
                          <p className="text-sm text-zinc-400 leading-snug">{t.meaning}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-zinc-600">
                        No terms found.
                      </div>
                    )}
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                     <h4 className="text-sm font-semibold text-white mb-2">Contract Status Codes</h4>
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span className="text-zinc-400">IC (In Contract)</span> <Badge>{'>'} 150 days</Badge></li>
                        <li className="flex justify-between"><span className="text-zinc-400">EOC (End of Contract)</span> <Badge>{'<='} 150 days</Badge></li>
                        <li className="flex justify-between"><span className="text-zinc-400">OOC (Out of Contract)</span> <Badge>Rolling</Badge></li>
                     </ul>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                     <h4 className="text-sm font-semibold text-white mb-2">Testing Notes</h4>
                     <p className="text-xs text-zinc-400 mb-2">
                       Test accounts are managed by <strong>Adam</strong> or <strong>Beth Mash</strong>. 
                       Check Hades Squad Test Accounts in Confluence.
                     </p>
                  </div>
                </div>

              </div>
           </div>
        )}
      </main>
    </div>
  );
}
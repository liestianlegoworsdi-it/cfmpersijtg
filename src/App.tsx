import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet,
  AlertCircle,
  RefreshCw,
  FileText,
  CreditCard,
  User,
  ChevronDown,
  Calendar,
  Filter,
  Lock,
  LogOut,
  FileDown,
  ChevronUp,
  Search,
  X,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import persiLogoImg from './persi-jateng.png';
import persiBackgroundImg from './persi-background.png';
import { cn } from './lib/utils';
import { Transaction } from './types';

const monthNames = [
  'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 
  'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
];

interface COAGroup {
  id: string;
  title: string;
  items: string[];
}

const COA_STRUCTURE: { income: COAGroup[]; expense: COAGroup[] } = {
  income: [
    {
      id: 'I',
      title: 'PENERIMAAN RUTIN',
      items: ['Pendaftaran anggota baru', 'Iuran anggota', 'Iuran anggota (Tunggakan )']
    },
    {
      id: 'II',
      title: 'PENERIMAAN PROGRAM',
      items: ['SHU Seminar dan Expo PERSI Daerah Jawa Tengah', 'SHU Workhsop', 'SHU Seminar/Webinar']
    },
    {
      id: 'III',
      title: 'PENERIMAAN LAIN',
      items: ['Penerimaan bunga bank', 'Penerimaan bunga deposito', 'Cashback Seminar Nasional PERSI Pusat', 'Penerimaan Lain', 'Pindah Buku Masuk']
    }
  ],
  expense: [
    {
      id: 'IV',
      title: 'PENGELUARAN RUTIN',
      items: [
        'Biaya operasional kantor (ATK, administrasi, kebersihan )',
        'Biaya gaji pegawai',
        'Biaya listrik, air, Ipal, zoom dan internet',
        'Biaya sewa kantor dan perbaikan interior',
        'Iuran PERSI Pusat'
      ]
    },
    {
      id: 'IV',
      title: 'PENGELUARAN PROGRAM PENDAMPINGAN RS',
      items: [
        'Penugasan menghadiri undangan stake holder PERSI',
        'Penugasan kredensialing dan pendampingan BPJS',
        'Penugasan pendampingan RS dengan Dinas Kesehatan (perpanjangan izin operasional, kenaikan kelas dll)',
        'Penugasan pendampingan RS (kasus RS)'
      ]
    },
    {
      id: 'V',
      title: 'PENGELUARAN RAPAT',
      items: [
        'Rapat PERSI Daerah dan Komisariat',
        'Rapat PERSI Pusat dan HOSPEX PERSI Pusat',
        'Pengeluaran Pelantikan Pengurus PERSI & MAKERSI',
        'Pengeluaran Musyawarah Wilayah PERSI Jateng th 2025'
      ]
    },
    {
      id: 'VI',
      title: 'PENGELUARAN PROGRAM DIKLAT',
      items: ['Seminar, Workshop, Webinar Gratis']
    },
    {
      id: 'VII',
      title: 'PENGELUARAN LAIN',
      items: ['Biaya Sosial', 'Pajak rekening dan deposito', 'Pindah Buku Keluar']
    }
  ]
};

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx_PeNPW4Wu8VpIBW2teDJhfiFUXGuNN0fLL8g7j419hZSbrlOMAPyeFBo5pwfrt1DNTw/exec';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password.toLowerCase() === '123') {
      onLogin();
    } else {
      setError('Username atau Password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end p-8 md:pr-24 font-sans relative overflow-hidden bg-stone-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={persiBackgroundImg} 
          alt="PERSI Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Compact Square Login Box */}
      <div className="relative z-10 w-full max-w-[360px] bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 p-2 shadow-lg flex items-center justify-center border border-stone-100">
            <PersiLogo className="w-full h-full" />
          </div>
          <h2 className="text-[#133838] font-black tracking-[0.2em] text-sm uppercase">User Login</h2>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Cashflow Management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-stone-400 group-focus-within:text-[#D36125] transition-colors" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-stone-100/50 border border-stone-200 text-[#133838] placeholder-stone-400 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D36125] focus:bg-white transition-all text-xs font-bold"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-stone-400 group-focus-within:text-[#D36125] transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-stone-100/50 border border-stone-200 text-[#133838] placeholder-stone-400 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D36125] focus:bg-white transition-all text-xs font-bold"
              required
            />
          </div>

          {error && <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-wider">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#133838] text-white py-3 rounded-xl font-black hover:bg-[#1a4d4d] transition-all shadow-lg active:scale-[0.98] uppercase tracking-[0.2em] text-xs mt-2"
          >
            Login
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
            &copy;CFM {new Date().getFullYear()} - SMDQ
          </p>
        </div>
      </div>
    </div>
  );
};

const PersiLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <img src={persiLogoImg} alt="PERSI Jateng" className={className} referrerPolicy="no-referrer" />
);

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'aktivitas-keuangan' | 'arus-kas' | 'transaksi-bank' | 'transaksi-kas' | 'transaksi-deposito'>('dashboard');
  const [aktivitasSubTab, setAktivitasSubTab] = useState<'tahunan' | 'detail'>('tahunan');
  const [selectedArusKasMonth, setSelectedArusKasMonth] = useState<number>(11);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [arusKasDetail, setArusKasDetail] = useState<{
    title: string;
    transactions: Transaction[];
  } | null>(null);
  const [highlightedTx, setHighlightedTx] = useState<Transaction | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const mainScroll = mainRef.current?.scrollTop || 0;
      const windowScroll = window.scrollY || 0;
      setShowScrollTop(mainScroll > 300 || windowScroll > 300);
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoggedIn, activeTab]);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    setLoadingProgress(0);
    setError(null);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        const increment = Math.floor(Math.random() * 10) + 5;
        return Math.min(prev + increment, 90);
      });
    }, 200);

    try {
      const proxyUrl = `/api/proxy/apps-script?url=${encodeURIComponent(APPS_SCRIPT_URL)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data)) {
        throw new Error('Data format is not an array. Please check your Apps Script.');
      }

      interface RawTransaction {
        date: string;
        description: string;
        amount: number | string;
        bank: string;
        category: string;
        type: 'Income' | 'Expense';
      }

      const formattedData: Transaction[] = (data as RawTransaction[])
        .filter((item) => {
          // Skip items with no date or invalid date
          if (!item.date) return false;
          const d = new Date(item.date);
          return !isNaN(d.getTime());
        })
        .map((item) => {
          // Robust amount parsing for Indonesian format (e.g., "2.500.000")
          let amount = 0;
          if (typeof item.amount === 'number') {
            amount = item.amount;
          } else if (typeof item.amount === 'string') {
            const cleaned = item.amount.replace(/\./g, '').replace(/,/g, '.');
            amount = parseFloat(cleaned) || 0;
          }

          return {
            date: new Date(item.date).toISOString(),
            description: item.description || '',
            category: item.category || 'Uncategorized',
            type: item.type === 'Income' ? 'Income' : 'Expense',
            amount: amount,
            bank: item.bank || 'Unknown'
          };
        });

      setTransactions(formattedData);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      
      // Complete progress
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data');
      console.error('Fetch error:', err);
      setLoading(false);
    } finally {
      clearInterval(progressInterval);
    }
  };


  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedDetailMonth, setSelectedDetailMonth] = useState<number>(11);
  const [arusKasSubTab, setArusKasSubTab] = useState<'bulanan' | 'tahunan'>('bulanan');
  const selectedYear = 2025;

  const handleNavigateToTransaksi = useCallback((targetTx?: Transaction) => {
    if (!arusKasDetail || (arusKasDetail.transactions.length === 0 && !targetTx)) return;

    const txs = targetTx ? [targetTx] : arusKasDetail.transactions;
    const firstTx = txs[0];
    const txMonth = new Date(firstTx.date).getMonth();
    
    // Set filters
    if (targetTx) {
      setSelectedMonth(txMonth);
    } else {
      // Check if all transactions are in the same month
      const allSameMonth = arusKasDetail.transactions.every(t => new Date(t.date).getMonth() === txMonth);
      if (arusKasSubTab === 'bulanan' && allSameMonth) {
        setSelectedMonth(txMonth);
      } else {
        setSelectedMonth('all');
      }
    }

    // Determine tab based on bank
    const isAllKas = txs.every(t => t.bank === 'KAS');
    const isAllDeposito = txs.every(t => t.bank === 'DEPO BJT');

    if (isAllKas) {
      setActiveTab('transaksi-kas');
    } else if (isAllDeposito) {
      setActiveTab('transaksi-deposito');
    } else {
      setActiveTab('transaksi-bank');
      // If they are mostly from one bank, we could set selectedBank, 
      // but 'All' is safer if mixed.
      const firstBank = firstTx.bank;
      const allSameBank = txs.every(t => t.bank === firstBank);
      if (allSameBank && firstBank !== 'KAS' && firstBank !== 'DEPO BJT') {
        setSelectedBank(firstBank);
      } else {
        setSelectedBank('All');
      }
    }

    // Close modal
    setArusKasDetail(null);
    
    if (targetTx) {
      setHighlightedTx(targetTx);
      // Clear highlight after 10 seconds
      setTimeout(() => setHighlightedTx(null), 10000);
    } else {
      // Only scroll to top if we are NOT targeting a specific transaction
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [arusKasDetail, arusKasSubTab]);

  // Effect to scroll highlighted transaction into view
  useEffect(() => {
    if (highlightedTx) {
      // Use a small timeout to ensure the table has rendered with the new filters/tab
      const timer = setTimeout(() => {
        const highlightedRow = document.querySelector('[data-highlighted="true"]');
        if (highlightedRow) {
          highlightedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightedTx, activeTab, selectedMonth, selectedBank]);

  const isHighlighted = (t: Transaction) => {
    if (!highlightedTx) return false;
    return t.date === highlightedTx.date && 
           t.description === highlightedTx.description && 
           t.amount === highlightedTx.amount && 
           t.bank === highlightedTx.bank;
  };

  const handleExportPDF = useCallback(() => {
    const table = document.querySelector('table');
    if (!table) return;

    const doc = new jsPDF({
      orientation: activeTab === 'aktivitas-keuangan' && aktivitasSubTab === 'tahunan' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // --- KOP HEADER ---
    const logoX = 4;
    const logoY = 5;
    const logoSize = 25;
    
    try {
      doc.addImage(persiLogoImg, 'PNG', logoX, logoY, logoSize, logoSize);
    } catch (e) {
      console.error('Error adding logo image:', e);
    }

    // Text Header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PERHIMPUNAN RUMAH SAKIT SELURUH INDONESIA', 35, 15);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(12);
    doc.text('DAERAH JAWA TENGAH', 35, 21);

    // Divider
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(4, 32, doc.internal.pageSize.width - 4, 32);
    // --- END KOP HEADER ---

    const title = activeTab === 'aktivitas-keuangan' ? 'LAPORAN AKTIVITAS KEUANGAN' : 'LAPORAN ARUS KAS';
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 4, 39);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let subtitle = '';
    if (activeTab === 'arus-kas') {
      subtitle = arusKasSubTab === 'bulanan' ? `BULAN : ${monthNames[selectedArusKasMonth].toUpperCase()}` : `TAHUN ${selectedYear}`;
    } else if (activeTab === 'aktivitas-keuangan') {
      if (aktivitasSubTab === 'bulanan') {
        subtitle = `BULAN : ${monthNames[selectedMonth === 'all' ? 0 : selectedMonth].toUpperCase()}`;
      } else if (aktivitasSubTab === 'detail') {
        subtitle = `BULAN : ${monthNames[selectedDetailMonth].toUpperCase()}`;
      } else {
        subtitle = `TAHUN ${selectedYear}`;
      }
    }
    doc.text(subtitle, 4, 44);

    doc.setFontSize(8);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 4, 49);

    autoTable(doc, {
      html: table,
      startY: 54,
      theme: 'grid',
      margin: { left: 4, right: 4 },
      styles: { 
        fontSize: activeTab === 'arus-kas' ? 9 : (aktivitasSubTab === 'tahunan' ? 6 : 7), 
        cellPadding: activeTab === 'arus-kas' ? 2.4 : 1.5,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        valign: 'middle'
      },
      headStyles: { 
        fillColor: [0, 0, 0], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: activeTab === 'arus-kas' ? {
        0: { cellWidth: 150 }, 
        1: { halign: 'right' }
      } : (aktivitasSubTab === 'tahunan' ? {
        0: { halign: 'center', cellWidth: 8 },
        1: { cellWidth: 20 }, // Reduced Uraian width by another 20%
      } : {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 18 } // Reduced Uraian width by another 20%
      }),
      didParseCell: (data) => {
        const rawText = data.cell.text.join(' ');
        const text = rawText.toUpperCase();
        const isTotalRow = text.includes('TOTAL') || 
                          text.includes('SALDO AKHIR') || 
                          text.includes('KAS & SETARA KAS') ||
                          text.includes('SALDO AWAL') ||
                          text.includes('ARUS KAS NETO') ||
                          text.includes('KENAIKAN/PENURUNAN BERSIH');
        
        const isSubHeader = rawText.trim().endsWith(':');

        if (isTotalRow || isSubHeader) {
          if (isTotalRow) {
            data.cell.styles.fillColor = [220, 220, 220];
          }
          data.cell.styles.fontStyle = 'bold';
        }

        // Ensure headers are centered and black background
        if (data.section === 'head') {
          data.cell.styles.halign = 'center';
          data.cell.styles.fillColor = [0, 0, 0];
          data.cell.styles.textColor = [255, 255, 255];
        }

        // Right align numeric columns
        if (data.column.index >= (activeTab === 'arus-kas' ? 1 : 2)) {
          data.cell.styles.halign = 'right';
        }
      },
      margin: { top: 25, bottom: 15 }
    });

    doc.save(`Laporan_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  }, [activeTab, aktivitasSubTab, selectedMonth, selectedDetailMonth, selectedArusKasMonth, arusKasSubTab, selectedYear]);

  const banks = useMemo(() => {
    let filtered = transactions.filter(t => t.bank !== 'DEPO BJT');
    if (activeTab === 'transaksi-bank') {
      filtered = filtered.filter(t => t.bank !== 'KAS');
    }
    const uniqueBanks = Array.from(new Set(filtered.map(t => t.bank)));
    return ['All', ...uniqueBanks.sort()];
  }, [transactions, activeTab]);

  const filteredTransactions = useMemo(() => {
    if (selectedBank === 'All') {
      return transactions;
    }
    return transactions.filter(t => t.bank === selectedBank);
  }, [transactions, selectedBank]);

  const isTransfer = useCallback((t: Transaction) => {
    const cat = t.category.toLowerCase();
    const desc = t.description.toLowerCase();
    return cat.includes('pindah buku') || 
           desc.includes('pindah buku') ||
           cat.includes('deposito') ||
           desc.includes('deposito') ||
           t.bank === 'DEPO BJT';
  }, []);

  const isSaldoAwal = useCallback((t: Transaction) => {
    const cat = (t.category || '').toUpperCase().replace(/\s+/g, '');
    const desc = (t.description || '').toUpperCase().replace(/\s+/g, '');
    return cat.includes('SALDOAWAL') || 
           desc.includes('SALDOAWAL') || 
           cat.includes('400');
  }, []);

  type TableTransaction = Transaction & { runningBalance: number; isVirtual?: boolean };

  const calculateTableData = useCallback((txs: Transaction[], month: number | 'all') => {
    const banksInFiltered = Array.from(new Set(txs.map(t => t.bank)));
    let result: TableTransaction[] = [];

    banksInFiltered.forEach(bankName => {
      const bankTxs = txs.filter(t => t.bank === bankName);
      const sortedBankTxs = [...bankTxs].sort((a, b) => {
        const aIsSA = isSaldoAwal(a);
        const bIsSA = isSaldoAwal(b);
        if (aIsSA && !bIsSA) return -1;
        if (!aIsSA && bIsSA) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      let currentBalance = 0;
      const txsWithBalance = sortedBankTxs.map(t => {
        if (t.type === 'Income') currentBalance += t.amount;
        else currentBalance -= t.amount;
        return { ...t, runningBalance: currentBalance };
      });

      if (month === 'all') {
        result = [...result, ...txsWithBalance];
      } else {
        const currentMonthTxs = txsWithBalance.filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === month && td.getFullYear() === selectedYear;
        });
        const prevMonthTxs = txsWithBalance.filter(t => {
          const td = new Date(t.date);
          return td.getFullYear() < selectedYear || (td.getFullYear() === selectedYear && td.getMonth() < month);
        });
        const startingBalance = prevMonthTxs.length > 0 ? prevMonthTxs[prevMonthTxs.length - 1].runningBalance : 0;

        if (month === 0) {
          result = [...result, ...currentMonthTxs];
        } else {
          const prevMonthName = monthNames[month - 1];
          const virtualSaldoAwal: TableTransaction = {
            date: new Date(selectedYear, month, 1).toISOString(),
            description: `SALDO AWAL (PINDAHAN SALDO ${prevMonthName})`,
            category: '400 - SALDO AWAL',
            type: 'Income' as const,
            amount: startingBalance,
            bank: bankName,
            runningBalance: startingBalance,
            isVirtual: true
          };
          result = [...result, virtualSaldoAwal, ...currentMonthTxs];
        }
      }
    });

    return result.sort((a, b) => {
      const bankCompare = a.bank.localeCompare(b.bank);
      if (bankCompare !== 0) return bankCompare;
      const aIsSA = isSaldoAwal(a) || a.isVirtual;
      const bIsSA = isSaldoAwal(b) || b.isVirtual;
      if (aIsSA && !bIsSA) return -1;
      if (!aIsSA && bIsSA) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [isSaldoAwal, selectedYear]);

  const transactionsForTable = useMemo(() => {
    const bankTxs = filteredTransactions.filter(t => t.bank !== 'KAS' && t.bank !== 'DEPO BJT');
    return calculateTableData(bankTxs, selectedMonth);
  }, [filteredTransactions, selectedMonth, calculateTableData]);

  const kasTransactionsForTable = useMemo(() => {
    const kasTxs = transactions.filter(t => t.bank === 'KAS');
    return calculateTableData(kasTxs, selectedMonth);
  }, [transactions, selectedMonth, calculateTableData]);

  const depositoTransactionsForTable = useMemo(() => {
    const depoTxs = transactions.filter(t => t.bank === 'DEPO BJT');
    return calculateTableData(depoTxs, selectedMonth);
  }, [transactions, selectedMonth, calculateTableData]);

  const reportData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const getGroupedData = (type: 'Income' | 'Expense', structure: COAGroup[]) => {
      const normalize = (str: string) => str.toLowerCase().trim()
        .replace(/^[\d.]+\s*/, '')
        .replace(/lain-lain/g, 'lain')
        .trim();

      const groups = structure.map(group => {
        const items = group.items.map((itemName: string) => {
          const normalizedTarget = normalize(itemName);
          
          const monthlyValues = months.map(m => {
            return filteredTransactions
              .filter(t => {
                const normalizedCat = normalize(t.category);
                const normalizedDesc = t.description.toLowerCase();
                
                // Enhanced matching for Pindah Buku and other categories
                let isMatch = normalizedCat === normalizedTarget;
                
                if (!isMatch) {
                  if (normalizedTarget === 'pindah buku masuk') {
                    isMatch = t.type === 'Income' && (
                      t.category.includes('500') || 
                      normalizedCat.includes('pindah buku') || 
                      normalizedDesc.includes('pindah buku masuk') ||
                      normalizedDesc.includes('pindah buku dari') ||
                      (normalizedDesc.includes('pindah buku') && !normalizedDesc.includes('keluar'))
                    );
                  } else if (normalizedTarget === 'pindah buku keluar') {
                    isMatch = t.type === 'Expense' && (
                      t.category.includes('600') || 
                      normalizedCat.includes('pindah buku') || 
                      normalizedDesc.includes('pindah buku keluar') ||
                      normalizedDesc.includes('pindah buku ke') ||
                      (normalizedDesc.includes('pindah buku') && !normalizedDesc.includes('masuk'))
                    );
                  } else if (normalizedTarget === 'penerimaan bunga bank' || normalizedTarget === 'penerimaan bunga deposito') {
                    isMatch = t.type === 'Income' && (normalizedCat.includes('bunga') || normalizedDesc.includes('bunga'));
                  } else if (normalizedTarget === 'pajak rekening dan deposito') {
                    isMatch = t.type === 'Expense' && (normalizedCat.includes('pajak') || normalizedDesc.includes('pajak'));
                  }
                }
                
                const d = new Date(t.date);
                const monthMatch = d.getMonth() + 1 === m;
                const yearMatch = d.getFullYear() === selectedYear;
                
                return t.type === type && isMatch && monthMatch && yearMatch;
              })
              .reduce((sum, t) => sum + t.amount, 0);
          });
          const total = monthlyValues.reduce((sum, val) => sum + val, 0);
          return { name: itemName, monthlyValues, total };
        });

        const monthlyTotals = months.map(m => {
          return items.reduce((sum: number, item) => sum + item.monthlyValues[m-1], 0);
        });
        const total = monthlyTotals.reduce((sum, val) => sum + val, 0);

        return {
          id: group.id,
          title: group.title,
          items,
          monthlyTotals,
          total
        };
      });

      return groups;
    };

    const incomeGroups = getGroupedData('Income', COA_STRUCTURE.income);
    const expenseGroups = getGroupedData('Expense', COA_STRUCTURE.expense);

    const incomeMonthlyTotals = months.map(m => {
      return incomeGroups.reduce((sum, group) => sum + group.monthlyTotals[m-1], 0);
    });
    const incomeGrandTotal = incomeMonthlyTotals.reduce((sum, val) => sum + val, 0);

    const expenseMonthlyTotals = months.map(m => {
      return expenseGroups.reduce((sum, group) => sum + group.monthlyTotals[m-1], 0);
    });
    const expenseGrandTotal = expenseMonthlyTotals.reduce((sum, val) => sum + val, 0);

    const surplusMonthly = months.map((_, i) => incomeMonthlyTotals[i] - expenseMonthlyTotals[i]);
    const surplusGrandTotal = incomeGrandTotal - expenseGrandTotal;

    // Saldo Awal calculation - MUST use filteredTransactions to be consistent with surplus
    const monthlySAInjections = months.map((_, i) => {
      const monthIndex = i;
      return filteredTransactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === selectedYear && d.getMonth() === monthIndex && isSaldoAwal(t);
        })
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const saldoAwalMonthly = months.map((_, i) => {
      const monthIndex = i;
      const prevBalance = filteredTransactions
        .filter(t => {
          const d = new Date(t.date);
          const tYear = d.getFullYear();
          const tMonth = d.getMonth();
          return tYear < selectedYear || (tYear === selectedYear && tMonth < monthIndex);
        })
        .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
        
      return prevBalance + monthlySAInjections[i];
    });
    
    // For the total column, Saldo Awal should be the initial balance of the year (January's Saldo Awal)
    const saldoAwalTotal = saldoAwalMonthly[0];

    // Calculate Kas & Setara Kas directly from filteredTransactions to ensure it matches the true balance
    // even if some transactions are not perfectly categorized in the COA
    const kasSetaraKasMonthly = months.map((_, i) => {
      const monthIndex = i;
      return filteredTransactions
        .filter(t => {
          const d = new Date(t.date);
          const tYear = d.getFullYear();
          const tMonth = d.getMonth();
          return tYear < selectedYear || (tYear === selectedYear && tMonth <= monthIndex);
        })
        .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
    });
    
    // The grand total of Kas & Setara Kas is the ending balance of the last month (December)
    const kasSetaraKasTotal = kasSetaraKasMonthly[11];

    return {
      incomeGroups,
      expenseGroups,
      incomeMonthlyTotals,
      incomeGrandTotal,
      expenseMonthlyTotals,
      expenseGrandTotal,
      surplusMonthly,
      surplusGrandTotal,
      saldoAwalMonthly,
      saldoAwalTotal,
      kasSetaraKasMonthly,
      kasSetaraKasTotal
    };
  }, [filteredTransactions, isSaldoAwal, selectedYear]);

  const arusKasData = useMemo(() => {
    const normalize = (str: string) => str.toLowerCase().trim()
      .replace(/^[\d.]+\s*/, '')
      .replace(/lain-lain/g, 'lain')
      .trim();

    const allCashTxs = transactions;

    const calculateForTransactions = (txs: Transaction[], monthIndex: number | null) => {
      // Operating Receipts (Exclude transfers and interest)
      const receiptsRutin = txs
        .filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && COA_STRUCTURE.income[0].items.some(item => normalize(item) === normalize(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const receiptsProgram = txs
        .filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && COA_STRUCTURE.income[1].items.some(item => normalize(item) === normalize(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);

      // Operating Payments (Exclude transfers)
      const paymentsRutin = txs
        .filter(t => t.type === 'Expense' && !isTransfer(t) && COA_STRUCTURE.expense[0].items.some(item => normalize(item) === normalize(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);

      const paymentsProgram = txs
        .filter(t => t.type === 'Expense' && !isTransfer(t) && (
          COA_STRUCTURE.expense[1].items.some(item => normalize(item) === normalize(t.category)) ||
          COA_STRUCTURE.expense[3].items.some(item => normalize(item) === normalize(t.category))
        ))
        .reduce((sum, t) => sum + t.amount, 0);

      const paymentsRapat = txs
        .filter(t => t.type === 'Expense' && !isTransfer(t) && COA_STRUCTURE.expense[2].items.some(item => normalize(item) === normalize(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);

      // Investing Activities
      const interestIncome = txs
        .filter(t => t.type === 'Income' && (normalize(t.category).includes('bunga') || normalize(t.description).includes('bunga')))
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate Saldo Awal and Saldo Akhir directly to ensure consistency with other reports
      let saldoAwal = 0;
      let saldoAkhir = 0;

      if (monthIndex !== null) {
        // Monthly view
        saldoAwal = allCashTxs
          .filter(t => {
            const d = new Date(t.date);
            const tYear = d.getFullYear();
            const tMonth = d.getMonth();
            return tYear < selectedYear || (tYear === selectedYear && tMonth < monthIndex);
          })
          .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0) +
          txs.filter(t => isSaldoAwal(t)).reduce((sum, t) => sum + t.amount, 0);

        saldoAkhir = allCashTxs
          .filter(t => {
            const d = new Date(t.date);
            const tYear = d.getFullYear();
            const tMonth = d.getMonth();
            return tYear < selectedYear || (tYear === selectedYear && tMonth <= monthIndex);
          })
          .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
      } else {
        // Annual view
        saldoAwal = allCashTxs
          .filter(t => {
            const d = new Date(t.date);
            return isSaldoAwal(t) && d.getFullYear() === selectedYear;
          })
          .reduce((sum, t) => sum + t.amount, 0);

        saldoAkhir = allCashTxs
          .filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === selectedYear;
          })
          .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
      }

      const netIncrease = saldoAkhir - saldoAwal;
      const investingIncome = interestIncome;
      const investingExpense = 0;
      const netInvesting = investingIncome - investingExpense;
      const netOperating = netIncrease - netInvesting;

      // Receipts Lain and Payments Lain act as balancers to ensure math consistency
      // while still trying to show categorized data
      const receiptsLain = txs
        .filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && (
          COA_STRUCTURE.income[2].items.some(item => normalize(item) === normalize(t.category)) &&
          !normalize(t.category).includes('bunga') &&
          !normalize(t.description).includes('bunga')
        ))
        .reduce((sum, t) => sum + t.amount, 0);

      // Adjust paymentsLain to be the balancer
      const paymentsLain = (receiptsRutin + receiptsProgram + receiptsLain) - (paymentsRutin + paymentsProgram + paymentsRapat) - netOperating;

      // Internal transfers tracking (for info)
      const inflowFromDeposito = txs
        .filter(t => t.type === 'Income' && isTransfer(t) && (t.bank === 'DEPO BJT' || normalize(t.description).includes('deposito')))
        .reduce((sum, t) => sum + t.amount, 0);

      const outflowToDeposito = txs
        .filter(t => t.type === 'Expense' && isTransfer(t) && (normalize(t.description).includes('deposito') || normalize(t.category).includes('deposito')))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        receiptsRutin, receiptsProgram, receiptsLain,
        paymentsRutin, paymentsProgram, paymentsRapat, paymentsLain,
        netOperating, investingIncome, investingExpense, netInvesting,
        netIncrease, saldoAwal, saldoAkhir,
        inflowFromDeposito, outflowToDeposito, interestIncome
      };
    };

    const monthCashTxs = allCashTxs.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedArusKasMonth && d.getFullYear() === selectedYear;
    });
    const bulanan = calculateForTransactions(monthCashTxs, selectedArusKasMonth);
    
    const yearCashTxs = allCashTxs.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear;
    });
    const tahunan = calculateForTransactions(yearCashTxs, null);

    return { bulanan, tahunan };
  }, [transactions, selectedArusKasMonth, isSaldoAwal, isTransfer, selectedYear]);

  const formatArusKasValue = useCallback((val: number) => {
    const rounded = Math.round(val);
    return rounded === 0 ? 0 : rounded;
  }, []);

  const getArusKasTransactions = useCallback((category: string, isMonthly: boolean) => {
    const normalize = (str: string) => str.toLowerCase().trim()
      .replace(/^[\d.]+\s*/, '')
      .replace(/lain-lain/g, 'lain')
      .trim();

    const txs = isMonthly 
      ? transactions.filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === selectedArusKasMonth && d.getFullYear() === selectedYear;
        })
      : transactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === selectedYear;
        });

    switch (category) {
      case 'receiptsRutin':
        return txs.filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && COA_STRUCTURE.income[0].items.some(item => normalize(item) === normalize(t.category)));
      case 'receiptsProgram':
        return txs.filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && COA_STRUCTURE.income[1].items.some(item => normalize(item) === normalize(t.category)));
      case 'receiptsLain':
        return txs.filter(t => t.type === 'Income' && !isTransfer(t) && !isSaldoAwal(t) && (
          COA_STRUCTURE.income[2].items.some(item => normalize(item) === normalize(t.category)) &&
          !normalize(t.category).includes('bunga') &&
          !normalize(t.description).includes('bunga')
        ));
      case 'paymentsRutin':
        return txs.filter(t => t.type === 'Expense' && !isTransfer(t) && COA_STRUCTURE.expense[0].items.some(item => normalize(item) === normalize(t.category)));
      case 'paymentsProgram':
        return txs.filter(t => t.type === 'Expense' && !isTransfer(t) && (
          COA_STRUCTURE.expense[1].items.some(item => normalize(item) === normalize(t.category)) ||
          COA_STRUCTURE.expense[3].items.some(item => normalize(item) === normalize(t.category))
        ));
      case 'paymentsRapat':
        return txs.filter(t => t.type === 'Expense' && !isTransfer(t) && COA_STRUCTURE.expense[2].items.some(item => normalize(item) === normalize(t.category)));
      case 'paymentsLain':
        return txs.filter(t => t.type === 'Expense' && !isTransfer(t) && 
          !COA_STRUCTURE.expense[0].items.some(item => normalize(item) === normalize(t.category)) &&
          !COA_STRUCTURE.expense[1].items.some(item => normalize(item) === normalize(t.category)) &&
          !COA_STRUCTURE.expense[2].items.some(item => normalize(item) === normalize(t.category)) &&
          !COA_STRUCTURE.expense[3].items.some(item => normalize(item) === normalize(t.category))
        );
      case 'interestIncome':
        return txs.filter(t => t.type === 'Income' && (normalize(t.category).includes('bunga') || normalize(t.description).includes('bunga')));
      default:
        return [];
    }
  }, [transactions, selectedArusKasMonth, selectedYear, isTransfer, isSaldoAwal]);

  const detailReportData = useMemo(() => {
    const targetBanks = ['MANDIRI', 'BANK JATENG', 'BJS', 'BSI', 'KAS', 'DEPO BJT'];
    
    const getGroupedData = (type: 'Income' | 'Expense', structure: COAGroup[]) => {
      const normalize = (str: string) => str.toLowerCase().trim()
        .replace(/^[\d.]+\s*/, '')
        .replace(/lain-lain/g, 'lain')
        .trim();

      const groups = structure.map(group => {
        const items = group.items.map((itemName: string) => {
          const normalizedTarget = normalize(itemName);
          
          const bankValues = targetBanks.map(bank => {
            return transactions
              .filter(t => {
                const normalizedCat = normalize(t.category);
                const normalizedDesc = t.description.toLowerCase();
                
                let isMatch = normalizedCat === normalizedTarget;
                
                if (!isMatch) {
                  if (normalizedTarget === 'pindah buku masuk') {
                    isMatch = t.type === 'Income' && (
                      t.category.includes('500') || 
                      normalizedCat.includes('pindah buku') || 
                      normalizedDesc.includes('pindah buku masuk') ||
                      normalizedDesc.includes('pindah buku dari') ||
                      (normalizedDesc.includes('pindah buku') && !normalizedDesc.includes('keluar'))
                    );
                  } else if (normalizedTarget === 'pindah buku keluar') {
                    isMatch = t.type === 'Expense' && (
                      t.category.includes('600') || 
                      normalizedCat.includes('pindah buku') || 
                      normalizedDesc.includes('pindah buku keluar') ||
                      normalizedDesc.includes('pindah buku ke') ||
                      (normalizedDesc.includes('pindah buku') && !normalizedDesc.includes('masuk'))
                    );
                  } else if (normalizedTarget === 'penerimaan bunga bank' || normalizedTarget === 'penerimaan bunga deposito') {
                    isMatch = t.type === 'Income' && (normalizedCat.includes('bunga') || normalizedDesc.includes('bunga'));
                  } else if (normalizedTarget === 'pajak rekening dan deposito') {
                    isMatch = t.type === 'Expense' && (normalizedCat.includes('pajak') || normalizedDesc.includes('pajak'));
                  }
                }
                
                const d = new Date(t.date);
                const monthMatch = d.getMonth() === selectedDetailMonth;
                const yearMatch = d.getFullYear() === selectedYear;
                const bankMatch = t.bank.trim().toUpperCase() === bank;
                return t.type === type && isMatch && monthMatch && yearMatch && bankMatch;
              })
              .reduce((sum, t) => sum + t.amount, 0);
          });
          const total = bankValues.reduce((sum, val) => sum + val, 0);
          return { name: itemName, bankValues, total };
        });

        const bankTotals = targetBanks.map((_, i) => {
          return items.reduce((sum: number, item) => sum + item.bankValues[i], 0);
        });
        const total = bankTotals.reduce((sum, val) => sum + val, 0);

        return {
          id: group.id,
          title: group.title,
          items,
          bankTotals,
          total
        };
      });

      return groups;
    };

    const incomeGroups = getGroupedData('Income', COA_STRUCTURE.income);
    const expenseGroups = getGroupedData('Expense', COA_STRUCTURE.expense);

    const incomeBankTotals = targetBanks.map((_, i) => 
      incomeGroups.reduce((sum, group) => sum + group.bankTotals[i], 0)
    );
    const incomeGrandTotal = incomeBankTotals.reduce((sum, val) => sum + val, 0);

    const expenseBankTotals = targetBanks.map((_, i) => 
      expenseGroups.reduce((sum, group) => sum + group.bankTotals[i], 0)
    );
    const expenseGrandTotal = expenseBankTotals.reduce((sum, val) => sum + val, 0);

    const surplusBank = targetBanks.map((_, i) => incomeBankTotals[i] - expenseBankTotals[i]);
    const surplusGrandTotal = incomeGrandTotal - expenseGrandTotal;

    const saldoAwalBank = targetBanks.map(bank => {
      const prevBalance = transactions
        .filter(t => {
          const d = new Date(t.date);
          const tYear = d.getFullYear();
          const tMonth = d.getMonth();
          const bankMatch = t.bank.trim().toUpperCase() === bank;
          return bankMatch && (tYear < selectedYear || (tYear === selectedYear && tMonth < selectedDetailMonth));
        })
        .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
        
      const currentSAMount = transactions
        .filter(t => {
          const d = new Date(t.date);
          const bankMatch = t.bank.trim().toUpperCase() === bank;
          const monthMatch = d.getMonth() === selectedDetailMonth && d.getFullYear() === selectedYear;
          return bankMatch && monthMatch && isSaldoAwal(t);
        })
        .reduce((sum, t) => sum + t.amount, 0);
        
      return prevBalance + currentSAMount;
    });
    
    const saldoAwalTotal = saldoAwalBank.reduce((sum, val) => sum + val, 0);

    const kasSetaraKasBank = targetBanks.map(bank => {
      return transactions
        .filter(t => {
          const d = new Date(t.date);
          const tYear = d.getFullYear();
          const tMonth = d.getMonth();
          const bankMatch = t.bank.trim().toUpperCase() === bank;
          return bankMatch && (tYear < selectedYear || (tYear === selectedYear && tMonth <= selectedDetailMonth));
        })
        .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
    });
    const kasSetaraKasTotal = kasSetaraKasBank.reduce((sum, val) => sum + val, 0);

    return {
      incomeGroups,
      expenseGroups,
      incomeBankTotals,
      incomeGrandTotal,
      expenseBankTotals,
      expenseGrandTotal,
      surplusBank,
      surplusGrandTotal,
      saldoAwalBank,
      saldoAwalTotal,
      kasSetaraKasBank,
      kasSetaraKasTotal,
      targetBanks
    };
  }, [transactions, selectedDetailMonth, isSaldoAwal, selectedYear]);


  const getBalance = useCallback((bankName: string) => {
    return transactions
      .filter(t => t.bank.toUpperCase() === bankName.toUpperCase() && new Date(t.date).getFullYear() <= selectedYear)
      .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
  }, [transactions, selectedYear]);

  const kasBalance = useMemo(() => getBalance('KAS'), [getBalance]);
  const mandiriBalance = useMemo(() => getBalance('MANDIRI'), [getBalance]);
  const bankJatengBalance = useMemo(() => getBalance('BANK JATENG'), [getBalance]);
  const bjsBalance = useMemo(() => getBalance('BJS'), [getBalance]);
  const bsiBalance = useMemo(() => getBalance('BSI'), [getBalance]);
  const depositoBalance = useMemo(() => getBalance('DEPO BJT'), [getBalance]);

  const totalKasSetaraKas = useMemo(() => 
    kasBalance + mandiriBalance + bankJatengBalance + bjsBalance + bsiBalance + depositoBalance,
    [kasBalance, mandiriBalance, bankJatengBalance, bjsBalance, bsiBalance, depositoBalance]
  );

  const dashboardCards = [
    { title: 'Saldo Kas Kecil', balance: kasBalance, tab: 'transaksi-kas' as const, bank: 'KAS', icon: Wallet, primary: true },
    { title: 'Saldo Mandiri', balance: mandiriBalance, tab: 'transaksi-bank' as const, bank: 'MANDIRI', icon: CreditCard },
    { title: 'Saldo Bank Jateng', balance: bankJatengBalance, tab: 'transaksi-bank' as const, bank: 'BANK JATENG', icon: CreditCard },
    { title: 'Saldo BJS', balance: bjsBalance, tab: 'transaksi-bank' as const, bank: 'BJS', icon: CreditCard },
    { title: 'Saldo BSI', balance: bsiBalance, tab: 'transaksi-bank' as const, bank: 'BSI', icon: CreditCard },
    { title: 'Saldo Deposito', balance: depositoBalance, tab: 'transaksi-deposito' as const, bank: 'DEPO BJT', icon: FileText },
  ];

  const handleSeeDetails = (tab: 'transaksi-bank' | 'transaksi-kas' | 'transaksi-deposito', bank: string) => {
    setActiveTab(tab);
    setSelectedBank(bank);
    setSelectedMonth('all');
  };


  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#EFEBE0] flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-[100] w-full bg-[#133838] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 mr-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/10 p-1 shadow-inner">
                <PersiLogo className="w-full h-full" />
              </div>
              <div className="hidden sm:block">
                <h2 className="font-bold text-sm leading-tight uppercase tracking-wider text-white">Cash Flow</h2>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Monitoring</p>
              </div>
            </div>

            {/* Main Navigation - SPA Style Labels */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all",
                  activeTab === 'dashboard' 
                    ? "bg-[#D36125] text-white shadow-lg" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                Dashboard
              </button>

              <div className="relative group">
                <button 
                  className={cn(
                    "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5",
                    (activeTab === 'transaksi-bank' || activeTab === 'transaksi-kas' || activeTab === 'transaksi-deposito')
                      ? "bg-[#D36125] text-white shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Transaksi
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
                
                {/* Submenu Dropdown */}
                <div className="absolute top-[calc(100%-4px)] left-0 w-40 pt-4 hidden group-hover:block z-50">
                  <div className="bg-[#133838] rounded-2xl shadow-2xl border border-white/10 py-2 overflow-hidden">
                    <button 
                      onClick={() => setActiveTab('transaksi-bank')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                        activeTab === 'transaksi-bank' 
                          ? "bg-white/10 text-[#D36125]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      Bank
                    </button>
                    <button 
                      onClick={() => setActiveTab('transaksi-kas')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                        activeTab === 'transaksi-kas' 
                          ? "bg-white/10 text-[#D36125]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      Kas
                    </button>
                    <button 
                      onClick={() => setActiveTab('transaksi-deposito')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                        activeTab === 'transaksi-deposito' 
                          ? "bg-white/10 text-[#D36125]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      Deposito
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button 
                  className={cn(
                    "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5",
                    (activeTab === 'aktivitas-keuangan' || activeTab === 'arus-kas')
                      ? "bg-[#D36125] text-white shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Report
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
                
                {/* Report Submenu Dropdown */}
                <div className="absolute top-[calc(100%-4px)] left-0 w-48 pt-4 hidden group-hover:block z-50">
                  <div className="bg-[#133838] rounded-2xl shadow-2xl border border-white/10 py-2 overflow-hidden">
                    <button 
                      onClick={() => setActiveTab('aktivitas-keuangan')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                        activeTab === 'aktivitas-keuangan' 
                          ? "bg-white/10 text-[#D36125]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      Aktivitas Keuangan
                    </button>
                    <button 
                      onClick={() => setActiveTab('arus-kas')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                        activeTab === 'arus-kas' 
                          ? "bg-white/10 text-[#D36125]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      Arus Kas
                    </button>
                  </div>
                </div>
              </div>

            </nav>

            {/* Spacer to push User Actions to the right */}
            <div className="flex-1" />

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="hidden md:block text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  Last Sync: {lastUpdated}
                </span>
              )}
              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10"
                title="Refresh Data"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all group border border-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:block text-[9px] font-bold uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Scrollable Content */}
        <main 
          ref={mainRef}
          className={cn(
            "flex-1 overflow-auto",
            activeTab === 'aktivitas-keuangan' && (aktivitasSubTab === 'tahunan' ? 'print-landscape' : 'print-portrait'),
            activeTab === 'arus-kas' && 'print-portrait'
          )}
        >
          {/* Organization Info Bar */}
          <div className="bg-white border-b border-stone-200 py-3 px-8 shrink-0 organization-info-bar">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-stone-200 p-0.5 shadow-sm overflow-hidden">
                  <PersiLogo />
                </div>
                <div>
                  <h1 className="font-bold text-[10px] leading-tight text-stone-900 uppercase tracking-wide">Perhimpunan Rumah Sakit Seluruh Indonesia</h1>
                  <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Daerah Jawa Tengah</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-[#D36125] px-3 py-1.5 rounded-xl shadow-lg border border-[#D36125]/20 no-print"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white uppercase tracking-[0.15em] leading-none mb-1.5">
                          Loading {loadingProgress}%
                        </span>
                        <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(activeTab === 'aktivitas-keuangan' || activeTab === 'arus-kas') && (
                  <div className="flex items-center gap-1.5 no-print">
                    <button 
                      type="button"
                      onClick={handleExportPDF}
                      className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-all border border-stone-200 cursor-pointer relative z-10"
                      title="Export PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h2 className="text-3xl font-black text-[#133838] uppercase tracking-tighter">
                  {activeTab === 'dashboard' ? 'Dashboard' : 
                   activeTab === 'aktivitas-keuangan' ? `LAPORAN AKTIVITAS KEUANGAN ${selectedYear}` : 
                   activeTab === 'transaksi-bank' ? 'Transaksi Bank' : 
                   activeTab === 'transaksi-kas' ? 'Transaksi Kas' : 
                   activeTab === 'arus-kas' ? `LAPORAN ARUS KAS ${selectedYear}` :
                   'Transaksi Deposito'}
                </h2>

                {activeTab === 'aktivitas-keuangan' && (
                  <div className="flex bg-stone-200/50 p-1 rounded-xl w-fit no-print">
                    <button 
                      onClick={() => setAktivitasSubTab('tahunan')}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        aktivitasSubTab === 'tahunan' ? "bg-white text-[#D36125] shadow-sm" : "text-stone-500 hover:text-stone-700"
                      )}
                    >
                      Tahunan
                    </button>
                    <button 
                      onClick={() => setAktivitasSubTab('detail')}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        aktivitasSubTab === 'detail' ? "bg-white text-[#D36125] shadow-sm" : "text-stone-500 hover:text-stone-700"
                      )}
                    >
                      Detail
                    </button>
                  </div>
                )}

                {activeTab === 'arus-kas' && (
                  <div className="flex bg-stone-200/50 p-1 rounded-xl w-fit no-print">
                    <button 
                      onClick={() => setArusKasSubTab('bulanan')}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        arusKasSubTab === 'bulanan' ? "bg-white text-[#D36125] shadow-sm" : "text-stone-500 hover:text-stone-700"
                      )}
                    >
                      Bulanan
                    </button>
                    <button 
                      onClick={() => setArusKasSubTab('tahunan')}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        arusKasSubTab === 'tahunan' ? "bg-white text-[#D36125] shadow-sm" : "text-stone-500 hover:text-stone-700"
                      )}
                    >
                      Tahunan
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Terjadi Kesalahan</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {activeTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto">
                {/* Main Total Card */}
                <div className="mb-6">
                  <div className="bg-[#D36125] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group border border-white/10">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Total Kas dan Setara Kas</h3>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none mb-1">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalKasSetaraKas)}
                        </h2>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Konsolidasi Saldo Kas Kecil & Seluruh Rekening Bank</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <div className="px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                          <p className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-0.5">Kas Kecil</p>
                          <p className="text-xs font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kasBalance)}</p>
                        </div>
                        <div className="px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                          <p className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-0.5">Bank Accounts</p>
                          <p className="text-xs font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(mandiriBalance + bankJatengBalance + bjsBalance + bsiBalance)}</p>
                        </div>
                        <div className="px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                          <p className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-0.5">Deposito</p>
                          <p className="text-xs font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(depositoBalance)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {dashboardCards.map((card, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-6 rounded-3xl shadow-sm border relative overflow-hidden group transition-all hover:shadow-md",
                        card.primary 
                          ? "bg-[#133838] border-transparent" 
                          : "bg-white border-stone-200"
                      )}
                    >
                      <div className="relative z-10">
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest mb-2",
                          card.primary ? "text-white/50" : "text-stone-400"
                        )}>
                          {card.title}
                        </p>
                        <p className={cn(
                          "text-xl font-black mb-4",
                          card.primary ? "text-white" : "text-[#133838]"
                        )}>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(card.balance)}
                        </p>
                        <button 
                          onClick={() => handleSeeDetails(card.tab, card.bank)}
                          className="text-[10px] font-bold text-[#D36125] uppercase tracking-widest hover:opacity-70 transition-colors"
                        >
                          See Details
                        </button>
                      </div>
                      <div className={cn(
                        "absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                        card.primary ? "bg-[#D36125]" : "bg-stone-50"
                      )}>
                        <card.icon className={cn("w-6 h-6", card.primary ? "text-white" : "text-stone-400")} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'aktivitas-keuangan' && aktivitasSubTab === 'tahunan' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2rem] print:rounded-none border border-stone-200 shadow-sm mb-12 overflow-hidden">
                  <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 print:bg-transparent rounded-t-[2rem] print:rounded-none">
                    <div className="w-full">
                      <h3 className="text-xl font-black text-[#133838] uppercase print:hidden">Laporan Aktivitas Keuangan Tahunan</h3>
                      <div className="no-screen flex flex-col items-center mb-6 border-b-2 border-black pb-4 w-full">
                        <h3 className="text-xl font-black text-[#133838] uppercase mb-2">Laporan Aktivitas Keuangan Tahunan</h3>
                        <p className="text-lg font-bold text-stone-600 uppercase tracking-widest text-center">Tahun {selectedYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 no-print">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Filter Bank:</span>
                        <select 
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                        >
                          {banks.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>
                      <FileText className="w-6 h-6 text-stone-300" />
                    </div>
                  </div>
                  <div className="scrollbar-hide overflow-x-auto print:overflow-visible">
                    <table className="w-full text-[13px] border-separate border-spacing-0 min-w-[1800px] print:min-w-0 print:border-collapse">
                      <thead className="sticky top-0 z-30 print:static">
                        <tr className="bg-stone-50 print:bg-[#f0f0f0]">
                          <th className="border border-stone-200 p-3 text-center sticky left-0 top-0 bg-stone-50 z-50 w-12 min-w-[48px] font-black uppercase tracking-wider print:static print:bg-[#f0f0f0]">NO</th>
                          <th className="border border-stone-200 p-3 text-left sticky left-[48px] top-0 bg-stone-50 z-50 w-[250px] min-w-[250px] font-black uppercase tracking-wider break-words whitespace-normal print:static print:bg-[#f0f0f0]">URAIAN</th>
                          {monthNames.map(m => (
                            <th key={m} className="border border-stone-200 p-3 text-right min-w-[110px] font-black uppercase tracking-wider sticky top-0 bg-stone-50 z-30 print:static print:bg-[#f0f0f0]">{m}</th>
                          ))}
                          <th className="border border-stone-200 p-3 text-right min-w-[140px] bg-stone-100 font-black uppercase tracking-wider sticky top-0 z-30 print:static print:bg-[#e0e0e0]">TOTAL</th>
                        </tr>
                      </thead>
                    <tbody>
                      {/* PENERIMAAN Section */}
                      <tr className="bg-[#133838]/5 font-black print:bg-[#d1d5db]">
                        <td className="border border-stone-200 p-3 text-center sticky left-0 bg-[#f7f8f8] z-10 w-12 min-w-[48px] print:static print:bg-[#d1d5db]">A</td>
                        <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#f7f8f8] z-10 align-top uppercase tracking-wide w-[250px] min-w-[250px] print:static print:bg-[#d1d5db]">PENERIMAAN</td>
                        {Array(13).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                      </tr>
                      
                      {reportData.incomeGroups.map(group => (
                        <React.Fragment key={group.title}>
                          <tr className="bg-stone-50/50 font-bold print:bg-[#f3f4f6]">
                            <td className="border border-stone-200 p-3 text-center sticky left-0 bg-[#fbfbfb] z-10 w-12 min-w-[48px] print:static print:bg-[#f3f4f6]">{group.id}</td>
                            <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fbfbfb] z-10 align-top uppercase tracking-tight w-[250px] min-w-[250px] print:static print:bg-[#f3f4f6]">{group.title}</td>
                            {Array(13).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                          </tr>
                          {group.items.map((item, idx) => (
                            <tr key={item.name} className="hover:bg-stone-50 transition-colors">
                              <td className="border border-stone-200 p-3 text-center sticky left-0 bg-white z-10 w-12 min-w-[48px] print:static">{idx + 1}</td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-white z-10 align-top text-stone-600 break-words whitespace-normal w-[250px] min-w-[250px] print:static">{item.name}</td>
                              {item.monthlyValues.map((val, i) => (
                                <td key={i} className="border border-stone-200 p-3 text-right font-medium whitespace-nowrap">
                                  {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              ))}
                              <td className="border border-stone-200 p-3 text-right font-black bg-stone-50/30 whitespace-nowrap">
                                {item.total === 0 ? '-' : Math.round(item.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-stone-50/30 font-bold italic print:bg-[#f9fafb]">
                            <td className="border border-stone-200 p-3 sticky left-0 bg-[#fdfdfd] z-10 w-12 min-w-[48px] print:static print:bg-[#f9fafb]"></td>
                            <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fdfdfd] z-10 align-top uppercase tracking-tighter w-[250px] min-w-[250px] print:static print:bg-[#f9fafb]">TOTAL {group.title}</td>
                            {group.monthlyTotals.map((val, i) => (
                              <td key={i} className="border border-stone-200 p-3 text-right whitespace-nowrap">
                                {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            ))}
                            <td className="border border-stone-200 p-3 text-right bg-stone-100/30 whitespace-nowrap">
                              {group.total === 0 ? '-' : Math.round(group.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                      
                      <tr className="bg-[#133838] text-white font-black print:bg-[#1f2937] print:text-white">
                        <td className="border border-[#133838] p-3 sticky left-0 bg-[#133838] z-10 w-12 min-w-[48px] print:static"></td>
                        <td className="border border-[#133838] p-3 sticky left-[48px] bg-[#133838] z-10 align-top uppercase tracking-widest w-[250px] min-w-[250px] print:static">TOTAL PENERIMAAN (A)</td>
                        {reportData.incomeMonthlyTotals.map((val, i) => (
                          <td key={i} className="border border-[#133838] p-3 text-right whitespace-nowrap">
                            {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                        <td className="border border-[#133838] p-3 text-right bg-white/10 whitespace-nowrap">
                          {reportData.incomeGrandTotal === 0 ? '-' : Math.round(reportData.incomeGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>

                      {/* Spacer row */}
                      <tr className="h-8">
                        {Array(15).fill(0).map((_, i) => <td key={i} className="border-none"></td>)}
                      </tr>

                      {/* PENGELUARAN Section */}
                      <tr className="bg-[#133838]/5 font-black">
                        <td className="border border-stone-200 p-3 text-center sticky left-0 bg-[#f7f8f8] z-10 w-12 min-w-[48px]">B</td>
                        <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#f7f8f8] z-10 align-top uppercase tracking-wide w-[250px] min-w-[250px]">PENGELUARAN</td>
                        {Array(13).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                      </tr>

                      {reportData.expenseGroups.map(group => (
                        <React.Fragment key={group.title}>
                          <tr className="bg-stone-50/50 font-bold">
                            <td className="border border-stone-200 p-3 text-center sticky left-0 bg-[#fbfbfb] z-10 w-12 min-w-[48px]">{group.id}</td>
                            <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fbfbfb] z-10 align-top uppercase tracking-tight w-[250px] min-w-[250px]">{group.title}</td>
                            {Array(13).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                          </tr>
                          {group.items.map((item, idx) => (
                            <tr key={item.name} className="hover:bg-stone-50 transition-colors">
                              <td className="border border-stone-200 p-3 text-center sticky left-0 bg-white z-10 w-12 min-w-[48px]">{idx + 1}</td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-white z-10 align-top text-stone-600 break-words whitespace-normal w-[250px] min-w-[250px]">{item.name}</td>
                              {item.monthlyValues.map((val, i) => (
                                <td key={i} className="border border-stone-200 p-3 text-right font-medium">
                                  {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              ))}
                              <td className="border border-stone-200 p-3 text-right font-black bg-stone-50/30">
                                {item.total === 0 ? '-' : Math.round(item.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}

                      <tr className="bg-[#133838] text-white font-black">
                        <td className="border border-[#133838] p-3 sticky left-0 bg-[#133838] z-10 w-12 min-w-[48px]"></td>
                        <td className="border border-[#133838] p-3 sticky left-[48px] bg-[#133838] z-10 align-top uppercase tracking-widest w-[250px] min-w-[250px]">TOTAL PENGELUARAN (B)</td>
                        {reportData.expenseMonthlyTotals.map((val, i) => (
                          <td key={i} className="border border-[#133838] p-3 text-right">
                            {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                        <td className="border border-[#133838] p-3 text-right bg-white/10">
                          {reportData.expenseGrandTotal === 0 ? '-' : Math.round(reportData.expenseGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>

                      {/* Spacer row */}
                      <tr className="h-8">
                        {Array(15).fill(0).map((_, i) => <td key={i} className="border-none"></td>)}
                      </tr>

                      {/* FINAL SALDO Section */}
                      <tr className="bg-stone-900 text-white font-black">
                        <td className="border border-stone-800 p-3 text-center sticky left-0 bg-stone-900 z-10 w-12 min-w-[48px]">C</td>
                        <td className="border border-stone-800 p-3 sticky left-[48px] bg-stone-900 z-10 align-top uppercase tracking-widest w-[250px] min-w-[250px]">SALDO AKHIR ( A - B)</td>
                        {reportData.surplusMonthly.map((val, i) => (
                          <td key={i} className="border border-stone-800 p-3 text-right">
                            {val === 0 ? '-' : (val < 0 ? `(${Math.round(Math.abs(val)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                          </td>
                        ))}
                        <td className="border border-stone-800 p-3 text-right bg-white/10">
                          {reportData.surplusGrandTotal === 0 ? '-' : (reportData.surplusGrandTotal < 0 ? `(${Math.round(Math.abs(reportData.surplusGrandTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(reportData.surplusGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                        </td>
                      </tr>

                      <tr className="bg-stone-100 font-black">
                        <td className="border border-stone-200 p-3 text-center sticky left-0 bg-stone-100 z-10 w-12 min-w-[48px]">D</td>
                        <td className="border border-stone-200 p-3 sticky left-[48px] bg-stone-100 z-10 align-top uppercase tracking-widest w-[250px] min-w-[250px]">SALDO AWAL</td>
                        {reportData.saldoAwalMonthly.map((val, i) => (
                          <td key={i} className="border border-stone-200 p-3 text-right">
                            {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                        <td className="border border-stone-200 p-3 text-right bg-stone-200/50">
                          {Number(reportData.saldoAwalTotal || 0) === 0 ? '-' : Math.round(Number(reportData.saldoAwalTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>

                      <tr className="bg-[#D36125] text-white font-black">
                        <td className="border border-[#D36125] p-3 text-center sticky left-0 bg-[#D36125] z-10 w-12 min-w-[48px]">E</td>
                        <td className="border border-[#D36125] p-3 sticky left-[48px] bg-[#D36125] z-10 align-top uppercase tracking-widest w-[250px] min-w-[250px]">KAS & SETARA KAS ( C + D)</td>
                        {reportData.kasSetaraKasMonthly.map((val, i) => (
                          <td key={i} className="border border-[#D36125] p-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span>{val === 0 ? '-' : (val < 0 ? `(${Math.round(Math.abs(val)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}</span>
                              <button 
                                onClick={() => {
                                  setSelectedDetailMonth(i);
                                  setActiveTab('aktivitas-keuangan');
                                  setAktivitasSubTab('detail');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-[8px] font-bold uppercase tracking-tighter bg-white/20 hover:bg-white/40 px-1.5 py-0.5 rounded transition-colors cursor-pointer no-print"
                              >
                                See Detail
                              </button>
                            </div>
                          </td>
                        ))}
                        <td className="border border-[#D36125] p-3 text-right bg-white/10">
                          {reportData.kasSetaraKasTotal === 0 ? '-' : (reportData.kasSetaraKasTotal < 0 ? `(${Math.round(Math.abs(reportData.kasSetaraKasTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(reportData.kasSetaraKasTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

            {activeTab === 'arus-kas' && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {(() => {
                  const currentArusKas = arusKasData[arusKasSubTab];
                  return (
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm mb-12 overflow-hidden print:rounded-none">
                      <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 rounded-t-[2rem] gap-6 print:bg-transparent print:rounded-none">
                        <div className="w-full">
                          <h3 className="text-xl font-black text-[#133838] uppercase tracking-tight print:hidden">
                            {arusKasSubTab === 'bulanan' ? 'Laporan Arus Kas Bulanan' : 'Laporan Arus Kas Tahunan'}
                          </h3>
                          <div className="no-screen flex flex-col items-center mb-6 border-b-2 border-black pb-4 w-full">
                            <h3 className="text-xl font-black text-[#133838] uppercase mb-2">
                              {arusKasSubTab === 'bulanan' ? 'Laporan Arus Kas Bulanan' : 'Laporan Arus Kas Tahunan'}
                            </h3>
                            <p className="text-lg font-bold text-stone-600 uppercase tracking-widest text-center">
                              {arusKasSubTab === 'bulanan' ? `Bulan : ${monthNames[selectedArusKasMonth]}` : `Tahun ${selectedYear}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 no-print">
                          {arusKasSubTab === 'bulanan' && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bulan:</span>
                              <select 
                                value={selectedArusKasMonth}
                                onChange={(e) => setSelectedArusKasMonth(parseInt(e.target.value))}
                                className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                              >
                                {monthNames.map((month, index) => (
                                  <option key={month} value={index}>{month}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          <FileText className="w-6 h-6 text-stone-300" />
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="overflow-x-auto">
                          <table className="w-full text-[13px] border-collapse">
                            <thead>
                              <tr className="bg-[#133838] text-white print:bg-black print:text-white">
                                <th className="border border-stone-200 p-3 text-left uppercase tracking-widest font-black print:border-black">Uraian</th>
                                <th className="border border-stone-200 p-3 text-right uppercase tracking-widest font-black print:border-black">Jumlah (Rp)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Operating Activities */}
                              <tr className="bg-stone-100/50 font-black">
                                <td colSpan={2} className="border border-stone-200 p-3 uppercase tracking-wider text-[#133838] print:border-black">Arus Kas dari Aktivitas Operasi:</td>
                              </tr>
                              <tr className="italic text-stone-400 font-bold">
                                <td colSpan={2} className="border border-stone-200 p-3 pl-6 print:border-black">Penerimaan:</td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Penerimaan Rutin (Iuran/Pendaftaran)</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-emerald-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">{formatArusKasValue(currentArusKas.receiptsRutin).toLocaleString('id-ID')}</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Penerimaan Rutin (Iuran/Pendaftaran)',
                                          transactions: getArusKasTransactions('receiptsRutin', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Penerimaan Program (Seminar/Workshop)</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-emerald-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">{formatArusKasValue(currentArusKas.receiptsProgram).toLocaleString('id-ID')}</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Penerimaan Program (Seminar/Workshop)',
                                          transactions: getArusKasTransactions('receiptsProgram', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Penerimaan Lain-lain</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-emerald-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">{formatArusKasValue(currentArusKas.receiptsLain).toLocaleString('id-ID')}</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Penerimaan Lain-lain',
                                          transactions: getArusKasTransactions('receiptsLain', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="italic text-stone-400 font-bold">
                                <td colSpan={2} className="border border-stone-200 p-3 pl-6 print:border-black">Pengeluaran:</td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Pengeluaran Rutin (Gaji/Kantor)</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-red-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">({formatArusKasValue(currentArusKas.paymentsRutin).toLocaleString('id-ID')})</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Pengeluaran Rutin (Gaji/Kantor)',
                                          transactions: getArusKasTransactions('paymentsRutin', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Pengeluaran Program (Pendampingan/Diklat)</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-red-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">({formatArusKasValue(currentArusKas.paymentsProgram).toLocaleString('id-ID')})</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Pengeluaran Program (Pendampingan/Diklat)',
                                          transactions: getArusKasTransactions('paymentsProgram', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Pengeluaran Rapat</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-red-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">({formatArusKasValue(currentArusKas.paymentsRapat).toLocaleString('id-ID')})</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Pengeluaran Rapat',
                                          transactions: getArusKasTransactions('paymentsRapat', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Pengeluaran Lain-lain</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-red-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">({formatArusKasValue(currentArusKas.paymentsLain).toLocaleString('id-ID')})</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Pengeluaran Lain-lain',
                                          transactions: getArusKasTransactions('paymentsLain', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-stone-50 font-black">
                                <td className="border border-stone-200 p-3 uppercase tracking-tight text-[#133838] print:border-black">Arus Kas Neto dari Aktivitas Operasi</td>
                                <td className={cn(
                                  "border border-stone-200 p-3 text-right print:border-black",
                                  currentArusKas.netOperating >= 0 ? "text-emerald-600" : "text-red-600"
                                )}>
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.netOperating).toLocaleString('id-ID')}</span>
                                    <div className="w-8 no-print"></div>
                                  </div>
                                </td>
                              </tr>

                              {/* Investing Activities */}
                              <tr className="bg-stone-100/50 font-black">
                                <td colSpan={2} className="border border-stone-200 p-3 uppercase tracking-wider text-[#133838] print:border-black pt-6">Arus Kas dari Aktivitas Investasi:</td>
                              </tr>
                              <tr>
                                <td className="border border-stone-200 p-3 pl-8 text-stone-600 print:border-black">Penerimaan Bunga (Bank & Deposito)</td>
                                <td className="border border-stone-200 p-3 text-right font-bold text-emerald-600 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.interestIncome).toLocaleString('id-ID')}</span>
                                    <div className="w-8 flex justify-center no-print">
                                      <button 
                                        onClick={() => setArusKasDetail({
                                          title: 'Penerimaan Bunga (Bank & Deposito)',
                                          transactions: getArusKasTransactions('interestIncome', arusKasSubTab === 'bulanan')
                                        })}
                                        className="p-1 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                        title="See Detail"
                                      >
                                        <Search className="w-3.5 h-3.5 text-stone-400 hover:text-[#D36125]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-stone-50 font-black">
                                <td className="border border-stone-200 p-3 uppercase tracking-tight text-[#133838] print:border-black">Arus Kas Neto dari Aktivitas Investasi</td>
                                <td className={cn(
                                  "border border-stone-200 p-3 text-right print:border-black",
                                  currentArusKas.netInvesting >= 0 ? "text-emerald-600" : "text-red-600"
                                )}>
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.netInvesting).toLocaleString('id-ID')}</span>
                                    <div className="w-8 no-print"></div>
                                  </div>
                                </td>
                              </tr>
                              {/* Summary Section */}
                              <tr className="h-4"></tr>
                              <tr className="bg-[#133838] text-white font-black print:bg-black print:text-white">
                                <td className="border border-[#133838] p-3 uppercase tracking-widest print:border-black">Kenaikan/Penurunan Bersih Kas</td>
                                <td className="border border-[#133838] p-3 text-right print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.netIncrease).toLocaleString('id-ID')}</span>
                                    <div className="w-8 no-print"></div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-stone-100 font-black">
                                <td className="border border-stone-200 p-3 uppercase tracking-widest text-stone-500 print:border-black">Kas pada Awal Periode</td>
                                <td className="border border-stone-200 p-3 text-right text-stone-700 print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.saldoAwal).toLocaleString('id-ID')}</span>
                                    <div className="w-8 no-print"></div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-[#D36125] text-white font-black print:bg-stone-800 print:text-white">
                                <td className="border border-[#D36125] p-3 uppercase tracking-widest print:border-black">Kas pada Akhir Periode</td>
                                <td className="border border-[#D36125] p-3 text-right print:border-black">
                                  <div className="flex items-center justify-end">
                                    <span className="tabular-nums">Rp {formatArusKasValue(currentArusKas.saldoAkhir).toLocaleString('id-ID')}</span>
                                    <div className="w-8 no-print"></div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'aktivitas-keuangan' && aktivitasSubTab === 'detail' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm mb-12 overflow-hidden print:rounded-none">
                  <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 rounded-t-[2rem] gap-6 print:bg-transparent print:rounded-none">
                    <div className="w-full">
                      <h3 className="text-xl font-black text-[#133838] uppercase print:hidden">Laporan Aktivitas Keuangan Detail</h3>
                      <div className="no-screen flex flex-col items-center mb-6 border-b-2 border-black pb-4 w-full">
                        <h3 className="text-xl font-black text-[#133838] uppercase mb-2">Laporan Aktivitas Keuangan Detail</h3>
                        <p className="text-lg font-bold text-stone-600 uppercase tracking-widest text-center">Bulan : {monthNames[selectedDetailMonth]}</p>
                      </div>
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1 no-print">Rekapitulasi per Bank & Kas untuk periode terpilih</p>
                    </div>
                    
                    <div className="flex items-center gap-4 no-print">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bulan:</span>
                        <select 
                          value={selectedDetailMonth}
                          onChange={(e) => setSelectedDetailMonth(parseInt(e.target.value))}
                          className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                        >
                          {monthNames.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <FileText className="w-6 h-6 text-stone-300" />
                    </div>
                  </div>
                  <div className="scrollbar-hide overflow-x-auto">
                    <table className="w-full text-[12px] border-separate border-spacing-0 min-w-[1000px]">
                      <thead className="sticky top-0 z-30">
                        <tr className="bg-stone-50">
                          <th className="border border-stone-200 p-3 text-left sticky left-0 top-0 bg-stone-50 z-50 w-12 min-w-[48px] font-black uppercase tracking-wider">NO</th>
                          <th className="border border-stone-200 p-3 text-left sticky left-[48px] top-0 bg-stone-50 z-50 w-[200px] min-w-[200px] font-black uppercase tracking-wider break-words whitespace-normal">URAIAN</th>
                          {detailReportData.targetBanks.map(bank => (
                            <th key={bank} className="border border-stone-200 p-3 text-right min-w-[120px] font-black uppercase tracking-wider sticky top-0 bg-stone-50 z-30">
                              {bank === 'DEPO BJT' ? 'DEPOSITO' : bank}
                            </th>
                          ))}
                          <th className="border border-stone-200 p-3 text-right min-w-[140px] bg-stone-100 font-black uppercase tracking-wider sticky top-0 z-30">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* PENERIMAAN Section */}
                        <tr className="bg-[#133838]/5 font-black">
                          <td className="border border-stone-200 p-3 sticky left-0 bg-[#f7f8f8] z-10 w-12 min-w-[48px]">A</td>
                          <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#f7f8f8] z-10 align-top uppercase tracking-wide w-[200px] min-w-[200px]">PENERIMAAN</td>
                          {Array(detailReportData.targetBanks.length + 1).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                        </tr>
                        
                        {detailReportData.incomeGroups.map(group => (
                          <React.Fragment key={group.title}>
                            <tr className="bg-stone-50/50 font-bold">
                              <td className="border border-stone-200 p-3 sticky left-0 bg-[#fbfbfb] z-10 w-12 min-w-[48px]">{group.id}</td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fbfbfb] z-10 align-top uppercase tracking-tight w-[200px] min-w-[200px]">{group.title}</td>
                              {Array(detailReportData.targetBanks.length + 1).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                            </tr>
                            {group.items.map((item, idx) => (
                              <tr key={item.name} className="hover:bg-stone-50 transition-colors">
                                <td className="border border-stone-200 p-3 text-center sticky left-0 bg-white z-10 w-12 min-w-[48px]">{idx + 1}</td>
                                <td className="border border-stone-200 p-3 sticky left-[48px] bg-white z-10 align-top text-stone-600 break-words whitespace-normal w-[200px] min-w-[200px]">{item.name}</td>
                                {item.bankValues.map((val, i) => (
                                  <td key={i} className="border border-stone-200 p-3 text-right font-medium">
                                    {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                  </td>
                                ))}
                                <td className="border border-stone-200 p-3 text-right font-black bg-stone-50/30">
                                  {item.total === 0 ? '-' : Math.round(item.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-stone-50/30 font-bold italic">
                              <td className="border border-stone-200 p-3 sticky left-0 bg-[#fdfdfd] z-10 w-12 min-w-[48px]"></td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fdfdfd] z-10 align-top uppercase tracking-tighter w-[200px] min-w-[200px]">TOTAL {group.title}</td>
                              {group.bankTotals.map((val, i) => (
                                <td key={i} className="border border-stone-200 p-3 text-right">
                                  {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              ))}
                              <td className="border border-stone-200 p-3 text-right bg-stone-100/30">
                                {group.total === 0 ? '-' : Math.round(group.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                        
                        <tr className="bg-[#133838] text-white font-black">
                          <td className="border border-[#133838] p-3 sticky left-0 bg-[#133838] z-10 w-12 min-w-[48px]"></td>
                          <td className="border border-[#133838] p-3 sticky left-[48px] bg-[#133838] z-10 align-top uppercase tracking-widest w-[200px] min-w-[200px]">TOTAL PENERIMAAN (A)</td>
                          {detailReportData.incomeBankTotals.map((val, i) => (
                            <td key={i} className="border border-[#133838] p-3 text-right">
                              {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </td>
                          ))}
                          <td className="border border-[#133838] p-3 text-right bg-white/10">
                            {detailReportData.incomeGrandTotal === 0 ? '-' : Math.round(detailReportData.incomeGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>

                        {/* Spacer row */}
                        <tr className="h-8">
                          {Array(detailReportData.targetBanks.length + 2).fill(0).map((_, i) => <td key={i} className="border-none"></td>)}
                        </tr>

                        {/* PENGELUARAN Section */}
                        <tr className="bg-[#133838]/5 font-black">
                          <td className="border border-stone-200 p-3 sticky left-0 bg-[#f7f8f8] z-10 w-12 min-w-[48px]">B</td>
                          <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#f7f8f8] z-10 align-top uppercase tracking-wide w-[200px] min-w-[200px]">PENGELUARAN</td>
                          {Array(detailReportData.targetBanks.length + 1).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                        </tr>

                        {detailReportData.expenseGroups.map(group => (
                          <React.Fragment key={group.title}>
                            <tr className="bg-stone-50/50 font-bold">
                              <td className="border border-stone-200 p-3 sticky left-0 bg-[#fbfbfb] z-10 w-12 min-w-[48px]">{group.id}</td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fbfbfb] z-10 align-top uppercase tracking-tight w-[200px] min-w-[200px]">{group.title}</td>
                              {Array(detailReportData.targetBanks.length + 1).fill(0).map((_, i) => <td key={i} className="border border-stone-200 p-3"></td>)}
                            </tr>
                            {group.items.map((item, idx) => (
                              <tr key={item.name} className="hover:bg-stone-50 transition-colors">
                                <td className="border border-stone-200 p-3 text-center sticky left-0 bg-white z-10 w-12 min-w-[48px]">{idx + 1}</td>
                                <td className="border border-stone-200 p-3 sticky left-[48px] bg-white z-10 align-top text-stone-600 break-words whitespace-normal w-[200px] min-w-[200px]">{item.name}</td>
                                {item.bankValues.map((val, i) => (
                                  <td key={i} className="border border-stone-200 p-3 text-right font-medium">
                                    {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                  </td>
                                ))}
                                <td className="border border-stone-200 p-3 text-right font-black bg-stone-50/30">
                                  {item.total === 0 ? '-' : Math.round(item.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-stone-50/30 font-bold italic">
                              <td className="border border-stone-200 p-3 sticky left-0 bg-[#fdfdfd] z-10 w-12 min-w-[48px]"></td>
                              <td className="border border-stone-200 p-3 sticky left-[48px] bg-[#fdfdfd] z-10 align-top uppercase tracking-tighter w-[200px] min-w-[200px]">TOTAL {group.title}</td>
                              {group.bankTotals.map((val, i) => (
                                <td key={i} className="border border-stone-200 p-3 text-right">
                                  {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </td>
                              ))}
                              <td className="border border-stone-200 p-3 text-right bg-stone-100/30">
                                {group.total === 0 ? '-' : Math.round(group.total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}

                        <tr className="bg-[#133838] text-white font-black">
                          <td className="border border-[#133838] p-3 sticky left-0 bg-[#133838] z-10 w-12 min-w-[48px]"></td>
                          <td className="border border-[#133838] p-3 sticky left-[48px] bg-[#133838] z-10 align-top uppercase tracking-widest w-[200px] min-w-[200px]">TOTAL PENGELUARAN (B)</td>
                          {detailReportData.expenseBankTotals.map((val, i) => (
                            <td key={i} className="border border-[#133838] p-3 text-right">
                              {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </td>
                          ))}
                          <td className="border border-[#133838] p-3 text-right bg-white/10">
                            {detailReportData.expenseGrandTotal === 0 ? '-' : Math.round(detailReportData.expenseGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>

                        {/* Spacer row */}
                        <tr className="h-8">
                          {Array(detailReportData.targetBanks.length + 2).fill(0).map((_, i) => <td key={i} className="border-none"></td>)}
                        </tr>

                        {/* FINAL SALDO Section */}
                        <tr className="bg-stone-900 text-white font-black">
                          <td className="border border-stone-800 p-3 sticky left-0 bg-stone-900 z-10 w-12 min-w-[48px]">C</td>
                          <td className="border border-stone-800 p-3 sticky left-[48px] bg-stone-900 z-10 align-top uppercase tracking-widest w-[200px] min-w-[200px]">SALDO AKHIR ( A - B)</td>
                          {detailReportData.surplusBank.map((val, i) => (
                            <td key={i} className="border border-stone-800 p-3 text-right">
                              {val === 0 ? '-' : (val < 0 ? `(${Math.round(Math.abs(val)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                            </td>
                          ))}
                          <td className="border border-stone-800 p-3 text-right bg-white/10">
                            {detailReportData.surplusGrandTotal === 0 ? '-' : (detailReportData.surplusGrandTotal < 0 ? `(${Math.round(Math.abs(detailReportData.surplusGrandTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(detailReportData.surplusGrandTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                          </td>
                        </tr>

                        <tr className="bg-stone-100 font-black">
                          <td className="border border-stone-200 p-3 sticky left-0 bg-stone-100 z-10 w-12 min-w-[48px]">D</td>
                          <td className="border border-stone-200 p-3 sticky left-[48px] bg-stone-100 z-10 align-top uppercase tracking-widest w-[200px] min-w-[200px]">SALDO AWAL</td>
                          {detailReportData.saldoAwalBank.map((val, i) => (
                            <td key={i} className="border border-stone-200 p-3 text-right">
                              {val === 0 ? '-' : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </td>
                          ))}
                          <td className="border border-stone-200 p-3 text-right bg-stone-200/50">
                            {Number(detailReportData.saldoAwalTotal || 0) === 0 ? '-' : Math.round(Number(detailReportData.saldoAwalTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>

                        <tr className="bg-[#D36125] text-white font-black">
                          <td className="border border-[#D36125] p-3 sticky left-0 bg-[#D36125] z-10 w-12 min-w-[48px]">E</td>
                          <td className="border border-[#D36125] p-3 sticky left-[48px] bg-[#D36125] z-10 align-top uppercase tracking-widest w-[200px] min-w-[200px]">KAS & SETARA KAS ( C + D)</td>
                          {detailReportData.kasSetaraKasBank.map((val, i) => (
                            <td key={i} className="border border-[#D36125] p-3 text-right">
                              {val === 0 ? '-' : (val < 0 ? `(${Math.round(Math.abs(val)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(val).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                            </td>
                          ))}
                          <td className="border border-[#D36125] p-3 text-right bg-white/10">
                            {detailReportData.kasSetaraKasTotal === 0 ? '-' : (detailReportData.kasSetaraKasTotal < 0 ? `(${Math.round(Math.abs(detailReportData.kasSetaraKasTotal)).toLocaleString('id-ID', { maximumFractionDigits: 0 })})` : Math.round(detailReportData.kasSetaraKasTotal).toLocaleString('id-ID', { maximumFractionDigits: 0 }))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transaksi-bank' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm mb-12 overflow-hidden">
                <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 rounded-t-[2rem] gap-6">
                  <div>
                    <h3 className="text-xl font-black text-[#133838] uppercase">Detail Transaksi Bank</h3>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">Daftar riwayat transaksi keuangan via Bank</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Bank Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bank:</span>
                      <select 
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                      >
                        {banks.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>

                    {/* Month Filter */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bulan:</span>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                      >
                        <option value="all">SEMUA BULAN</option>
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="scrollbar-hide overflow-x-auto">
                  <table className="w-full text-[11px] border-separate border-spacing-0 min-w-[1000px]">
                    <thead className="sticky top-0 z-30">
                      <tr className="bg-stone-50">
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-0 top-0 bg-stone-50 z-50 w-[100px] min-w-[100px]">Tanggal</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-[100px] top-0 bg-stone-50 z-50 w-[300px] min-w-[300px]">Uraian / Keterangan</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Kategori</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Bank</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-emerald-600">Masuk</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-[#D36125]">Keluar</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-blue-600">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {transactionsForTable.map((t, i) => {
                        const isNewBank = i > 0 && t.bank !== transactionsForTable[i - 1].bank;
                        return (
                          <React.Fragment key={i}>
                            {isNewBank && (
                              <tr className="bg-stone-50/30">
                                <td colSpan={7} className="p-0">
                                  <div className="flex items-center gap-2 px-4 py-2">
                                    <div className="h-px bg-stone-200 flex-1" />
                                    <span className="text-[8px] font-black text-stone-300 uppercase tracking-[0.3em]">Grouping per Bank</span>
                                    <div className="h-px bg-stone-200 flex-1" />
                                  </div>
                                </td>
                              </tr>
                            )}
                            <tr 
                              data-highlighted={isHighlighted(t) ? "true" : "false"}
                              className={cn(
                                "transition-all duration-500 group",
                                isHighlighted(t) ? "bg-orange-50 ring-2 ring-inset ring-orange-200" : "hover:bg-stone-50/50"
                              )}>
                              <td className={cn(
                                "p-4 font-bold text-stone-500 whitespace-nowrap sticky left-0 z-10 transition-colors w-[100px] min-w-[100px]",
                                isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                              )}>
                                {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className={cn(
                                "p-4 sticky left-[100px] z-10 transition-colors w-[300px] min-w-[300px]",
                                isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                              )}>
                                <p className="font-bold text-[#133838] uppercase tracking-tight leading-tight">{t.description}</p>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md font-bold text-[10px] uppercase tracking-widest">
                                  {t.category}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-1 bg-[#133838]/5 text-[#133838] rounded-md font-bold text-[10px] uppercase tracking-widest">
                                  {t.bank}
                                </span>
                              </td>
                              <td className={cn("p-4 text-right font-black text-[13px]", (isSaldoAwal(t) || t.isVirtual) ? "text-white" : "text-emerald-600")}>
                                {t.type === 'Income' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                              </td>
                              <td className="p-4 text-right font-black text-[13px] text-[#D36125]">
                                {t.type === 'Expense' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                              </td>
                              <td className="p-4 text-right font-black text-[13px] text-blue-600">
                                Rp {t.runningBalance.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                      {transactionsForTable.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3 opacity-20">
                              <RefreshCw className="w-8 h-8" />
                              <p className="font-black uppercase tracking-widest">Tidak ada data transaksi</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'transaksi-kas' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm mb-12 overflow-hidden">
                <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 rounded-t-[2rem] gap-6">
                  <div>
                    <h3 className="text-xl font-black text-[#133838] uppercase">Detail Transaksi Kas</h3>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">Daftar riwayat transaksi keuangan Tunai (KAS)</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Month Filter */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bulan:</span>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                      >
                        <option value="all">SEMUA BULAN</option>
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="scrollbar-hide overflow-x-auto">
                  <table className="w-full text-[11px] border-separate border-spacing-0 min-w-[1000px]">
                    <thead className="sticky top-0 z-30">
                      <tr className="bg-stone-50">
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-0 top-0 bg-stone-50 z-50 w-[100px] min-w-[100px]">Tanggal</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-[100px] top-0 bg-stone-50 z-50 w-[300px] min-w-[300px]">Uraian / Keterangan</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Kategori</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Jenis</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-emerald-600">Masuk</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-[#D36125]">Keluar</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-blue-600">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {kasTransactionsForTable.map((t, i) => {
                        return (
                          <tr 
                            key={i} 
                            data-highlighted={isHighlighted(t) ? "true" : "false"}
                            className={cn(
                              "transition-all duration-500 group",
                              isHighlighted(t) ? "bg-orange-50 ring-2 ring-inset ring-orange-200" : "hover:bg-stone-50/50"
                            )}>
                            <td className={cn(
                              "p-4 font-bold text-stone-500 whitespace-nowrap sticky left-0 z-10 transition-colors w-[100px] min-w-[100px]",
                              isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                            )}>
                              {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className={cn(
                              "p-4 sticky left-[100px] z-10 transition-colors w-[300px] min-w-[300px]",
                              isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                            )}>
                              <p className="font-bold text-[#133838] uppercase tracking-tight leading-tight">{t.description}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md font-bold text-[10px] uppercase tracking-widest">
                                {t.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-[#133838]/5 text-[#133838] rounded-md font-bold text-[10px] uppercase tracking-widest">
                                KAS
                              </span>
                            </td>
                            <td className={cn("p-4 text-right font-black text-[13px]", (isSaldoAwal(t) || t.isVirtual) ? "text-white" : "text-emerald-600")}>
                              {t.type === 'Income' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="p-4 text-right font-black text-[13px] text-[#D36125]">
                              {t.type === 'Expense' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="p-4 text-right font-black text-[13px] text-blue-600">
                              Rp {t.runningBalance.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}
                      {kasTransactionsForTable.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3 opacity-20">
                              <RefreshCw className="w-8 h-8" />
                              <p className="font-black uppercase tracking-widest">Tidak ada data transaksi kas</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'transaksi-deposito' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm mb-12 overflow-hidden">
                <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 rounded-t-[2rem] gap-6">
                  <div>
                    <h3 className="text-xl font-black text-[#133838] uppercase">Detail Transaksi Deposito</h3>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">Daftar riwayat transaksi Deposito Bank Jateng (DEPO BJT)</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Month Filter */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Bulan:</span>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#133838] focus:outline-none focus:ring-2 focus:ring-[#D36125] shadow-sm cursor-pointer"
                      >
                        <option value="all">SEMUA BULAN</option>
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="scrollbar-hide overflow-x-auto">
                  <table className="w-full text-[11px] border-separate border-spacing-0 min-w-[1000px]">
                    <thead className="sticky top-0 z-30">
                      <tr className="bg-stone-50">
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-0 top-0 bg-stone-50 z-50 w-[100px] min-w-[100px]">Tanggal</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500 sticky left-[100px] top-0 bg-stone-50 z-50 w-[300px] min-w-[300px]">Uraian / Keterangan</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Kategori</th>
                        <th className="border-b border-stone-200 p-4 text-left font-black uppercase tracking-wider text-stone-500">Jenis</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-emerald-600">Masuk</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-[#D36125]">Keluar</th>
                        <th className="border-b border-stone-200 p-4 text-right font-black uppercase tracking-wider text-blue-600">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {depositoTransactionsForTable.map((t, i) => {
                        return (
                          <tr 
                            key={i} 
                            data-highlighted={isHighlighted(t) ? "true" : "false"}
                            className={cn(
                              "transition-all duration-500 group",
                              isHighlighted(t) ? "bg-orange-50 ring-2 ring-inset ring-orange-200" : "hover:bg-stone-50/50"
                            )}>
                            <td className={cn(
                              "p-4 font-bold text-stone-500 whitespace-nowrap sticky left-0 z-10 transition-colors w-[100px] min-w-[100px]",
                              isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                            )}>
                              {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className={cn(
                              "p-4 sticky left-[100px] z-10 transition-colors w-[300px] min-w-[300px]",
                              isHighlighted(t) ? "bg-orange-50" : "bg-white group-hover:bg-stone-50"
                            )}>
                              <p className="font-bold text-[#133838] uppercase tracking-tight leading-tight">{t.description}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md font-bold text-[10px] uppercase tracking-widest">
                                {t.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-[#133838]/5 text-[#133838] rounded-md font-bold text-[10px] uppercase tracking-widest">
                                DEPOSITO
                              </span>
                            </td>
                            <td className={cn("p-4 text-right font-black text-[13px]", (isSaldoAwal(t) || t.isVirtual) ? "text-white" : "text-emerald-600")}>
                              {t.type === 'Income' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="p-4 text-right font-black text-[13px] text-[#D36125]">
                              {t.type === 'Expense' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="p-4 text-right font-black text-[13px] text-blue-600">
                              Rp {t.runningBalance.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}
                      {depositoTransactionsForTable.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3 opacity-20">
                              <RefreshCw className="w-8 h-8" />
                              <p className="font-black uppercase tracking-widest">Tidak ada data transaksi deposito</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 py-6 px-8 no-print">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">
              CFM {selectedYear} - PERSI JAWA TENGAH
            </p>
            <div className="flex gap-2">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D36125]/20"></div>
              ))}
            </div>
          </div>
        </footer>
      </div>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 bg-[#133838] text-white rounded-full shadow-lg hover:bg-[#1a4d4d] transition-all z-50 no-print border border-white/10"
          title="Scroll to Top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* Arus Kas Detail Modal */}
      <AnimatePresence>
        {arusKasDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 no-print">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setArusKasDetail(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <h3 className="text-lg font-black text-[#133838] uppercase tracking-tight">Detail: {arusKasDetail.title}</h3>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                    {arusKasSubTab === 'bulanan' ? `${monthNames[selectedArusKasMonth]} ${selectedYear}` : `Tahun ${selectedYear}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setArusKasDetail(null)}
                    className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <table className="w-full text-xs border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="border-b border-stone-200 p-3 text-left font-black uppercase tracking-wider text-stone-500">Tanggal</th>
                      <th className="border-b border-stone-200 p-3 text-left font-black uppercase tracking-wider text-stone-500">Keterangan</th>
                      <th className="border-b border-stone-200 p-3 text-left font-black uppercase tracking-wider text-stone-500">Kategori</th>
                      <th className="border-b border-stone-200 p-3 text-right font-black uppercase tracking-wider text-stone-500">Jumlah</th>
                      <th className="border-b border-stone-200 p-3 text-center font-black uppercase tracking-wider text-stone-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {arusKasDetail.transactions.length > 0 ? (
                      arusKasDetail.transactions.map((t, i) => (
                        <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-3 font-bold text-stone-500 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-[#133838] uppercase tracking-tight">{t.description}</p>
                            <p className="text-[9px] text-stone-400 font-medium uppercase tracking-wider">{t.bank}</p>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded font-bold text-[9px] uppercase tracking-widest">
                              {t.category}
                            </span>
                          </td>
                          <td className={cn("p-3 text-right font-black", t.type === 'Income' ? "text-emerald-600" : "text-red-600")}>
                            <span className="tabular-nums">
                              {t.type === 'Expense' ? '(' : ''}
                              Rp {formatArusKasValue(t.amount).toLocaleString('id-ID')}
                              {t.type === 'Expense' ? ')' : ''}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => handleNavigateToTransaksi(t)}
                              className="p-1.5 hover:bg-[#D36125]/10 text-stone-400 hover:text-[#D36125] rounded-lg transition-all"
                              title="Lihat di Menu Transaksi"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-stone-400 font-bold uppercase tracking-widest opacity-50">
                          Tidak ada data transaksi
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {arusKasDetail.transactions.length > 0 && (
                    <tfoot>
                      <tr className="bg-stone-50/50 font-black">
                        <td colSpan={3} className="p-4 text-right uppercase tracking-widest text-stone-500">Total</td>
                        <td className="p-4 text-right text-[#133838]">
                          <span className="tabular-nums">
                            Rp {formatArusKasValue(arusKasDetail.transactions.reduce((acc, t) => acc + (t.type === 'Income' ? t.amount : -t.amount), 0)).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="p-4"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

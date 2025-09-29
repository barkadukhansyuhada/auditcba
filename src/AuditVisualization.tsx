import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, FileText, TrendingDown } from 'lucide-react';

const AuditVisualization = () => {
  const [activeTab, setActiveTab] = useState('flow');
  const [expandedSections, setExpandedSections] = useState({});
  const [auditData, setAuditData] = useState([
    { id: 1, kategori: 'Dana masuk investor', jumlah: 3000000000, keterangan: 'Rekening koran', noBukti: 'RK-001-2024', tanggal: '2024-01-15', status: 'verified' },
    { id: 2, kategori: 'Beli material pasir', jumlah: 450000000, keterangan: 'Invoice PT Maju Jaya', noBukti: 'INV-MJ-2024-001', tanggal: '2024-02-10', status: 'verified' },
    { id: 3, kategori: 'Beli material semen', jumlah: 350000000, keterangan: 'Invoice PT Semen Sejahtera', noBukti: 'INV-SS-2024-005', tanggal: '2024-02-15', status: 'verified' },
    { id: 4, kategori: 'Deposit makelar quarry A', jumlah: 600000000, keterangan: 'Transfer ke Tn. Ahmad', noBukti: 'TRF-001', tanggal: '2024-03-01', status: 'risk' },
    { id: 5, kategori: 'Deposit makelar quarry B', jumlah: 600000000, keterangan: 'Transfer ke Tn. Budi', noBukti: 'TRF-002', tanggal: '2024-03-10', status: 'risk' },
    { id: 6, kategori: 'Transfer ke Exness', jumlah: 650000000, keterangan: 'Trading account', noBukti: 'TRF-EXN-001', tanggal: '2024-03-20', status: 'critical' },
    { id: 7, kategori: 'Gaji karyawan', jumlah: 150000000, keterangan: 'Payroll 3 bulan', noBukti: 'PAY-Q1-2024', tanggal: '2024-01-31', status: 'verified' },
    { id: 8, kategori: 'Biaya operasional', jumlah: 100000000, keterangan: 'Transport, konsumsi, dll', noBukti: 'OP-Q1-2024', tanggal: '2024-03-31', status: 'partial' },
    { id: 9, kategori: 'Sisa kas di bank', jumlah: 100000000, keterangan: 'Saldo rekening', noBukti: 'RK-002-2024', tanggal: '2024-04-01', status: 'verified' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newRow, setNewRow] = useState({ kategori: '', jumlah: '', keterangan: '', noBukti: '', tanggal: '', status: 'verified' });
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditForm({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setAuditData(auditData.map(row => 
      row.id === editingId ? { ...editForm } : row
    ));
    setEditingId(null);
    setEditForm({});
  };

  const deleteRow = (id) => {
    if (window.confirm('Hapus data ini?')) {
      setAuditData(auditData.filter(row => row.id !== id));
    }
  };

  const addNewRow = () => {
    if (!newRow.kategori || !newRow.jumlah) {
      alert('Kategori dan Jumlah harus diisi!');
      return;
    }
    const newId = Math.max(...auditData.map(r => r.id), 0) + 1;
    setAuditData([...auditData, { ...newRow, id: newId, jumlah: parseFloat(newRow.jumlah) }]);
    setNewRow({ kategori: '', jumlah: '', keterangan: '', noBukti: '', tanggal: '', status: 'verified' });
    setShowAddForm(false);
  };

  const getTotalDana = () => {
    return auditData.reduce((sum, row) => {
      if (row.kategori.toLowerCase().includes('masuk') || row.kategori.toLowerCase().includes('sisa')) {
        return sum;
      }
      return sum + row.jumlah;
    }, 0);
  };

  const getDanaMasuk = () => {
    return auditData.find(row => row.kategori.toLowerCase().includes('masuk'))?.jumlah || 0;
  };

  const getSisaDana = () => {
    return auditData.find(row => row.kategori.toLowerCase().includes('sisa'))?.jumlah || 0;
  };

  // Generate mapping dana dari audit data
  const generateDanaMapping = () => {
    const danaMasuk = getDanaMasuk();
    
    // Group by kategori utama
    const grouped = {};
    auditData.forEach(row => {
      if (row.kategori.toLowerCase().includes('masuk')) return;
      
      let mainCategory = row.kategori;
      
      // Grouping logic
      if (row.kategori.toLowerCase().includes('material') || row.kategori.toLowerCase().includes('beli')) {
        mainCategory = 'Pembelian Material';
      } else if (row.kategori.toLowerCase().includes('makelar') || row.kategori.toLowerCase().includes('quarry')) {
        mainCategory = 'Deposit Makelar Quarry';
      } else if (row.kategori.toLowerCase().includes('exness') || row.kategori.toLowerCase().includes('trading')) {
        mainCategory = 'Trading Exness';
      } else if (row.kategori.toLowerCase().includes('gaji') || row.kategori.toLowerCase().includes('operasional')) {
        mainCategory = 'Biaya Operasional';
      } else if (row.kategori.toLowerCase().includes('sisa') || row.kategori.toLowerCase().includes('kas')) {
        mainCategory = 'Sisa Kas';
      }
      
      if (!grouped[mainCategory]) {
        grouped[mainCategory] = {
          kategori: mainCategory,
          jumlah: 0,
          items: [],
          status: row.status
        };
      }
      
      grouped[mainCategory].jumlah += row.jumlah;
      grouped[mainCategory].items.push(row);
      
      // Set status priority (critical > risk > partial > verified)
      if (row.status === 'critical') grouped[mainCategory].status = 'critical';
      else if (row.status === 'risk' && grouped[mainCategory].status !== 'critical') grouped[mainCategory].status = 'risk';
      else if (row.status === 'partial' && !['critical', 'risk'].includes(grouped[mainCategory].status)) grouped[mainCategory].status = 'partial';
    });
    
    // Convert to array and calculate percentages
    return Object.values(grouped).map(item => ({
      ...item,
      persentase: danaMasuk > 0 ? (item.jumlah / danaMasuk) * 100 : 0,
      keterangan: `${item.items.length} transaksi`
    }));
  };

  const danaMapping = generateDanaMapping();

  const auditSteps = [
    {
      no: 1,
      title: 'Kumpulkan Dokumen Keuangan',
      items: ['Rekening koran 3-6 bulan', 'Buku kas perusahaan', 'Bukti transaksi lengkap', 'Kontrak pihak ketiga', 'Catatan deposit investor'],
      priority: 'high'
    },
    {
      no: 2,
      title: 'Mapping Dana 3 Miliar',
      items: ['Buat tabel dana masuk-keluar', 'Kategorisasi penggunaan', 'Identifikasi sisa/defisit', 'Cross-check dengan bukti'],
      priority: 'high'
    },
    {
      no: 3,
      title: 'Audit Khusus: Makelar Quarry',
      items: ['Identitas makelar lengkap', 'Validasi kontrak/nota', 'Cek surat jalan material', 'Potensi penagihan'],
      priority: 'critical'
    },
    {
      no: 4,
      title: 'Audit Trading Exness',
      items: ['Total transfer ke Exness', 'Bukti transfer bank', 'Statement akun trading', 'Potensi withdrawal'],
      priority: 'critical'
    },
    {
      no: 5,
      title: 'Audit Kewajiban Investor',
      items: ['Daftar investor & nominal', 'Perjanjian tertulis', 'Status pengembalian', 'ROI yang dijanjikan'],
      priority: 'high'
    }
  ];

  const keyQuestions = [
    'Detail penggunaan dana Rp 3M dari awal sampai sekarang?',
    'Mengapa dana dialihkan ke Exness? Atas persetujuan siapa?',
    'Bukti transfer resmi ke Exness (rekening perusahaan/pribadi)?',
    'Daftar makelar quarry & bukti kontrak tertulis?',
    'Apakah ada material yang sudah dikirim?',
    'Sisa saldo kas saat ini & lokasi rekening?',
    'Rencana manajemen menutup kewajiban investor?'
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'risk': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Audit PT CBA</h1>
            <p className="text-gray-600">Investigasi Dana 3 Miliar Rupiah</p>
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'table' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Tabel Audit
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'flow' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Alur Dana
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'steps' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Langkah Audit
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'questions' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pertanyaan Kunci
          </button>
        </div>
      </div>

      {activeTab === 'table' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tabel Audit Dana Lengkap</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showAddForm ? 'Batal' : '+ Tambah Data'}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Dana Masuk</p>
              <p className="text-2xl font-bold text-blue-800">{formatRupiah(getDanaMasuk())}</p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Total Keluar</p>
              <p className="text-2xl font-bold text-red-800">{formatRupiah(getTotalDana())}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Sisa Kas</p>
              <p className="text-2xl font-bold text-green-800">{formatRupiah(getSisaDana())}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Selisih</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatRupiah(getDanaMasuk() - getTotalDana() - getSisaDana())}
              </p>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-3 text-blue-800">Tambah Data Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Kategori"
                  value={newRow.kategori}
                  onChange={(e) => setNewRow({...newRow, kategori: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Jumlah (Rp)"
                  value={newRow.jumlah}
                  onChange={(e) => setNewRow({...newRow, jumlah: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Keterangan"
                  value={newRow.keterangan}
                  onChange={(e) => setNewRow({...newRow, keterangan: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="No. Bukti"
                  value={newRow.noBukti}
                  onChange={(e) => setNewRow({...newRow, noBukti: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={newRow.tanggal}
                  onChange={(e) => setNewRow({...newRow, tanggal: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={newRow.status}
                  onChange={(e) => setNewRow({...newRow, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="verified">Verified</option>
                  <option value="partial">Partial</option>
                  <option value="risk">Risk</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addNewRow}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewRow({ kategori: '', jumlah: '', keterangan: '', noBukti: '', tanggal: '', status: 'verified' });
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">No</th>
                  <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-right font-semibold">Jumlah (Rp)</th>
                  <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-left font-semibold">No. Bukti</th>
                  <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {auditData.map((row, index) => (
                  <tr key={row.id} className={`border-b border-gray-200 hover:bg-gray-50 ${
                    editingId === row.id ? 'bg-yellow-50' : ''
                  }`}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editForm.kategori}
                          onChange={(e) => setEditForm({...editForm, kategori: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{row.kategori}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === row.id ? (
                        <input
                          type="number"
                          value={editForm.jumlah}
                          onChange={(e) => setEditForm({...editForm, jumlah: parseFloat(e.target.value)})}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="font-bold text-gray-900">{formatRupiah(row.jumlah)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editForm.keterangan}
                          onChange={(e) => setEditForm({...editForm, keterangan: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600 text-sm">{row.keterangan}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editForm.noBukti}
                          onChange={(e) => setEditForm({...editForm, noBukti: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600 text-sm font-mono">{row.noBukti}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          type="date"
                          value={editForm.tanggal}
                          onChange={(e) => setEditForm({...editForm, tanggal: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600 text-sm">{row.tanggal}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === row.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="verified">Verified</option>
                          <option value="partial">Partial</option>
                          <option value="risk">Risk</option>
                          <option value="critical">Critical</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                          {row.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm font-medium"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => startEdit(row)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="2" className="px-4 py-3 text-right">TOTAL PENGELUARAN:</td>
                  <td className="px-4 py-3 text-right text-lg text-red-600">{formatRupiah(getTotalDana())}</td>
                  <td colSpan="5"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="font-bold text-lg mb-2 text-blue-800">📝 Cara Penggunaan</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Klik <strong>Edit</strong> untuk mengubah data transaksi</li>
              <li>• Klik <strong>Hapus</strong> untuk menghapus data (akan ada konfirmasi)</li>
              <li>• Klik <strong>+ Tambah Data</strong> untuk menambah transaksi baru</li>
              <li>• Summary cards di atas menampilkan total dana masuk, keluar, sisa, dan selisih</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mapping Dana 3 Miliar</h2>
            
            <div className="space-y-3">
              {danaMapping.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className={`border-2 rounded-lg p-4 ${getStatusColor(item.status)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.kategori}</h3>
                        <p className="text-sm opacity-75">{item.keterangan}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">{formatRupiah(item.jumlah)}</p>
                        <p className="text-sm opacity-75">{item.persentase.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mt-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          item.status === 'verified' ? 'bg-green-600' :
                          item.status === 'partial' ? 'bg-yellow-600' :
                          item.status === 'risk' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${item.persentase}%` }}
                      />
                    </div>
                  </div>
                  
                  {idx < danaMapping.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Status Legenda
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Verified - Terdokumentasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Partial - Perlu Konfirmasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Risk - Validitas Diragukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Critical - Investigasi Prioritas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-600" />
              Area Kritis yang Perlu Investigasi
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Trading Exness - Rp 650 Juta</h3>
                <p className="text-sm text-red-700 mt-1">
                  Perlu bukti transfer bank & statement akun. Potensi penggelapan jika tidak ada dokumentasi.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                <h3 className="font-bold text-orange-800">Makelar Quarry - Rp 1,2 Miliar</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Validasi identitas makelar, kontrak, dan surat jalan material. Potensi penagihan kembali.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Langkah-Langkah Audit</h2>
          <div className="space-y-4">
            {auditSteps.map((step) => (
              <div key={step.no} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(`step-${step.no}`)}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${getPriorityColor(step.priority)} text-white flex items-center justify-center font-bold`}>
                      {step.no}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{step.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      step.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {step.priority.toUpperCase()}
                    </span>
                  </div>
                  {expandedSections[`step-${step.no}`] ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {expandedSections[`step-${step.no}`] && (
                  <div className="p-4 bg-white">
                    <ul className="space-y-2">
                      {step.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="font-bold text-lg mb-2 text-green-800">🎯 Target Hasil Audit</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Neraca sederhana: Uang masuk – Uang keluar = Sisa/Defisit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Daftar pihak ketiga yang bisa ditagih (makelar)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Bukti sahih dana masuk Exness atau justru rekayasa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Dasar hukum & data untuk keputusan RUPS</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pertanyaan Kunci untuk Dirut</h2>
          <div className="space-y-3">
            {keyQuestions.map((question, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-800 flex-1">{question}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              Catatan Penting
            </h3>
            <p className="text-sm text-yellow-800">
              Semua jawaban harus didukung dengan dokumen fisik atau digital yang dapat diverifikasi. 
              Jawaban verbal tanpa bukti tidak dapat diterima sebagai bukti audit yang sah.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">💡 Prinsip Audit: SSOT</h3>
        <p className="text-blue-100">
          <strong>Single Source of Truth</strong> - Setiap klaim harus didukung oleh satu sumber dokumen yang dapat diverifikasi dan tidak dapat diperdebatkan.
        </p>
      </div>
    </div>
  );
};

export default AuditVisualization;
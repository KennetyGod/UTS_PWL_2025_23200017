"use client";
import styles from './PackagePage.module.css';
import { useEffect, useState } from 'react';

export default function PackagePage() {

  const [formVisible, setFormVisible] = useState(false);
  const [paket, setPaket] = useState([]);
  const [kode, setKode ] = useState('');
  const [nama, setNama ] = useState('');
  const [description, setDescription ]= useState('');
  const [msg, setMsg ] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchPackage = async () => {
    const res = await fetch('/api/package');
    const data = await res.json();
    setPaket(data);
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/package/${editId}` : '/api/package';
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'applicaton/json' },
        body: JSON.stringify({ kode, nama, description}),
    });

    if (res.ok) {
        setMsg('Berhasil disimpan');
        setKode('');
        setNama('');
        setDescription('');
        setEditId(null);
        setFormVisible(false);
        fetchPackage();
    } else {
        setMsg('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
        setKode(item.kode);
        setNama(item.nama);
        setDescription(item.description);
        setEditId(item.id);
        setFormVisible(true);
  }

  const handleDelete = async (id) => {
    if (!confirm('yakin hapus data ini?')) return;

    await fetch(`/api/package/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id})
    });

    fetchPackage();
  };

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input Data Baru</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Kode</span>
                    <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    placeholder="Masukkan Kode"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Nama</span>
                    <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan Nama"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>deskripsi</span>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsi"
                        required
                    />
                </div>
                <button type="submit">
                    Simpan
                </button>
                <p>{msg}</p>
                </form>
            </div>
        )}

        <div className={styles.tableWrapper}>
            <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {paket.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.kode}</td>
                            <td>{item.nama}</td>
                            <td>{item.deskripsi}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                    {paket.at.length === 0 && (
                        <tr>
                            <td colSpan="7">Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}

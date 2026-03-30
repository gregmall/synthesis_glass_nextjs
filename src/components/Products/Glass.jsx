import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { Button, Input } from "@material-tailwind/react"
import { db } from '../../config/Config';
import { Link, useSearchParams } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner';

const PAGE_SIZE = 20;

const FILTER_OPTIONS = [
  { value: '', label: 'ALL' },
  { value: 'chillum', label: 'CHILLUMS' },
  { value: 'pipe', label: 'PIPES' },
  { value: 'bowl', label: 'BOWLS' },
];

const VORTEX_COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'white'];

const GlassCard = memo(({ item }) => (
  <Link to={`/item/${item.ID}`}>
    <div className='max-w-sm rounded overflow-hidden shadow-lg bg-slate-50 mx-3 my-3 hover:bg-fuchsia-400 ease-in-out duration-100'>
      <img className='w-full p-4 rounded' src={item.ProductImage} alt={item.ProductName} loading="lazy" />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{item.ProductName}</div>
        <span className='text-xl mb-2'>${item.ProductPrice}</span>
      </div>
    </div>
  </Link>
));

const Glass = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const filtered = searchParams.get('filter') ?? '';
  const searchTerm = searchParams.get('search') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const setParam = useCallback((updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined) next.delete(k);
        else next.set(k, String(v));
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const onSearchChange = useCallback((e) => {
    setParam({ search: e.target.value, page: null });
  }, [setParam]);

  const handleFilterChange = useCallback((value) => {
    setParam({ filter: value, page: null });
  }, [setParam]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const products = await db.collection('Products').get();
        setItems(products.docs.map(snap => ({ ...snap.data(), ID: snap.id })));
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return items.filter(item => {
      const matchesSearch = !search ||
        item.ProductName?.toLowerCase().includes(search) ||
        item.ProductDescription?.toLowerCase().includes(search);
      const matchesType = !filtered || item?.Type === filtered;
      return matchesSearch && matchesType;
    });
  }, [items, searchTerm, filtered]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  const pagedItems = useMemo(
    () => filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredItems, page]
  );

  return (
    <>
      <div className='w-72 flex-col items-center justify-center mx-auto mt-10 mb-10 text-color-black bg-white rounded-lg p-1'>
        <Input label="Search items..." value={searchTerm} placeholder="Search by type, color, theme, etc..." onChange={onSearchChange} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: '30px',
          marginBottom: '30px',
        }}
      >
        {FILTER_OPTIONS.map(option => (
          <Button
            key={option.value || 'all'}
            color={filtered === option.value ? 'white' : 'blue'}
            onClick={() => handleFilterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          overflowX: 'auto',
        }}
      >
        {loading ? (
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperClass="vortex-wrapper"
            colors={VORTEX_COLORS}
          />
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          pagedItems.map(item => <GlassCard key={item.ID} item={item} />)
        )}
      </div>
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '30px 0' }}>
          <Button color="blue" disabled={page === 1} onClick={() => setParam({ page: page - 1 })}>
            Prev
          </Button>
          <span style={{ color: 'white' }}>Page {page} of {totalPages}</span>
          <Button color="blue" disabled={page === totalPages} onClick={() => setParam({ page: page + 1 })}>
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default Glass;

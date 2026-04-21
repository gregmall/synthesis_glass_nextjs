'use client'
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { Button, Input } from "@material-tailwind/react"
import { db } from '../../config/Config';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import { Vortex } from 'react-loader-spinner';

const PAGE_SIZE = 20;

const FILTER_OPTIONS = [
  { value: '', label: 'ALL' },
  { value: 'chillum', label: 'CHILLUMS' },
  { value: 'pipe', label: 'PIPES' },
  { value: 'bowl', label: 'BOWLS' },
];

const VORTEX_COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'white'];

// Module-level cache — persists across client-side route changes for the session
let productCache = null;

const GlassCard = memo(({ item }) => (
  <Link href={`/item/${item.ID}`}>
    <div className='rounded overflow-hidden shadow-lg bg-slate-50 hover:bg-fuchsia-400 ease-in-out duration-100 flex flex-col'>
      <div className='aspect-square overflow-hidden'>
        <img
          className='w-full h-full object-cover p-4 rounded'
          src={item.ProductImage}
          alt={item.ProductName}
          loading="lazy"
        />
      </div>
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{item.ProductName}</div>
        <span className='text-xl mb-2'>${item.ProductPrice}</span>
      </div>
    </div>
  </Link>
));
GlassCard.displayName = 'GlassCard';

const Glass = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const filtered = searchParams.get('filter') ?? '';
  const searchTerm = searchParams.get('search') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const [inputValue, setInputValue] = useState(searchTerm);

  // Sync input with URL on back/forward navigation
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const setParam = useCallback((updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    router.replace(`/glass?${next.toString()}`);
  }, [router, searchParams]);

  const onSearchSubmit = useCallback(() => {
    setParam({ search: inputValue, page: null });
  }, [setParam, inputValue]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter') onSearchSubmit();
  }, [onSearchSubmit]);

  const handleFilterChange = useCallback((value) => {
    setParam({ filter: value, page: null });
  }, [setParam]);

  useEffect(() => {
    if (productCache) {
      setItems(productCache);
      setLoading(false);
      return;
    }
    const getItems = async () => {
      try {
        const products = await db.collection('Products').get();
        const data = products.docs.map(snap => ({ ...snap.data(), ID: snap.id }));
        productCache = data;
        setItems(data);
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
      {/* Sticky toolbar */}
      <div className='sticky top-16 z-40 bg-gradient-to-r from-[#762a99] to-[#7c0747] shadow-md px-4 py-3'>
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3'>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <div className='w-full sm:w-72 bg-white rounded-lg p-1'>
              <Input
                label="Search items..."
                value={inputValue}
                placeholder="Search by type, color, theme, etc..."
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
            <Button color="blue" onClick={onSearchSubmit}>Search</Button>
          </div>
          <div className='flex items-center gap-2 flex-wrap justify-center'>
            {FILTER_OPTIONS.map(option => (
              <Button
                key={option.value || 'all'}
                size="sm"
                color={filtered === option.value ? 'white' : 'blue'}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className='text-center text-white text-2xl font-bold mt-5'>
        All pieces made to order
      </div>
      <div className='text-center text-white font-bold mb-4'>
        Inquire about any customizations
      </div>

      {/* Results count */}
      {!loading && !error && (
        <div className='text-center text-white/70 text-sm mb-4'>
          {filteredItems.length === items.length
            ? `${items.length} items`
            : `${filteredItems.length} of ${items.length} items`}
        </div>
      )}

      {/* Product grid */}
      <div className='max-w-7xl mx-auto px-4'>
        {loading ? (
          <div className='flex justify-center mt-10'>
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperClass="vortex-wrapper"
              colors={VORTEX_COLORS}
            />
          </div>
        ) : error ? (
          <p className='text-red-400 text-center mt-10'>{error}</p>
        ) : pagedItems.length === 0 ? (
          <p className='text-white text-lg text-center mt-10'>
            No items found{searchTerm ? ` for "${searchTerm}"` : ''}{filtered ? ` in ${filtered}s` : ''}.
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6'>
            {pagedItems.map(item => <GlassCard key={item.ID} item={item} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 my-8'>
          <Button color="blue" disabled={page === 1} onClick={() => setParam({ page: page - 1 })}>
            Prev
          </Button>
          <span className='text-white'>Page {page} of {totalPages}</span>
          <Button color="blue" disabled={page === totalPages} onClick={() => setParam({ page: page + 1 })}>
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default Glass;

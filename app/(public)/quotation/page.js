'use client';

import React, { useMemo, useRef, useState } from 'react';

function SectionHeading({ heading, paragraph }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3460]">{heading}</h1>
      {paragraph ? <p className="text-slate-600">{paragraph}</p> : null}
    </div>
  );
}

function makeItem() {
  return { id: Math.random().toString(36).slice(2), name: '', qty: 1, unit: '', unitPrice: 0 };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export default function QuotationPage() {
  // ---------- Form state ----------
  const [form, setForm] = useState({
    orgName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    projectName: '',
    dueDate: '', // yyyy-mm-dd
    includeVat: true,
    consent: false,
    items: [makeItem()],
  });

  // Files
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  // Validation
  const [touched, setTouched] = useState({});
  const [itemTouched, setItemTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(1);

  function pushToast(t) {
    setToasts((prev) => [
      ...prev,
      { id: toastIdRef.current++, variant: t.variant || 'info', title: t.title, message: t.message },
    ]);
  }
  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function setItem(i, patch) {
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], ...patch };
      return { ...f, items };
    });
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, makeItem()] }));
  }

  function removeItem(i) {
    setForm((f) => {
      const items = [...f.items];
      items.splice(i, 1);
      return { ...f, items };
    });
  }

  function lineTotal(it) {
    const qty = Number(it.qty) || 0;
    const up = Number(it.unitPrice) || 0;
    return qty * up;
  }

  const subtotal = useMemo(
    () => form.items.reduce((s, it) => s + lineTotal(it), 0),
    [form.items]
  );
  const vat = useMemo(() => (form.includeVat ? subtotal * 0.07 : 0), [form.includeVat, subtotal]);
  const total = useMemo(() => (form.includeVat ? subtotal + vat : subtotal), [form.includeVat, subtotal, vat]);

  function currency(n) {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  }
  function prettySize(n) {
    const kb = n / 1024;
    return kb > 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(0) + ' KB';
  }

  function touch(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }
  function touchItem(i, field) {
    const key = form.items[i]?.id;
    if (!key) return;
    setItemTouched((obj) => ({
      ...obj,
      [key]: { ...(obj[key] || {}), [field]: true },
    }));
  }

  function setItemErr(idx, field) {
    const key = `item_${idx}_${field}`;
    setErrors((e) => ({ ...e, [key]: 'invalid' }));
  }

  function hasError(field) {
    return !!errors[field];
  }
  function showError(field) {
    return hasError(field) && (touched[field] || submitAttempted);
  }
  function hasItemError(i, field) {
    return !!errors[`item_${i}_${field}`];
  }
  function showItemError(i, field) {
    const key = form.items[i]?.id;
    return hasItemError(i, field) && ((key && itemTouched[key]?.[field]) || submitAttempted);
  }

  function validate() {
    const nextErrors = {};

    // required
    if (!form.orgName || form.orgName.trim().length < 2) nextErrors.orgName = 'กรอกชื่อหน่วยงานให้ถูกต้อง';
    if (!form.contactName) nextErrors.contactName = 'กรอกชื่อผู้ติดต่อ';

    // contact method: at least one
    if (!form.phone && !form.email) {
      nextErrors.phone = 'กรอกอย่างน้อย 1 ช่องทาง';
      nextErrors.email = 'กรอกอย่างน้อย 1 ช่องทาง';
    }
    // phone format
    if (form.phone && !/^0\d{8,9}$/.test(form.phone)) nextErrors.phone = 'กรอกเบอร์รูปแบบ 0XXXXXXXXX';
    // email format
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

    // project
    if (!form.projectName) nextErrors.projectName = 'กรอกรายละเอียดงาน';

    // dueDate (optional but if filled must be today or future)
    if (form.dueDate) {
      const d = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) nextErrors.dueDate = 'วันที่ต้องไม่น้อยกว่าวันนี้';
    }

    // items
    if (!form.items.length) nextErrors.items = 'เพิ่มรายการสินค้า/บริการอย่างน้อย 1 รายการ';
    form.items.forEach((it, idx) => {
      if (!it.name) nextErrors[`item_${idx}_name`] = 'invalid';
      if (!it.unit) nextErrors[`item_${idx}_unit`] = 'invalid';
      if (!(it.qty && it.qty > 0)) nextErrors[`item_${idx}_qty`] = 'invalid';
      if (!(it.unitPrice != null && it.unitPrice >= 0)) nextErrors[`item_${idx}_unitPrice`] = 'invalid';
    });

    // consent
    if (!form.consent) nextErrors.consent = 'กรุณายอมรับเงื่อนไขการติดต่อและใช้งานข้อมูล';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onFilesSelected(e) {
    const list = e.target.files;
    if (!list) return;
    const newOnes = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_SIZE) {
        pushToast({ variant: 'error', title: 'ไฟล์ใหญ่เกินไป', message: `${f.name} เกิน 10MB` });
        continue;
      }
      if (!ALLOWED.includes(f.type)) {
        pushToast({ variant: 'error', title: 'ชนิดไฟล์ไม่รองรับ', message: f.name });
        continue;
      }
      newOnes.push(f);
    }
    setFiles((prev) => [...prev, ...newOnes]);
    e.target.value = '';
  }
  function removeFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);
    const ok = validate();
    if (!ok) {
      pushToast({ variant: 'error', title: 'กรอกข้อมูลไม่ครบถ้วน', message: 'โปรดตรวจสอบช่องที่มีข้อความแจ้งเตือนสีแดง' });
      return;
    }
    setSubmitting(true);
    try {
      // TODO: เรียก API จริงของคุณ เช่น:
      // await fetch('/api/quotation', { method:'POST', body: formData });
      await new Promise((r) => setTimeout(r, 900));
      pushToast({ variant: 'success', title: 'ส่งคำขอเรียบร้อย', message: 'ทีมงานจะติดต่อกลับโดยเร็ว' });
    } finally {
      setSubmitting(false);
    }
  }

  // ใช้ min ของ input date เพื่อกันเลือกวันย้อนหลังใน UI
  const todayStr = useMemo(() => {
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${t.getFullYear()}-${mm}-${dd}`;
  }, []);

  return (
    <section className="quotation-section min-h-screen py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <header className="text-center mb-8 sm:mb-10">
          <SectionHeading heading="ขอใบเสนอราคา" paragraph="กรอกข้อมูลให้ครบถ้วน ทีมงานจะติดต่อกลับพร้อมใบเสนอราคา" />
        </header>

        {/* Grid: form + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form column */}
          <form onSubmit={onSubmit} className="lg:col-span-2">
            {/* Contact info card */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-[#0F3460] mb-4">ข้อมูลผู้ติดต่อ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* orgName */}
                <div className="sm:col-span-2">
                  <label className="form-label" htmlFor="orgName">หน่วยงาน / บริษัท</label>
                  <input
                    id="orgName"
                    value={form.orgName}
                    onChange={(e) => setField('orgName', e.target.value)}
                    onBlur={() => touch('orgName')}
                    aria-invalid={hasError('orgName')}
                    aria-describedby={hasError('orgName') ? 'orgName_err' : undefined}
                    type="text"
                    className="form-input"
                    placeholder="เช่น หจก. เอส ซี เทค (2025)"
                  />
                  {showError('orgName') && <p id="orgName_err" className="form-error">{errors.orgName}</p>}
                </div>

                {/* contactName */}
                <div>
                  <label className="form-label" htmlFor="contactName">ผู้ติดต่อ</label>
                  <input
                    id="contactName"
                    value={form.contactName}
                    onChange={(e) => setField('contactName', e.target.value)}
                    onBlur={() => touch('contactName')}
                    aria-invalid={hasError('contactName')}
                    aria-describedby={hasError('contactName') ? 'contactName_err' : undefined}
                    type="text"
                    className="form-input"
                    placeholder="ชื่อ-นามสกุล"
                  />
                  {showError('contactName') && <p id="contactName_err" className="form-error">{errors.contactName}</p>}
                </div>

                {/* phone */}
                <div>
                  <label className="form-label" htmlFor="phone">เบอร์โทรศัพท์</label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value.replace(/[^\d]/g, ''))}
                    onBlur={() => touch('phone')}
                    aria-invalid={hasError('phone')}
                    aria-describedby={hasError('phone') ? 'phone_err' : undefined}
                    inputMode="tel"
                    type="text"
                    className="form-input"
                    placeholder="0xxxxxxxxx"
                  />
                  {showError('phone') && <p id="phone_err" className="form-error">{errors.phone}</p>}
                </div>

                {/* email */}
                <div>
                  <label className="form-label" htmlFor="email">อีเมล</label>
                  <input
                    id="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    onBlur={() => touch('email')}
                    aria-invalid={hasError('email')}
                    aria-describedby={hasError('email') ? 'email_err' : undefined}
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                  />
                  {showError('email') && <p id="email_err" className="form-error">{errors.email}</p>}
                </div>

                {/* address */}
                <div className="sm:col-span-2">
                  <label className="form-label" htmlFor="address">ที่อยู่สำหรับออกเอกสาร (ถ้ามี)</label>
                  <textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    rows={2}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Project details */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200 mt-6">
              <h2 className="text-lg font-semibold text-[#0F3460] mb-4">รายละเอียดงาน</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="sm:col-span-2">
                  <label className="form-label" htmlFor="projectName">ชื่องาน / รายละเอียดโดยย่อ</label>
                  <input
                    id="projectName"
                    value={form.projectName}
                    onChange={(e) => setField('projectName', e.target.value)}
                    onBlur={() => touch('projectName')}
                    aria-invalid={hasError('projectName')}
                    aria-describedby={hasError('projectName') ? 'projectName_err' : undefined}
                    type="text"
                    className="form-input"
                    placeholder="เช่น ติดตั้งคอมพิวเตอร์เครือข่ายและระบบไฟฟ้าในอาคาร"
                  />
                  {showError('projectName') && <p id="projectName_err" className="form-error">{errors.projectName}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="dueDate">ต้องการภายใน (วันที่)</label>
                  <div className="relative">
                    <input
                      id="dueDate"
                      value={form.dueDate}
                      onChange={(e) => setField('dueDate', e.target.value)}
                      onBlur={() => touch('dueDate')}
                      aria-invalid={hasError('dueDate')}
                      aria-describedby={hasError('dueDate') ? 'dueDate_err' : undefined}
                      type="date"
                      min={todayStr}
                      className="form-input pr-10"
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z" /></svg>
                  </div>
                  {showError('dueDate') && <p id="dueDate_err" className="form-error">{errors.dueDate}</p>}
                </div>

                {/* Upload */}
                <div className="sm:justify-self-start">
                  <label className="form-label">แนบไฟล์ (ถ้ามี)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onFilesSelected}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  />
                  <button
                    type="button"
                    className="btn-secondary mt-1 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.5a.75.75 0 0 0-1.5 0v6.75H5.25a.75.75 0 0 0 0 1.5H12v6.75a.75.75 0 0 0 1.5 0V12.75h6.75a.75.75 0 0 0 0-1.5H13.5V4.5Z" /></svg>
                      แนบไฟล์
                    </span>
                  </button>
                  {!!files.length && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li key={f.name + i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <span className="truncate mr-3">{f.name} ({prettySize(f.size)})</span>
                          <button type="button" className="text-slate-500 hover:text-red-500" onClick={() => removeFile(i)}>ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {showError('files') && <p className="form-error mt-1">{errors.files}</p>}
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0F3460]">รายการสินค้า/บริการ</h2>
                <button type="button" className="btn-secondary cursor-pointer" onClick={addItem}>+ เพิ่มรายการ</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="th">รายการ</th>
                      <th className="th w-24">จำนวน</th>
                      <th className="th w-28">หน่วย</th>
                      <th className="th w-36">ราคาต่อหน่วย</th>
                      <th className="th w-36">ราคารวม</th>
                      <th className="th w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((it, idx) => (
                      <tr key={it.id} className="border-b last:border-b-0">
                        <td className="td">
                          <input
                            value={it.name}
                            onChange={(e) => setItem(idx, { name: e.target.value })}
                            onBlur={() => touchItem(idx, 'name')}
                            aria-invalid={hasItemError(idx, 'name')}
                            type="text" className="form-input" placeholder="เช่น เครื่อง Core i5, งานติดตั้งระบบฯ"
                          />
                          {showItemError(idx, 'name') && <p className="form-error">กรอกชื่อรายการ</p>}
                        </td>
                        <td className="td">
                          <input
                            value={it.qty ?? ''}
                            onChange={(e) => setItem(idx, { qty: e.target.value === '' ? '' : Number(e.target.value) })}
                            onBlur={() => touchItem(idx, 'qty')}
                            aria-invalid={hasItemError(idx, 'qty')}
                            type="number" min="1" step="1" className="form-input text-right"
                          />
                          {showItemError(idx, 'qty') && <p className="form-error">จำนวนต้องมากกว่า 0</p>}
                        </td>
                        <td className="td">
                          <input
                            value={it.unit}
                            onChange={(e) => setItem(idx, { unit: e.target.value })}
                            onBlur={() => touchItem(idx, 'unit')}
                            aria-invalid={hasItemError(idx, 'unit')}
                            type="text" className="form-input" placeholder="ชิ้น / เครื่อง / งาน"
                          />
                          {showItemError(idx, 'unit') && <p className="form-error">กรอกหน่วย</p>}
                        </td>
                        <td className="td">
                          <input
                            value={it.unitPrice ?? ''}
                            onChange={(e) => setItem(idx, { unitPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                            onBlur={() => touchItem(idx, 'unitPrice')}
                            aria-invalid={hasItemError(idx, 'unitPrice')}
                            type="number" min="0" step="0.01" className="form-input text-right"
                          />
                          {showItemError(idx, 'unitPrice') && <p className="form-error">ราคาต่อหน่วยต้องไม่ติดลบ</p>}
                        </td>
                        <td className="td text-right font-medium">{currency(lineTotal(it))}</td>
                        <td className="td text-right">
                          <button type="button" className="text-slate-500 hover:text-red-600" onClick={() => removeItem(idx)} aria-label="ลบรายการ">ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showError('items') && <p className="form-error mt-2">{errors.items}</p>}
            </div>

            {/* Consent + Submit */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200 mt-6">
              <label className="relative flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setField('consent', e.target.checked)}
                  onBlur={() => touch('consent')}
                  aria-invalid={hasError('consent')}
                  className="peer sr-only"
                />
                <span className={`mt-0.5 grid place-items-center h-6 w-6 rounded-md border-2 transition-all
                  ${showError('consent') ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-300'}
                  bg-white shadow-sm peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-[#1E56A0] peer-checked:bg-[#1E56A0] peer-checked:border-[#1E56A0]`}>
                  <svg className="w-4 h-4 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l4 4L19 7" /></svg>
                </span>
                <span className="text-slate-700 leading-6">ยินยอมให้เก็บและใช้ข้อมูลที่กรอกเพื่อการติดต่อกลับและจัดทำใบเสนอราคา</span>
              </label>
              {showError('consent') && <p className="form-error mt-2">{errors.consent}</p>}

              <div className="mt-6 flex justify-center lg:justify-end">
                <button type="submit" className="btn-primary w-full sm:w-auto cursor-pointer" disabled={submitting}>
                  {submitting ? 'กำลังส่ง...' : 'สั่งทำใบเสนอราคา'}
                </button>
              </div>
            </div>
          </form>

          {/* Summary column */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200 sticky top-6">
              <h2 className="text-lg font-semibold text-[#0F3460] mb-4">ยอดรวม</h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-600">ยอดรวมย่อย</span><span className="font-medium">{currency(subtotal)}</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ภาษีมูลค่าเพิ่ม (7%)</span>
                  <span className="font-medium">{currency(vat)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-semibold">ยอดสุทธิ</span>
                <span className="font-semibold text-[#0F3460]">{currency(total)}</span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-slate-700">รวมภาษีมูลค่าเพิ่ม</span>
                <label className="relative inline-flex cursor-pointer select-none items-center">
                  <input
                    type="checkbox"
                    checked={form.includeVat}
                    onChange={(e) => setField('includeVat', e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-slate-300 peer-checked:bg-[#1E56A0] transition-colors"></span>
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 shadow"></span>
                </label>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed top-4 inset-x-0 flex flex-col items-center gap-3 z-[60] px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full max-w-md rounded-xl border shadow-lg p-4 ${t.variant === 'success'
                ? 'bg-emerald-50 border-emerald-200'
                : t.variant === 'error'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {t.variant === 'success' ? (
                  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4.5 4.5L19 7" /></svg>
                ) : t.variant === 'error' ? (
                  <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" /></svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{t.title}</p>
                {t.message && <p className="text-sm text-slate-700 mt-0.5">{t.message}</p>}
              </div>
              <button className="text-slate-500 hover:text-slate-900" onClick={() => dismissToast(t.id)} aria-label="ปิดการแจ้งเตือน">✕</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        
        .form-label { @apply block text-sm font-medium text-slate-700 mb-1; }
        .form-input { @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent; }
        .form-error { @apply mt-1 text-xs text-rose-600; }
        .th { @apply text-left font-medium px-3 py-2; }
        .td { @apply px-3 py-2 align-top; }
        .btn-primary { @apply inline-flex items-center justify-center rounded-xl bg-[#1E56A0] text-white px-5 py-2.5 font-medium shadow-sm hover:bg-[#1b4c8f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E56A0] disabled:opacity-60 disabled:cursor-not-allowed; }
        .btn-secondary { @apply inline-flex items-center justify-center rounded-xl bg-[#ECF4FF] text-[#0F3460] px-4 py-2 font-medium border border-[#D1E0F6] shadow-sm hover:bg-[#DDE9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E56A0]; }
      `}</style>
    </section>
  );
}

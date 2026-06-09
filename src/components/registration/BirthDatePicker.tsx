import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

type PickerView = 'calendar' | 'month' | 'year';

type BirthDatePickerProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

type NavButtonProps = {
  onClick: () => void;
  icon: string;
  label: string;
};

function NavButton({ onClick, icon, label }: NavButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      className='flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition hover:bg-white/70 hover:text-rc-red'>
      <Icon icon={icon} className='h-4 w-4' aria-hidden />
    </button>
  );
}

type VerticalPickerProps = {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
};

function VerticalPicker({ title, onBack, children }: VerticalPickerProps) {
  return (
    <div className='flex flex-col'>
      <div className='mb-3 flex items-center justify-between'>
        <button
          type='button'
          onClick={onBack}
          className='flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-rc-red'>
          <Icon icon='mdi:chevron-left' className='h-4 w-4' aria-hidden />
          Kembali
        </button>
        <span className='text-sm font-semibold text-slate-800'>{title}</span>
        <span className='w-16' aria-hidden />
      </div>
      <div className='max-h-64 overflow-y-auto rounded-xl border border-white/50 bg-white/50 p-1 backdrop-blur-sm'>
        {children}
      </div>
    </div>
  );
}

export function BirthDatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = 'Pilih tanggal lahir Anda (HH/BB/TTTT)',
}: BirthDatePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selectedDate = parseIsoDate(value);
  const initialView =
    selectedDate ?? new Date(today.getFullYear() - 18, today.getMonth(), 1);

  const [open, setOpen] = useState(false);
  const [pickerView, setPickerView] = useState<PickerView>('calendar');
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const minYear = today.getFullYear() - 100;
  const maxYear = today.getFullYear();

  const yearOptions = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i),
    [minYear, maxYear]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (pickerView === 'month' && monthListRef.current) {
      const active = monthListRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'center' });
    }
  }, [pickerView]);

  useEffect(() => {
    if (pickerView === 'year' && yearListRef.current) {
      const active = yearListRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'center' });
    }
  }, [pickerView]);

  const isMonthDisabled = (monthIndex: number, year = viewYear) =>
    year > maxYear ||
    (year === maxYear && monthIndex > today.getMonth()) ||
    year < minYear;

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    if (next.getFullYear() < minYear) return;
    if (
      next.getFullYear() > maxYear ||
      (next.getFullYear() === maxYear && next.getMonth() > today.getMonth())
    ) {
      return;
    }
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const shiftYear = (delta: number) => {
    const nextYear = viewYear + delta;
    if (nextYear < minYear || nextYear > maxYear) return;

    let nextMonth = viewMonth;
    if (nextYear === maxYear && viewMonth > today.getMonth()) {
      nextMonth = today.getMonth();
    }

    setViewYear(nextYear);
    setViewMonth(nextMonth);
  };

  const handleSelect = (date: Date) => {
    onChange(toIsoDate(date));
    setOpen(false);
    setPickerView('calendar');
  };

  const openDialog = () => {
    const base = selectedDate ?? initialView;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setPickerView('calendar');
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setPickerView('calendar');
  };

  const handleSelectMonth = (monthIndex: number) => {
    if (isMonthDisabled(monthIndex)) return;
    setViewMonth(monthIndex);
    setPickerView('calendar');
  };

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    if (year === maxYear && viewMonth > today.getMonth()) {
      setViewMonth(today.getMonth());
    }
    setPickerView('calendar');
  };

  const dialog =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'
            role='dialog'
            aria-modal='true'
            aria-label='Pilih tanggal lahir'>
            <button
              type='button'
              className='absolute inset-0 bg-black/40 backdrop-blur-md'
              aria-label='Tutup kalender'
              onClick={closeDialog}
            />

            <div
              role='document'
              className='relative z-50 w-full max-w-[340px] rounded-[1.25rem] border border-white/70 bg-white/95 p-4 shadow-2xl ring-1 ring-black/5 sm:p-5'
              onClick={(e) => e.stopPropagation()}>
              <button
                type='button'
                onClick={closeDialog}
                aria-label='Tutup'
                className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800'>
                <Icon icon='mdi:close' className='h-5 w-5' aria-hidden />
              </button>

              {pickerView === 'calendar' ? (
                <>
                  <p className='mb-4 pr-8 text-center text-sm font-semibold text-neutral-800'>
                    Pilih Tanggal Lahir
                  </p>

                  <div className='mb-4 grid grid-cols-2 gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-1'>
                    <div className='flex items-center justify-between px-1'>
                      <NavButton
                        onClick={() => shiftMonth(-1)}
                        icon='mdi:chevron-left'
                        label='Bulan sebelumnya'
                      />
                      <button
                        type='button'
                        onClick={() => setPickerView('month')}
                        className='rounded-md px-2 py-1 text-sm font-semibold text-slate-800 transition hover:bg-rc-red/10 hover:text-rc-red'>
                        {MONTH_NAMES[viewMonth]}
                      </button>
                      <NavButton
                        onClick={() => shiftMonth(1)}
                        icon='mdi:chevron-right'
                        label='Bulan berikutnya'
                      />
                    </div>

                    <div className='flex items-center justify-between px-1'>
                      <NavButton
                        onClick={() => shiftYear(-1)}
                        icon='mdi:chevron-left'
                        label='Tahun sebelumnya'
                      />
                      <button
                        type='button'
                        onClick={() => setPickerView('year')}
                        className='rounded-md px-2 py-1 text-sm font-semibold text-slate-800 transition hover:bg-rc-red/10 hover:text-rc-red'>
                        {viewYear}
                      </button>
                      <NavButton
                        onClick={() => shiftYear(1)}
                        icon='mdi:chevron-right'
                        label='Tahun berikutnya'
                      />
                    </div>
                  </div>

                  <div className='mb-2 grid grid-cols-7 gap-1'>
                    {WEEKDAY_LABELS.map((label, index) => (
                      <div
                        key={`${label}-${index}`}
                        className='text-center text-xs font-medium text-slate-500'>
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-7 gap-1'>
                    {calendarDays.map((day) => {
                      const inCurrentMonth = day.getMonth() === viewMonth;
                      const isFuture = day.getTime() > today.getTime();
                      const isSelected = selectedDate
                        ? isSameDay(day, selectedDate)
                        : false;
                      const isToday = isSameDay(day, today);
                      const isDisabled = isFuture || !inCurrentMonth;

                      return (
                        <button
                          key={day.toISOString()}
                          type='button'
                          disabled={isDisabled}
                          onClick={() => handleSelect(day)}
                          className={cn(
                            'mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition duration-150',
                            isSelected
                              ? 'bg-rc-red font-semibold text-white shadow-sm'
                              : isToday
                                ? 'bg-rc-red/15 font-medium text-rc-red ring-1 ring-rc-red/40'
                                : inCurrentMonth
                                  ? 'text-neutral-800 hover:scale-105 hover:bg-rc-red/10 hover:text-rc-red hover:shadow-sm'
                                  : 'text-neutral-300',
                            isDisabled &&
                              'cursor-not-allowed opacity-40 hover:scale-100 hover:bg-transparent hover:text-neutral-300 hover:shadow-none'
                          )}>
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {pickerView === 'month' ? (
                <VerticalPicker
                  title='Pilih Bulan'
                  onBack={() => setPickerView('calendar')}>
                  <div ref={monthListRef} className='flex flex-col gap-0.5'>
                    {MONTH_NAMES.map((monthName, index) => {
                      const disabled = isMonthDisabled(index);
                      const isActive = index === viewMonth;

                      return (
                        <button
                          key={monthName}
                          type='button'
                          data-active={isActive}
                          disabled={disabled}
                          onClick={() => handleSelectMonth(index)}
                          className={cn(
                            'w-full rounded-lg px-3 py-2.5 text-left text-sm transition',
                            isActive
                              ? 'bg-rc-red font-semibold text-white'
                              : 'text-slate-800 hover:bg-rc-red/10 hover:text-rc-red',
                            disabled &&
                              'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-slate-400'
                          )}>
                          {monthName}
                        </button>
                      );
                    })}
                  </div>
                </VerticalPicker>
              ) : null}

              {pickerView === 'year' ? (
                <VerticalPicker
                  title='Pilih Tahun'
                  onBack={() => setPickerView('calendar')}>
                  <div ref={yearListRef} className='flex flex-col gap-0.5'>
                    {yearOptions.map((year) => {
                      const isActive = year === viewYear;

                      return (
                        <button
                          key={year}
                          type='button'
                          data-active={isActive}
                          onClick={() => handleSelectYear(year)}
                          className={cn(
                            'w-full rounded-lg px-3 py-2.5 text-left text-sm transition',
                            isActive
                              ? 'bg-rc-red font-semibold text-white'
                              : 'text-slate-800 hover:bg-rc-red/10 hover:text-rc-red'
                          )}>
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </VerticalPicker>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        id={id}
        type='button'
        onClick={openDialog}
        className={cn(
          'flex h-[42px] w-full items-center justify-between rounded-sm border bg-white/80 px-3.5 py-2.5 text-left text-sm transition',
          open
            ? 'border-rc-red/70 ring-1 ring-rc-red/30'
            : 'border-neutral-300 hover:border-neutral-400 focus:border-rc-red/70 focus:outline-none focus:ring-1 focus:ring-rc-red/30'
        )}>
        <span
          className={cn(
            'truncate',
            value ? 'text-neutral-900' : 'text-neutral-400'
          )}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Icon
          icon='mdi:calendar-month-outline'
          className='h-5 w-5 shrink-0 text-neutral-500'
          aria-hidden
        />
      </button>

      {name ? <input type='hidden' name={name} value={value} readOnly /> : null}

      {dialog}
    </>
  );
}

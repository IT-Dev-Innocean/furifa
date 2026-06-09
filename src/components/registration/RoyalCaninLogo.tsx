export function RoyalCaninLogo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center ${className}`}
      aria-label='Royal Canin'>
      <img
        src='/assets/rc-logo.svg'
        alt='Royal Canin'
        className='h-auto w-[min(200px,60vw)] object-contain'
      />
    </div>
  );
}

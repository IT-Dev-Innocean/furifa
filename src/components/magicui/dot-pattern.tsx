import { cn } from '@/lib/utils';

interface DotPatternProps {
  className?: string;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
}

export function DotPattern({
  className,
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
}: DotPatternProps) {
  return (
    <svg
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/20',
        className
      )}>
      <defs>
        <pattern
          id='dot-pattern'
          x='0'
          y='0'
          width={width}
          height={height}
          patternUnits='userSpaceOnUse'>
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#dot-pattern)' />
    </svg>
  );
}

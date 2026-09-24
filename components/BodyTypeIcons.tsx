interface BodyTypeIconProps {
  className?: string;
}

const WHEEL_PROPS = {
  r: 9,
  fill: "#292524",
} as const;

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={WHEEL_PROPS.r} fill={WHEEL_PROPS.fill} />
      <circle cx={cx} cy={cy} r={3.2} fill="#fafaf9" />
    </>
  );
}

const bodyProps = {
  fill: "#ffffff",
  stroke: "#57534e",
  strokeWidth: 1.6,
  strokeLinejoin: "round" as const,
};

export function VanIcon({ className = "h-16 w-auto" }: BodyTypeIconProps) {
  return (
    <svg className={className} viewBox="0 0 220 100" fill="none">
      <path
        {...bodyProps}
        d="M18 66V38a8 8 0 0 1 8-8h134a10 10 0 0 1 9.3 6.3L182 62v4H18Z"
      />
      <path d="M40 30v32M182 66H18" stroke="#a8a29e" strokeWidth={1.2} />
      <Wheel cx={54} cy={70} />
      <Wheel cx={158} cy={70} />
    </svg>
  );
}

export function ConvertibleIcon({
  className = "h-16 w-auto",
}: BodyTypeIconProps) {
  return (
    <svg className={className} viewBox="0 0 220 100" fill="none">
      <path
        {...bodyProps}
        d="M20 66c0-10 8-16 20-19l14-12c8-4 20-6 30-6h44c14 0 28 8 34 20l4 8v9H20Z"
      />
      <path
        d="M54 47c6-4 14-7 22-7M96 41h34"
        stroke="#a8a29e"
        strokeWidth={1.2}
      />
      <Wheel cx={56} cy={70} />
      <Wheel cx={160} cy={70} />
    </svg>
  );
}

export function CoupeIcon({ className = "h-16 w-auto" }: BodyTypeIconProps) {
  return (
    <svg className={className} viewBox="0 0 220 100" fill="none">
      <path
        {...bodyProps}
        d="M18 66c0-9 7-15 18-17l10-15c6-6 15-9 24-9h30c11 0 21 6 26 16l14 17c8 1 14 4 14 8v9H18Z"
      />
      <path
        d="M46 49c5-8 12-13 20-14M78 34h34"
        stroke="#a8a29e"
        strokeWidth={1.2}
      />
      <Wheel cx={45} cy={75} />
      <Wheel cx={125} cy={75} />
    </svg>
  );
}

export function PickupIcon({ className = "h-16 w-auto" }: BodyTypeIconProps) {
  return (
    <svg className={className} viewBox="0 0 220 100" fill="none">
      <path
        {...bodyProps}
        d="M14 66c0-6 5-10 12-10h6l10-18c5-7 13-11 21-11h20c9 0 17 5 21 13l6 12h14a30 30 0 0 1 22 10l6 4v4H14Z"
      />
      <path d="M32 56h100M78 27v29" stroke="#a8a29e" strokeWidth={1.2} />
      <Wheel cx={45} cy={75} />
      <Wheel cx={125} cy={75} />
    </svg>
  );
}

export function CrossoverIcon({
  className = "h-16 w-auto",
}: BodyTypeIconProps) {
  return (
    <svg className={className} viewBox="0 0 220 100" fill="none">
      <path
        {...bodyProps}
        d="M16 66c0-8 6-13 15-15l9-16c6-7 15-11 24-11h28c10 0 19 5 24 14l10 15c10 1 20 5 26 11l4 3v9H16Z"
      />
      <path
        d="M42 51c5-9 13-15 22-16M76 35h36"
        stroke="#a8a29e"
        strokeWidth={1.2}
      />
      <Wheel cx={45} cy={75} />
      <Wheel cx={125} cy={75} />
    </svg>
  );
}

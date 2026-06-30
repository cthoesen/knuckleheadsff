'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'league' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  glow?: boolean;
  as?: 'button' | 'a';
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

/**
 * Button — the arcade-cabinet action control.
 * `league` variant + a `.league-*` ancestor re-tints to that league's hue.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  glow = true,
  as = 'button',
  className = '',
  style = {},
  ...rest
}: ButtonProps) {
  const sizes: Record<Size, React.CSSProperties> = {
    sm: { padding: '7px 14px', fontSize: 'var(--text-xs)', gap: '7px' },
    md: { padding: '11px 20px', fontSize: 'var(--text-sm)', gap: '9px' },
    lg: { padding: '15px 30px', fontSize: 'var(--text-base)', gap: '11px' },
  };
  const s = sizes[size] || sizes.md;

  const accent = variant === 'primary' ? 'var(--kff-yellow)' : 'var(--league-color)';

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: s.fontSize,
    lineHeight: 1,
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '2px solid',
    borderRadius: 'var(--radius-xs)',
    transition:
      'transform var(--dur-fast) var(--ease-snap), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base), color var(--dur-base), border-color var(--dur-base)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...style,
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: accent,
      color: 'var(--kff-ink-inv)',
      borderColor: accent,
      boxShadow: glow ? 'var(--glow-yellow)' : 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--league-color)',
      borderColor: 'var(--league-color)',
      boxShadow: glow ? 'var(--glow-sm)' : 'none',
    },
    league: {
      background: 'var(--league-color)',
      color: 'var(--kff-ink-inv)',
      borderColor: 'var(--league-color)',
      boxShadow: glow ? 'var(--glow-md)' : 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--kff-ink-dim)',
      borderColor: 'var(--kff-line-2)',
      boxShadow: 'none',
    },
  };

  const disabledStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--kff-ink-mute)',
    borderColor: 'var(--kff-line)',
    boxShadow: 'none',
    opacity: 0.7,
  };

  const styleFinal: React.CSSProperties = {
    ...base,
    ...(disabled ? disabledStyle : variants[variant] || variants.primary),
  };

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || !glow) return;
    e.currentTarget.style.boxShadow = 'var(--glow-lg)';
    if (variant === 'secondary') e.currentTarget.style.color = 'var(--league-color-bright)';
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.currentTarget.style.boxShadow = (styleFinal.boxShadow as string) || 'none';
    if (variant === 'secondary') e.currentTarget.style.color = 'var(--league-color)';
  };
  const onDown = (e: React.MouseEvent<HTMLElement>) => { if (!disabled) e.currentTarget.style.transform = 'translateY(2px)'; };
  const onUp = (e: React.MouseEvent<HTMLElement>) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0)'; };

  const Tag: any = as;
  return (
    <Tag
      className={className}
      style={styleFinal}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Tag>
  );
}

'use client';

import React from 'react';

interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  [key: string]: any;
}

/**
 * Input — terminal-style text field. Mono font, hairline border that lights
 * to the league hue on focus with a glow. Supports label, prefix glyph, hint.
 */
export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  size = 'md',
  className = '',
  style = {},
  id,
  ...rest
}: InputProps) {
  const [focused, setFocused] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;
  const pad: Record<string, string> = { sm: '8px 10px', md: '11px 13px', lg: '14px 16px' };
  const borderColor = error ? 'var(--kff-red)' : focused ? 'var(--league-color)' : 'var(--kff-line-2)';

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '7px', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink-dim)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--surface-inset)',
          border: '1px solid', borderColor,
          borderRadius: 'var(--radius-sm)',
          padding: pad[size] || pad.md,
          boxShadow: focused && !error
            ? '0 0 0 1px var(--league-color), 0 0 14px color-mix(in srgb, var(--league-color) 30%, transparent)'
            : error ? '0 0 0 1px var(--kff-red)' : 'none',
          transition: 'border-color var(--dur-base), box-shadow var(--dur-base)',
        }}
      >
        {prefix && <span style={{ color: 'var(--kff-ink-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0, display: 'inline-flex' }}>{prefix}</span>}
        <input
          id={inputId}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          {...rest}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--kff-ink)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            letterSpacing: '0.02em',
          }}
        />
        {suffix && <span style={{ color: 'var(--kff-ink-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: error ? 'var(--kff-red)' : 'var(--kff-ink-mute)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

"use client";
import type React from "react";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<React.CSSProperties>({});

  // Calculate position before render
  useLayoutEffect(() => {
    if (isOpen) {
      const triggerButton = document.querySelector('.dropdown-toggle');
      if (triggerButton) {
        const rect = triggerButton.getBoundingClientRect();
        setPosition({
          position: 'fixed',
          top: `${rect.bottom + 4}px`,
          right: `${window.innerWidth - rect.right}px`,
          backgroundColor: 'white',
          opacity: 1,
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-toggle')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      // Prevent body scroll when dropdown is open (optional, có thể bỏ nếu không muốn)
      // document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // document.body.style.overflow = '';
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const dropdownContent = (
    <>
      {/* Backdrop/Overlay để chặn click vào content bên dưới */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[9998] bg-black/0"
        style={{ pointerEvents: 'auto' }}
        aria-hidden="true"
      />
      
      {/* Dropdown Content - z-index cao và background không transparent */}
      <div
        ref={dropdownRef}
        style={position}
        className={`fixed z-[9999] rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-dark ${className}`}
      >
        {children}
      </div>
    </>
  );

  // Render với Portal để đảm bảo z-index hoạt động đúng và không bị ảnh hưởng bởi parent container
  if (typeof window !== 'undefined') {
    return createPortal(dropdownContent, document.body);
  }

  return null;
};
